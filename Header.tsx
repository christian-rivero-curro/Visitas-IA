import React from 'react';
import { FaStar } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <FaStar className="text-2xl" />
          <h1 className="text-xl font-semibold">
            Departament de Benestar i Família
          </h1>
        </div>
      </div>
      <div className="bg-gray-800 px-6 py-2">
        <h2 className="text-lg font-medium">
          Control de les visites de recepció de PALAU DE MAR
        </h2>
      </div>
    </header>
  );
};

export default Header;