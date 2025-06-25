// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import VisitForm from './components/VisitForm.tsx';
import VisitorDischarge from './components/VisitorDischarge.tsx';
import VisitHistory from './components/VisitHistory.tsx';
import Statistics from './components/Statistics.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import UserManagement from './components/UserManagement.tsx'; // Import the new component
import './index.css';

type Screen = 'visit-form' | 'visitor-discharge' | 'visit-history' | 'statistics' | 'admin-tasks';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('visit-form');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const handleToggleAdminMode = () => {
    setIsAdminMode(prev => !prev);
    // If toggling to admin mode, go to 'admin-tasks', otherwise reset to 'visit-form'
    setCurrentScreen(prev => !prev ? 'visit-form' : 'admin-tasks');
  };

  const handleNavigateToForm = () => {
    setCurrentScreen('visit-form');
  };

  const renderScreen = () => {
    if (isAdminMode) {
      // In admin mode, the default screen is UserManagement which corresponds to 'admin-tasks'
      return <UserManagement />;
    }

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
        // This case is now effectively handled by the isAdminMode check above,
        // but keeping it for completeness if admin-tasks were to branch further.
        return <UserManagement />;
      default:
        return <VisitForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onToggleAdminMode={handleToggleAdminMode} isAdminMode={isAdminMode} />
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