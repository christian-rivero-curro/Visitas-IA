import React from 'react';

type Screen = 'visit-form' | 'visitor-discharge' | 'visit-history' | 'statistics';

interface NavigationBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { label: 'Baixa del visitant', screen: 'visitor-discharge' as Screen },
    { label: 'Històric', screen: 'visit-history' as Screen },
    { label: 'Estadístiques', screen: 'statistics' as Screen },
    { label: 'Tasques de l\'administrador', href: '#' },
    { label: 'Tornar enrere', screen: 'visit-form' as Screen },
    { label: 'Sortir', href: '#' }
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.screen) {
      onNavigate(item.screen);
    }
  };

  return (
    <nav className="bg-gray-200 border-t-2 border-gray-400 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center py-3 space-x-1">
          {navItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <button
                onClick={() => handleItemClick(item)}
                className={`text-primary hover:text-primary-dark text-sm font-medium px-2 py-1 hover:underline ${
                  item.screen === currentScreen ? 'font-bold text-primary-dark' : ''
                }`}
              >
                {item.label}
              </button>
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