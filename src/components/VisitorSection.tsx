import React from 'react';
import Button from './Button.tsx';
import Input from './Input.tsx';
import TextArea from './TextArea.tsx';
import { FaUser } from 'react-icons/fa';

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

interface VisitorSectionProps {
  visitor: FormVisitorState;
  onVisitorChange: (field: keyof FormVisitorState, value: string | number) => void;
  onSearch: (searchType: 'dni' | 'name') => void;
  unknownVisitor: boolean;
  onUnknownVisitorChange: (value: boolean) => void;
  isLoading: boolean;
  dniError: string;
}

const VisitorSection: React.FC<VisitorSectionProps> = ({
  visitor,
  onVisitorChange,
  onSearch,
  unknownVisitor,
  onUnknownVisitorChange,
  isLoading,
  dniError
}) => {
  return (
    <div className="space-y-4">
      <div className="section-header bg-primary mb-6 flex items-center justify-center space-x-2">
        <FaUser />
        <span>Visitant</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">DNI:</label>
        <Input
          value={visitor.dni}
          onChange={(value) => onVisitorChange('dni', value)}
          className="flex-1"
        />
        <Button onClick={() => onSearch('dni')} variant="secondary" size="sm" disabled={isLoading}>
          {isLoading ? 'Cercant...' : 'Cercar'}
        </Button>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="desconegut"
            checked={unknownVisitor}
            onChange={(e) => onUnknownVisitorChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="desconegut" className="text-sm">Desconegut</label>
        </div>
      </div>

      {dniError && (
        <div className="text-red-600 text-sm font-semibold">
          {dniError}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Nom:</label>
        <Input
          value={visitor.name}
          onChange={(value) => onVisitorChange('name', value)}
          className="flex-1"
        />
        <Button onClick={() => onSearch('name')} variant="secondary" size="sm" disabled={isLoading}>
          {isLoading ? 'Cercant...' : 'Cercar'}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Empresa:</label>
        <Input
          value={visitor.company}
          onChange={(value) => onVisitorChange('company', value)}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="w-16 text-sm font-medium">Motiu:</label>
        <Input
          value={visitor.reason}
          onChange={(value) => onVisitorChange('reason', value)}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Núm. targeta:</label>
          <Input
            value={visitor.cardNumber}
            onChange={(value) => onVisitorChange('cardNumber', value)}
            className="w-20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Visitants:</label>
          <Input
            type="number"
            value={visitor.visitors.toString()}
            onChange={(value) => onVisitorChange('visitors', parseInt(value) || 1)}
            className="w-16"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Color:</label>
          <Input
            value={visitor.color}
            onChange={(value) => onVisitorChange('color', value)}
            className="w-24"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Observacions:</label>
        <TextArea
          value={visitor.observations}
          onChange={(value) => onVisitorChange('observations', value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default VisitorSection;