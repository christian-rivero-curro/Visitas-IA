import React, { useState } from 'react';
import Header from './components/Header.tsx';
import VisitForm from './components/VisitForm.tsx';
import VisitorDischarge from './components/VisitorDischarge.tsx';
import VisitHistory from './components/VisitHistory.tsx';
import Statistics from './components/Statistics.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import './index.css';

type Screen = 'visit-form' | 'visitor-discharge' | 'visit-history' | 'statistics' | 'admin-tasks';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('visit-form');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const handleToggleAdminMode = () => {
    setIsAdminMode(prev => !prev);
    setCurrentScreen('visit-form'); // Reset to default screen when toggling mode
  };

  const handleNavigateToForm = () => {
    setCurrentScreen('visit-form');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'visit-form':
        return <VisitForm />;
      case 'visitor-discharge':
        return <VisitorDischarge />;
      case 'visit-history':
        return <VisitHistory />;
      case 'statistics':
        return <Statistics />;
      case 'admin-tasks':
        // Placeholder for admin-specific content or a dashboard
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Panell d'Administrador</h1>
            <p className="text-gray-600">Selecciona una opció de la barra de navegació inferior.</p>
          </div>
        );
      default:
        return <VisitForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onToggleAdminMode={handleToggleAdminMode} isAdminMode={isAdminMode} /> {/* Pass isAdminMode here */}
      <main className="container mx-auto px-4 py-6">
        {renderScreen()}
      </main>
      <NavigationBar 
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        isAdminMode={isAdminMode}
        onNavigateToForm={handleNavigateToForm}
      />
    </div>
  );
};

export default App;