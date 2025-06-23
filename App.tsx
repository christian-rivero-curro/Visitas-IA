import React from 'react';
import Header from './components/Header.tsx';
import VisitForm from './components/VisitForm.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <VisitForm />
      </main>
      <NavigationBar />
    </div>
  );
};

export default App;