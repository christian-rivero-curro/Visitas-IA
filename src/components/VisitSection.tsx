import React from 'react';
import Button from './Button.tsx';
import Input from './Input.tsx';
import Select from './Select.tsx';
import { FaBuilding, FaClock } from 'react-icons/fa';

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

interface VisitSectionProps {
  visit: VisitData;
  employees: Employee[];
  onVisitChange: (field: keyof VisitData, value: string) => void;
  onEmployeeSelect: (employeeName: string) => void;
  onLoadLastVisit: () => void;
  onSearch: (searchType: 'name') => void;
  isLoading: boolean;
}

const VisitSection: React.FC<VisitSectionProps> = ({
  visit,
  employees,
  onVisitChange,
  onEmployeeSelect,
  onLoadLastVisit,
  onSearch,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="section-header bg-accent mb-6 flex items-center justify-center space-x-2">
        <FaBuilding />
        <span>Visita</span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <label className="w-32 text-sm font-medium whitespace-nowrap">Cerca per cognom:</label>
          <Input
            placeholder="Buscar empleado..."
            className="flex-1 min-w-[180px]"
          />
        </div>

        <Button
          onClick={() => onSearch('name')}
          variant="secondary"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Cercant...' : 'Cercar'}
        </Button>

        <Button onClick={onLoadLastVisit} variant="secondary" size="sm">
          <FaClock />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Nom:</label>
        <Select
          value={visit.name}
          onChange={(value) => {
            onVisitChange('name', value);
            onEmployeeSelect(value);
          }}
          options={employees.map(emp => ({ value: emp.name, label: emp.name }))}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">DG:</label>
        <Select
          value={visit.dg}
          onChange={(value) => onVisitChange('dg', value)}
          options={[...new Set(employees.map(emp => emp.dg))].map(dg => ({ value: dg, label: dg }))}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Un.Org.:</label>
        <Select
          value={visit.orgUnit}
          onChange={(value) => onVisitChange('orgUnit', value)}
          options={[...new Set(employees.map(emp => emp.orgUnit))].map(unit => ({ value: unit, label: unit }))}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Servei:</label>
        <Select
          value={visit.service}
          onChange={(value) => onVisitChange('service', value)}
          options={[...new Set(employees.map(emp => emp.service))].map(service => ({ value: service, label: service }))}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <label className="text-sm font-medium">Ubicació:</label>
          <Input
            value={visit.location}
            onChange={(value) => onVisitChange('location', value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Telèfon:</label>
          <Input
            value={visit.phone}
            onChange={(value) => onVisitChange('phone', value)}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default VisitSection;