import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import Button from './Button.tsx'; // Import the Button component

interface HeaderProps {
  onToggleAdminMode: () => void;
  isAdminMode: boolean; // New prop added
}

const Header: React.FC<HeaderProps> = ({ onToggleAdminMode, isAdminMode }) => {
  return (
    <header className="gradient-bg text-white shadow-custom-lg">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <FaBuilding className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Departament de Benestar i Família
            </h1>
            <p className="text-red-100 text-sm">Generalitat de Catalunya</p>
          </div>
        </div>
        <Button 
          onClick={onToggleAdminMode} 
          variant="secondary" 
          size="sm" 
          className="bg-white text-primary hover:bg-gray-200"
        >
          {isAdminMode ? 'Recepcionista' : 'Administrador'} {/* Conditional text */}
        </Button>
      </div>
    </header>
  );
};

export default Header;