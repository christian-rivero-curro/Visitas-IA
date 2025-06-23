import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const Header: React.FC = () => {
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
      </div>
    </header>
  );
};

export default Header;