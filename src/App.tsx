// src/App.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.tsx';
import { User, UserRole } from './data/users.ts';

import LoginScreen from './components/LoginScreen.tsx';
import Header from './components/Header.tsx';
import VisitForm from './components/VisitForm.tsx';
import VisitorDischarge from './components/VisitorDischarge.tsx';
import VisitHistory from './components/VisitHistory.tsx';
import Statistics from './components/Statistics.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import UserManagement from './components/UserManagement.tsx';
import './index.css';

type Screen = 'visit-form' | 'visitor-discharge' | 'visit-history' | 'statistics' | 'admin-tasks';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('visit-form');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      const adminRoles: UserRole[] = ['Administrador', 'Master'];
      const userIsAdmin = adminRoles.includes(currentUser.role);
      setIsAdminMode(userIsAdmin);
      setCurrentScreen(userIsAdmin ? 'admin-tasks' : 'visit-form');
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
  };

  const handleNavigateToForm = () => {
    setCurrentScreen('visit-form');
  };

  const renderScreen = () => {
    if (isAdminMode) {
      switch (currentScreen) {
        case 'admin-tasks':
        default:
          return <UserManagement />;
      }
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
      default:
        return <VisitForm />;
    }
  };
  
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
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