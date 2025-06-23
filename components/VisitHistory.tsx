import React, { useState, useEffect } from 'react';
import Input from './Input.tsx';

interface HistoryVisit {
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
  endTime?: string;
  status: string;
}

const VisitHistory: React.FC = () => {
  const [visits, setVisits] = useState<HistoryVisit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<HistoryVisit[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Establecer fecha actual como filtro por defecto
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    fetchVisits();
  }, []);

  useEffect(() => {
    filterVisits();
  }, [visits, startDate, endDate]);

  const fetchVisits = async () => {
    try {
      const response = await fetch('http://localhost:3001/visits');
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const filterVisits = () => {
    let filtered = visits;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      if (endDate) {
        // Filtrar por rango de fechas
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filtered = filtered.filter(visit => {
          const visitDate = new Date(visit.createdAt);
          return visitDate >= start && visitDate <= end;
        });
      } else {
        // Filtrar solo por fecha inicial
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);

        filtered = filtered.filter(visit => {
          const visitDate = new Date(visit.createdAt);
          return visitDate >= start && visitDate < nextDay;
        });
      }
    }

    // Ordenar por fecha de creación (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredVisits(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ca-ES');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ca-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Finalitzada</span>;
      case 'active':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Activa</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendent</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Històric de Visites</h1>
      
      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium whitespace-nowrap">Data inicial:</label>
          <Input
            type="date"
            value={startDate}
            onChange={setStartDate}
            className="flex-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium whitespace-nowrap">Data final:</label>
          <Input
            type="date"
            value={endDate}
            onChange={setEndDate}
            className="flex-1"
            placeholder="Opcional - deixar buit per filtrar només per data inicial"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="font-medium">
          {filteredVisits.length} visites trobades
        </span>
        {startDate && (
          <span className="ml-2">
            {endDate 
              ? `(del ${formatDate(startDate)} al ${formatDate(endDate)})`
              : `(del ${formatDate(startDate)})`
            }
          </span>
        )}
      </div>

      {/* Visits Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">DNI</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Nom Visitant</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Empleat Visitat</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">DG</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Un. Org.</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Núm. Targeta</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Color</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Visitants</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Data</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">H. Entrada</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">H. Sortida</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium">Estat</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr>
                <td colSpan={12} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No s'han trobat visites per als criteris seleccionats
                </td>
              </tr>
            ) : (
              filteredVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visitor.dni}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visitor.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visit.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visit.dg}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visit.orgUnit}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visitor.cardNumber}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.visitor.color}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                    {visit.visitor.visitors}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {formatDate(visit.createdAt)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {formatTime(visit.createdAt)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {visit.endTime ? formatTime(visit.endTime) : '-'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">
                    {getStatusBadge(visit.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export/Print Actions */}
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium transition-colors"
        >
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default VisitHistory;