import React, { useState, useEffect } from 'react';
import Button from './Button.tsx';
import Input from './Input.tsx';
import TextArea from './TextArea.tsx';

interface Visitor {
  id: number;
  visitor: {
    dni: string;
    name: string;
    company: string;
    cardNumber: string;
    visitors: number;
    color: string;
  };
  visit: {
    name: string;
    dg: string;
    orgUnit: string;
    service: string;
    location: string;
    phone: string;
  };
  createdAt: string;
  status: string;
}

interface DischargeModalProps {
  visitor: Visitor | null;
  isOpen: boolean;
  onClose: () => void;
  onDischarge: (id: number, observations: string) => void;
}

const DischargeModal: React.FC<DischargeModalProps> = ({ visitor, isOpen, onClose, onDischarge }) => {
  const [observations, setObservations] = useState('');

  if (!isOpen || !visitor) return null;

  const handleDischarge = () => {
    onDischarge(visitor.id, observations);
    setObservations('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Baixa del Visitant</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Datos del Visitante */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 border-b pb-1">Dades del Visitant</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">DNI:</span> {visitor.visitor.dni}</div>
              <div><span className="font-medium">Nom:</span> {visitor.visitor.name}</div>
              <div><span className="font-medium">Empresa:</span> {visitor.visitor.company}</div>
              <div><span className="font-medium">Núm. Targeta:</span> {visitor.visitor.cardNumber}</div>
              <div><span className="font-medium">Visitants:</span> {visitor.visitor.visitors}</div>
              <div><span className="font-medium">Color:</span> {visitor.visitor.color}</div>
            </div>
          </div>

          {/* Datos de la Visita */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 border-b pb-1">Dades de la Visita</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Visita a:</span> {visitor.visit.name}</div>
              <div><span className="font-medium">DG:</span> {visitor.visit.dg}</div>
              <div><span className="font-medium">Un.Org.:</span> {visitor.visit.orgUnit}</div>
              <div><span className="font-medium">Servei:</span> {visitor.visit.service}</div>
              <div><span className="font-medium">Ubicació:</span> {visitor.visit.location}</div>
              <div><span className="font-medium">Telèfon:</span> {visitor.visit.phone}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Observacions de sortida (opcional):</label>
          <TextArea
            value={observations}
            onChange={setObservations}
            placeholder="Afegeix observacions sobre la sortida del visitant..."
            rows={4}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={handleDischarge} variant="primary">
            Confirmar Baixa
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel·lar
          </Button>
        </div>
      </div>
    </div>
  );
};

const VisitorDischarge: React.FC = () => {
  const [activeVisitors, setActiveVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [searchCard, setSearchCard] = useState('');
  const [searchDni, setSearchDni] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchActiveVisitors();
  }, []);

  useEffect(() => {
    filterVisitors();
  }, [activeVisitors, searchCard, searchDni]);

  const fetchActiveVisitors = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:3001/visits?status=active&date=${today}`);
      const data = await response.json();
      setActiveVisitors(data);
    } catch (error) {
      console.error('Error fetching active visitors:', error);
    }
  };

  const filterVisitors = () => {
    let filtered = activeVisitors;

    if (searchCard) {
      filtered = filtered.filter(visitor => 
        visitor.visitor.cardNumber.toLowerCase().includes(searchCard.toLowerCase())
      );
    }

    if (searchDni) {
      filtered = filtered.filter(visitor => 
        visitor.visitor.dni.toLowerCase().includes(searchDni.toLowerCase())
      );
    }

    setFilteredVisitors(filtered);
  };

  const handleRowClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  };

  const handleDischarge = async (visitorId: number, observations: string) => {
    try {
      const response = await fetch(`http://localhost:3001/visits/${visitorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          endTime: new Date().toISOString(),
          dischargeObservations: observations
        }),
      });

      if (response.ok) {
        alert('Visitant donat de baixa correctament');
        fetchActiveVisitors(); // Refresh the list
      } else {
        throw new Error('Error updating visitor status');
      }
    } catch (error) {
      console.error('Error discharging visitor:', error);
      alert('Error al donar de baixa el visitant');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ca-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Baixa del Visitant</h1>
      
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium whitespace-nowrap">Codi targeta:</label>
          <Input
            value={searchCard}
            onChange={setSearchCard}
            placeholder="Buscar per codi de targeta..."
            className="flex-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium whitespace-nowrap">DNI:</label>
          <Input
            value={searchDni}
            onChange={setSearchDni}
            placeholder="Buscar per DNI..."
            className="flex-1"
          />
        </div>
      </div>

      {/* Visitors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Hora Entrada</th>
              <th className="border border-gray-300 px-4 py-2 text-left">DNI</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nom Visitant</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Empresa</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Targeta</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Visita a</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Ubicació</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No hi ha visitants actius
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr
                  key={visitor.id}
                  onClick={() => handleRowClick(visitor)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {formatTime(visitor.createdAt)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visitor.dni}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visitor.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visitor.company}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visitor.cardNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visit.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {visitor.visit.location}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DischargeModal
        visitor={selectedVisitor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDischarge={handleDischarge}
      />
    </div>
  );
};

export default VisitorDischarge;