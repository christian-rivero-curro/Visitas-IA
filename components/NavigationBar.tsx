import React from 'react';

const NavigationBar: React.FC = () => {
  const navItems = [
    { label: 'Baixa del visitant', href: '#' },
    { label: 'Històric', href: '#' },
    { label: 'Històric avui', href: '#' },
    { label: 'Estadístiques', href: '#' },
    { label: 'Tasques de l\'administrador', href: '#' },
    { label: 'Tornar enrere', href: '#' },
    { label: 'Sortir', href: '#' }
  ];

  return (
    <nav className="bg-gray-200 border-t-2 border-gray-400 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center py-3 space-x-1">
          {navItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                className="text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 hover:underline"
              >
                {item.label}
              </a>
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