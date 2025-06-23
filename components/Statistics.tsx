import React, { useState, useEffect } from 'react';

interface VisitStats {
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

interface WeekdayStats {
  day: string;
  dayName: string;
  count: number;
  percentage: number;
}

interface OrgUnitStats {
  orgUnit: string;
  count: number;
  percentage: number;
}

const Statistics: React.FC = () => {
  const [visits, setVisits] = useState<VisitStats[]>([]);
  const [weekdayStats, setWeekdayStats] = useState<WeekdayStats[]>([]);
  const [orgUnitStats, setOrgUnitStats] = useState<OrgUnitStats[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (visits.length > 0) {
      calculateWeekdayStats();
      calculateOrgUnitStats();
    }
  }, [visits]);

  const fetchVisits = async () => {
    try {
      const response = await fetch('http://localhost:3001/visits');
      const data = await response.json();
      setVisits(data);
      setTotalVisits(data.length);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const calculateWeekdayStats = () => {
    const weekdays = [
      { key: 1, name: 'Dilluns' },
      { key: 2, name: 'Dimarts' },
      { key: 3, name: 'Dimecres' },
      { key: 4, name: 'Dijous' },
      { key: 5, name: 'Divendres' }
    ];

    const dayCount: { [key: number]: number } = {};
    
    // Inicializar contadores
    weekdays.forEach(day => {
      dayCount[day.key] = 0;
    });

    // Contar visitas por día de la semana (solo días laborables)
    visits.forEach(visit => {
      const date = new Date(visit.createdAt);
      const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Solo días laborables
        dayCount[dayOfWeek]++;
      }
    });

    const workdayVisits = Object.values(dayCount).reduce((sum, count) => sum + count, 0);

    const stats: WeekdayStats[] = weekdays.map(day => ({
      day: day.key.toString(),
      dayName: day.name,
      count: dayCount[day.key],
      percentage: workdayVisits > 0 ? (dayCount[day.key] / workdayVisits) * 100 : 0
    }));

    setWeekdayStats(stats);
  };

  const calculateOrgUnitStats = () => {
    const orgUnitCount: { [key: string]: number } = {};

    // Contar visitas por unidad orgánica
    visits.forEach(visit => {
      const orgUnit = visit.visit.orgUnit || 'Sense especificar';
      orgUnitCount[orgUnit] = (orgUnitCount[orgUnit] || 0) + 1;
    });

    // Filtrar solo unidades con más de 1 visita y crear estadísticas
    const stats: OrgUnitStats[] = Object.entries(orgUnitCount)
      .filter(([_, count]) => count > 1)
      .map(([orgUnit, count]) => ({
        orgUnit,
        count,
        percentage: totalVisits > 0 ? (count / totalVisits) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count); // Ordenar por número de visitas descendente

    setOrgUnitStats(stats);
  };

  const getBarColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  const maxWeekdayCount = Math.max(...weekdayStats.map(stat => stat.count));
  const maxOrgUnitCount = Math.max(...orgUnitStats.map(stat => stat.count));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Estadístiques de Visites</h1>
      
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{totalVisits}</div>
          <div className="text-sm text-blue-800">Total Visites</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {visits.filter(v => v.status === 'active').length}
          </div>
          <div className="text-sm text-green-800">Visites Actives</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(visits.map(v => v.visit.orgUnit)).size}
          </div>
          <div className="text-sm text-purple-800">Unitats Orgàniques</div>
        </div>
      </div>

      {/* Estadísticas por Día de la Semana */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Visites per Dia de la Setmana</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            {weekdayStats.map((stat, index) => (
              <div key={stat.day} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-right">
                  {stat.dayName}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full ${getBarColor(index)} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{
                      width: maxWeekdayCount > 0 ? `${(stat.count / maxWeekdayCount) * 100}%` : '0%'
                    }}
                  >
                    {stat.count > 0 && (
                      <span className="text-white text-xs font-medium">
                        {stat.count}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-16 text-xs text-gray-600 text-right">
                  {stat.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas por Unidad Orgánica */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Visites per Unitat Orgànica 
          <span className="text-sm font-normal text-gray-600 ml-2">
            (amb més d'1 visita)
          </span>
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {orgUnitStats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hi ha unitats orgàniques amb més d'una visita
            </div>
          ) : (
            <div className="space-y-3">
              {orgUnitStats.map((stat, index) => (
                <div key={stat.orgUnit} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-right truncate" title={stat.orgUnit}>
                    {stat.orgUnit}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`h-6 rounded-full ${getBarColor(index + 2)} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{
                        width: maxOrgUnitCount > 0 ? `${(stat.count / maxOrgUnitCount) * 100}%` : '0%'
                      }}
                    >
                      {stat.count > 0 && (
                        <span className="text-white text-xs font-medium">
                          {stat.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-xs text-gray-600 text-right">
                    {stat.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabla Detallada de Días de la Semana */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Detall per Dies de la Setmana</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Dia</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Nombre de Visites</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Percentatge</th>
              </tr>
            </thead>
            <tbody>
              {weekdayStats.map((stat) => (
                <tr key={stat.day} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {stat.dayName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {stat.count}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {stat.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla Detallada de Unidades Orgánicas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Detall per Unitats Orgàniques</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Unitat Orgànica</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Nombre de Visites</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Percentatge</th>
              </tr>
            </thead>
            <tbody>
              {orgUnitStats.map((stat) => (
                <tr key={stat.orgUnit} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {stat.orgUnit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                    {stat.count}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {stat.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;