// src/components/NavigationBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  isAdminMode: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isAdminMode }) => {
  const location = useLocation();

  const normalNavItems = [
    { label: 'Nova visita', path: '/nueva-visita' },
    { label: 'Baixa del visitant', path: '/baja-visitante' },
    { label: 'Històric', path: '/historico' },
    { label: 'Estadístiques', path: '/estadisticas' },
    { label: 'Tornar enrere', path: -1 }, // To go back
  ];

  const adminNavItems = [
    { label: 'Gestió d\'Usuaris', path: '/admin' },
    { label: 'Configuració del Sistema', path: '#' },
    { label: 'Registre d\'Activitats', path: '#' },
  ];

  const navItems = isAdminMode ? adminNavItems : normalNavItems;

  return (
    <nav className="bg-gray-200 border-t-2 border-gray-400 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center py-3 space-x-1">
          {navItems.map((item, index) => (
            <React.Fragment key={item.label}>
              {typeof item.path === 'string' ? (
                <Link
                  to={item.path}
                  className={`text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 hover:underline ${
                    location.pathname === item.path ? 'font-bold text-primary-dark' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => window.history.back()}
                  className="text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 hover:underline"
                >
                  {item.label}
                </button>
              )}
              {index < navItems.length - 1 && (
                <span className="text-gray-500">-</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 text-white text-center py-2">
        <span className="text-sm font-medium">
          Control de les visites de recepció de PALAU DE MAR
        </span>
      </div>
    </nav>
  );
};

export default NavigationBar;