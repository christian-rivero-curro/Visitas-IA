import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig.ts';
import { SearchResult } from '../components/SearchPopup.tsx';

interface VisitorCoreData {
  dni: string;
  name: string;
  company: string;
}

interface VisitDetailsData {
  reason: string;
  cardNumber: string;
  visitors: number;
  color: string;
  observations: string;
}

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
  return /^[A-Za-z0-9\-\.]{4,20}$/.test(trimmed);
}

export const useVisitForm = () => {
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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearch = async (searchType: 'dni' | 'name', searchTerm: string) => {

    if (!searchTerm.trim()) {
      alert(`Si us plau, introdueix un ${searchType} per a buscar.`);
      return;
    }

    setIsLoading(true);
    setPopupTitle(`Cercant per ${searchType}...`);

    try {
      const queryParam = searchType === 'dni' 
        ? `dni_like=${encodeURIComponent(searchTerm)}` 
        : `name_like=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(`${API_BASE_URL}/visits?${queryParam}`);
      const data: SearchResult[] = await response.json();

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
      ...currentState,
      dni: selectedVisitorData.dni,
      name: selectedVisitorData.name,
      company: selectedVisitorData.company,
    }));
    setIsPopupOpen(false);
  };

  const handleUnknownVisitorChange = (value: boolean) => {
    setUnknownVisitor(value);
    if (value) {
      // Limpiar DNI y nombre cuando se marca como desconocido
      setVisitor(prev => ({
        ...prev,
        dni: '',
        name: ''
      }));
      setDniError(''); // Limpiar cualquier error de DNI
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const finalVisitorData = unknownVisitor ? {
      ...visitor,
      dni: 'Desconegut',
      name: 'Desconegut'
    } : visitor;
  
    if (!unknownVisitor && !isGenericIDValid(visitor.dni)) {
      setDniError('El format del DNI no és vàlid. Ha de contenir entre 4 i 20 caràcters (lletres, números, guions o punts).');
      return;
    }
  
    if (!selectedEmployee) {
      alert('Si us plau, selecciona un empleat a visitar.');
      return;
    }
  
    setDniError('');
  
    const visitorData = {
      dni: finalVisitorData.dni,
      name: finalVisitorData.name,
      company: finalVisitorData.company,
    };

    const visitDetailsData = {
      reason: visitor.reason,
      cardNumber: visitor.cardNumber,
      visitors: visitor.visitors,
      color: visitor.color,
      observations: visitor.observations,
    };

    const visitPayload = {
      employeeId: selectedEmployee.id,
      ...visit,
    };

    const visitData = {
      visitor: visitorData,
      visitDetails: visitDetailsData,
      visit: visitPayload,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la visita');
      }
      
      // Si la respuesta es exitosa, procesar la respuesta
      const data = await response.json();
      const visitId = data.visitId || data.id; // Asegurarse de capturar el ID de la respuesta
      
      if (!visitId) {
        throw new Error('No se pudo obtener el ID de la visita');
      }
      
      alert('Visita registrada correctament');
      resetForm();
    } catch (error) {
      console.error('Error submitting visit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar la visita';
      alert(errorMessage);
      throw error; // Relanzar el error para manejarlo en el componente
    }
  };

  const loadLastVisit = async () => {
    try {
      const response = await fetch('http://localhost:3001/visits');
      const data = await response.json();
      
      if (data.length > 0) {
        const sortedVisits = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const lastVisit = sortedVisits[0];
        
        setVisit({
          name: lastVisit.visit.name || '',
          dg: lastVisit.visit.dg || '',
          orgUnit: lastVisit.visit.orgUnit || '',
          service: lastVisit.visit.service || '',
          location: lastVisit.visit.location || '',
          phone: lastVisit.visit.phone || ''
        });
        
        const employee = employees.find(emp => emp.name === lastVisit.visit.name);
        if (employee) {
          setSelectedEmployee(employee);
        }
      }
    } catch (error) {
      console.error('Error loading last visit:', error);
    }
  };

  const resetForm = () => {
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

  return {
    // State
    employees,
    visitor,
    visit,
    unknownVisitor,
    dniError,
    isPopupOpen,
    searchResults,
    popupTitle,
    isLoading,
    // Actions
    handleVisitorChange,
    handleVisitChange,
    handleEmployeeSelect,
    handleSearch,
    handleSelectVisitor,
    handleSubmit,
    loadLastVisit,
    cancelVisitor,
    cancelVisit,
    handleUnknownVisitorChange,
    setIsPopupOpen
  };
};