import React, { useState, useEffect } from 'react';
import Button from './Button.tsx';
import Input from './Input.tsx';
import Select from './Select.tsx';
import TextArea from './TextArea.tsx';
import SearchPopup, { SearchResult }  from './SearchPopup.tsx';
import { API_BASE_URL } from '../apiConfig.ts';
import { FaBuilding, FaUser } from 'react-icons/fa';

interface VisitorCoreData {
  dni: string;
  name: string;
  company: string;
}

// Detalles que pertenecen a cada visita específica
interface VisitDetailsData {
  reason: string;
  cardNumber: string;
  visitors: number;
  color: string;
  observations: string;
}

// Combinamos las interfaces para el estado del formulario, para no cambiar el JSX
type FormVisitorState = VisitorCoreData & VisitDetailsData;

interface Employee {
  id: number;
  name: string;
  dg: string;
  orgUnit: string;
  service: string;
  location: string;
  phone: string;
}

interface VisitData {
  name: string;
  dg: string;
  orgUnit: string;
  service: string;
  location: string;
  phone: string;
}

function isGenericIDValid(dni: string): boolean {
  const trimmed = dni.trim();
  // Admite letras, números, guiones, y puntos. Longitud entre 4 y 20 caracteres.
  return /^[A-Za-z0-9\-\.]{4,20}$/.test(trimmed);
}

const VisitForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [visitor, setVisitor] = useState<FormVisitorState>({
    dni: '',
    name: '',
    company: '',
    reason: '',
    cardNumber: '',
    visitors: 1,
    color: '',
    observations: ''
  });

  const [visit, setVisit] = useState<VisitData>({
    name: '',
    dg: '',
    orgUnit: '',
    service: '',
    location: '',
    phone: ''
  });

  const [unknownVisitor, setUnknownVisitor] = useState(false);
  const [dniError, setDniError] = useState<string>('');
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [popupTitle, setPopupTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para feedback al usuario

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleVisitorChange = (field: keyof FormVisitorState, value: string | number) => {
    if (field === 'dni') setDniError('');
    setVisitor(prev => ({ ...prev, [field]: value }));
  };

  const handleVisitChange = (field: keyof VisitData, value: string) => {
    setVisit(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeSelect = (employeeName: string) => {
    const employee = employees.find(emp => emp.name === employeeName);
    if (employee) {
      setSelectedEmployee(employee);
      setVisit({
        name: employee.name,
        dg: employee.dg,
        orgUnit: employee.orgUnit,
        service: employee.service,
        location: employee.location,
        phone: employee.phone
      });
    }
  };

  const handleSearch = async (searchType: 'dni' | 'name') => {
    const searchTerm = searchType === 'dni' ? visitor.dni : visitor.name;
    if (!searchTerm.trim()) {
      alert(`Si us plau, introdueix un ${searchType} per a buscar.`);
      return;
    }

    setIsLoading(true);
    setPopupTitle(`Cercant per ${searchType}...`);

    try {
      // Usamos los parámetros _like que nuestro backend ahora entiende
      const queryParam = searchType === 'dni' 
        ? `dni_like=${searchTerm}` 
        : `name_like=${searchTerm}`;

      const response = await fetch(`${API_BASE_URL}/visits?${queryParam}`);
      const data: SearchResult[] = await response.json();

      // Desduplicamos los resultados para mostrar cada visitante una sola vez
      const uniqueVisitors: SearchResult[] = [];
      const seenDnis = new Set<string>();
      data.forEach(v => {
        if (v.visitor && v.visitor.dni && !seenDnis.has(v.visitor.dni)) {
          seenDnis.add(v.visitor.dni);
          uniqueVisitors.push(v);
        }
      });
      
      setSearchResults(uniqueVisitors);
      setPopupTitle(`Resultats de la cerca per "${searchTerm}"`);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error searching visitor:', error);
      alert('Hi ha hagut un error en la cerca.');
    } finally {
      setIsLoading(false);
    }
  };

    const handleSelectVisitor = (selectedVisitorData: FormVisitorState) => {
    setVisitor(currentState => ({
      ...currentState, // Mantiene los valores actuales de los detalles (motivo, tarjeta, etc.)
      // Sobrescribe solo los datos de identidad del visitante
      dni: selectedVisitorData.dni,
      name: selectedVisitorData.name,
      company: selectedVisitorData.company,
    }));
    setIsPopupOpen(false); // Cierra el popup
  };

  const handleSubmit = async () => {
    if (!unknownVisitor && !isGenericIDValid(visitor.dni)) {
      setDniError('El format del DNI no és vàlid. Ha de contenir entre 4 i 20 caràcters (lletres, números, guions o punts).');
      return; // Detenemos el envío del formulario
    }

    if (!selectedEmployee) {
        alert('Si us plau, selecciona un empleat a visitar.');
        return;
    }

    // Si la validación es correcta, nos aseguramos de que no haya mensaje de error
    setDniError('');
    const visitData = {
      visitor,
      visit,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      if (response.ok) {
        alert('Visita registrada correctamente');
        // Reset form
        setVisitor({
          dni: '',
          name: '',
          company: '',
          reason: '',
          cardNumber: '',
          visitors: 1,
          color: '',
          observations: ''
        });
        setVisit({
          name: '',
          dg: '',
          orgUnit: '',
          service: '',
          location: '',
          phone: ''
        });
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error('Error submitting visit:', error);
      alert('Error al registrar la visita');
    }
  };

  const cancelVisitor = () => {
    setVisitor({
      dni: '',
      name: '',
      company: '',
      reason: '',
      cardNumber: '',
      visitors: 1,
      color: '',
      observations: ''
    });
  };

  const cancelVisit = () => {
    setVisit({
      name: '',
      dg: '',
      orgUnit: '',
      service: '',
      location: '',
      phone: ''
    });
    setSelectedEmployee(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* RENDERIZADO DEL POPUP */}
      {isPopupOpen && (
        <SearchPopup
          results={searchResults}
          onSelect={handleSelectVisitor}
          onClose={() => setIsPopupOpen(false)}
          title={popupTitle}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VISITANT Section */}
        <div className="space-y-4">
          <div className="section-header bg-primary mb-6 flex items-center justify-center space-x-2">
            <FaUser />
            <span>Visitant</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">DNI:</label>
            <Input
              value={visitor.dni}
              onChange={(value) => handleVisitorChange('dni', value)}
              className="flex-1"
            />
            <Button onClick={() => handleSearch('dni')} variant="secondary" size="sm" disabled={isLoading}>
              {isLoading ? 'Cercant...' : 'Cercar'}
            </Button>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="desconegut"
                checked={unknownVisitor}
                onChange={(e) => setUnknownVisitor(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="desconegut" className="text-sm">Desconegut</label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Nom:</label>
            <Input
              value={visitor.name}
              onChange={(value) => handleVisitorChange('name', value)}
              className="flex-1"
            />
            <Button onClick={() => handleSearch('name')} variant="secondary" size="sm" disabled={isLoading}>
              {isLoading ? 'Cercant...' : 'Cercar'}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Empresa:</label>
            <Input
              value={visitor.company}
              onChange={(value) => handleVisitorChange('company', value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Motiu:</label>
            <Input
              value={visitor.reason}
              onChange={(value) => handleVisitorChange('reason', value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Núm. targeta:</label>
              <Input
                value={visitor.cardNumber}
                onChange={(value) => handleVisitorChange('cardNumber', value)}
                className="w-20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Visitants:</label>
              <Input
                type="number"
                value={visitor.visitors.toString()}
                onChange={(value) => handleVisitorChange('visitors', parseInt(value) || 1)}
                className="w-16"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Color:</label>
              <Input
                value={visitor.color}
                onChange={(value) => handleVisitorChange('color', value)}
                className="w-24"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Observacions:</label>
            <TextArea
              value={visitor.observations}
              onChange={(value) => handleVisitorChange('observations', value)}
              rows={4}
            />
          </div>
        </div>

        {/* VISITA Section */}
        <div className="space-y-4">
          <div className="section-header bg-accent mb-6 flex items-center justify-center space-x-2">
            <FaBuilding />
            <span>Visita</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-20 text-sm font-medium">Cerca per cognom:</label>
            <Input
              placeholder="Buscar empleado..."
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Nom:</label>
            <Select
              value={visit.name}
              onChange={(value) => {
                handleVisitChange('name', value);
                handleEmployeeSelect(value);
              }}
              options={employees.map(emp => ({ value: emp.name, label: emp.name }))}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">DG:</label>
            <Select
              value={visit.dg}
              onChange={(value) => handleVisitChange('dg', value)}
              options={[...new Set(employees.map(emp => emp.dg))].map(dg => ({ value: dg, label: dg }))}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Un.Org.:</label>
            <Select
              value={visit.orgUnit}
              onChange={(value) => handleVisitChange('orgUnit', value)}
              options={[...new Set(employees.map(emp => emp.orgUnit))].map(unit => ({ value: unit, label: unit }))}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-16 text-sm font-medium">Servei:</label>
            <Select
              value={visit.service}
              onChange={(value) => handleVisitChange('service', value)}
              options={[...new Set(employees.map(emp => emp.service))].map(service => ({ value: service, label: service }))}
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <label className="text-sm font-medium">Ubicació:</label>
              <Input
                value={visit.location}
                onChange={(value) => handleVisitChange('location', value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Telèfon:</label>
              <Input
                value={visit.phone}
                onChange={(value) => handleVisitChange('phone', value)}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <Button onClick={handleSubmit} variant="primary" size="lg">
          Acceptar
        </Button>
      </div>

      {dniError && (
        <div className="text-center mt-4 text-red-600 font-semibold">
          {dniError}
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-4">
        <Button onClick={cancelVisitor} variant="secondary">
          Cancel·lar visitant
        </Button>
        <Button onClick={cancelVisit} variant="secondary">
          Cancel·lar visita
        </Button>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="secondary">
          Deixar pendent
        </Button>
        <Button variant="secondary">
          Veure pendents
        </Button>
      </div>
    </div>
  );
};

export default VisitForm;