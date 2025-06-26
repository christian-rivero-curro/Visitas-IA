import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig.ts';

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
      const response = await fetch(`${API_BASE_URL}/visits`);
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
    
    weekdays.forEach(day => {
      dayCount[day.key] = 0;
    });

    visits.forEach(visit => {
      const date = new Date(visit.createdAt);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
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

    visits.forEach(visit => {
      const orgUnit = visit.visit.orgUnit || 'Sense especificar';
      orgUnitCount[orgUnit] = (orgUnitCount[orgUnit] || 0) + 1;
    });

    const stats: OrgUnitStats[] = Object.entries(orgUnitCount)
      .filter(([_, count]) => count > 1)
      .map(([orgUnit, count]) => ({
        orgUnit,
        count,
        percentage: totalVisits > 0 ? (count / totalVisits) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    setOrgUnitStats(stats);
  };

  const maxWeekdayCount = Math.max(...weekdayStats.map(stat => stat.count));
  const maxOrgUnitCount = Math.max(...orgUnitStats.map(stat => stat.count));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Estadístiques de Visites</h1>
      
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-700">{totalVisits}</div>
          <div className="text-sm text-gray-600">Total Visites</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-700">
            {visits.filter(v => v.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Visites Actives</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-700">
            {new Set(visits.map(v => v.visit.orgUnit)).size}
          </div>
          <div className="text-sm text-gray-600">Unitats Orgàniques</div>
        </div>
      </div>

      {/* Estadísticas por Día de la Semana */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Visites per Dia de la Setmana</h2>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <div className="space-y-4">
            {weekdayStats.map((stat, index) => (
              <div key={stat.day} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-right text-gray-700">
                  {stat.dayName}
                </div>
                <div className="flex-1 bg-gray-300 rounded-full h-6 relative">
                  <div
                    className="h-6 rounded-full bg-[#CE463F] transition-all duration-500 flex items-center justify-end pr-2"
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
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Visites per Unitat Orgànica 
          <span className="text-sm font-normal text-gray-600 ml-2">
            (amb més d'1 visita)
          </span>
        </h2>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          {orgUnitStats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hi ha unitats orgàniques amb més d'una visita
            </div>
          ) : (
            <div className="space-y-4">
              {orgUnitStats.map((stat, index) => (
                <div key={stat.orgUnit} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-right truncate text-gray-700" title={stat.orgUnit}>
                    {stat.orgUnit}
                  </div>
                  <div className="flex-1 bg-gray-300 rounded-full h-6 relative">
                    <div
                      className="h-6 rounded-full bg-[#CE463F] transition-all duration-500 flex items-center justify-end pr-2"
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
    </div>
  );
};

export default Statistics;