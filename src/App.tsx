import React, { useState } from 'react';
import Header from './components/Header.tsx';
import VisitForm from './components/VisitForm.tsx';
import VisitorDischarge from './components/VisitorDischarge.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import './index.css';

type Screen = 'visit-form' | 'visitor-discharge';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('visit-form');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'visit-form':
        return <VisitForm />;
      case 'visitor-discharge':
        return <VisitorDischarge />;
      default:
        return <VisitForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {renderScreen()}
      </main>
      <NavigationBar 
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
    </div>
  );
};

export default App;