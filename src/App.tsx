// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.tsx';
import { UserRole } from './data/users.ts';

import Header from './components/Header.tsx';
import NavigationBar from './components/NavigationBar.tsx';

// Importa las páginas
import LoginPage from './pages/LoginPage.tsx';
import NuevaVisita from './pages/NuevaVisita.tsx';
import BajaVisitante from './pages/BajaVisitante.tsx';
import Historico from './pages/Historico.tsx';
import Estadisticas from './pages/Estadisticas.tsx';
import GestionUsuarios from './pages/GestionUsuarios.tsx'; // <-- Importa la nueva página

import './index.css';

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      const adminRoles: UserRole[] = ['Administrador', 'Master'];
      const userIsAdmin = adminRoles.includes(currentUser.role);
      setIsAdminMode(userIsAdmin);
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        if (userIsAdmin) {
          navigate('/admin');
        } else {
          navigate('/nueva-visita');
        }
      }
    } else {
        navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6">
        <Routes>
            <Route path="/" element={<Navigate to={isAdminMode ? "/admin" : "/nueva-visita"} />} />

            {/* AHORA la ruta /admin renderiza la página GestionUsuarios */}
            {isAdminMode && <Route path="/admin" element={<GestionUsuarios />} />}

            <Route path="/nueva-visita" element={<NuevaVisita />} />
            <Route path="/baja-visitante" element={<BajaVisitante />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            
            <Route path="/login" element={<Navigate to={isAdminMode ? "/admin" : "/nueva-visita"} />} />

            <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </main>
      <NavigationBar
        isAdminMode={isAdminMode}
      />
    </div>
  );
};

export default App;