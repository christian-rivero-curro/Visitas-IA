// src/components/Header.tsx
import React from 'react';
import { FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import Button from './Button.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { currentUser } = useAuth();

    return (
        <header className="gradient-bg text-white shadow-custom-lg">
        <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <FaBuilding className="text-2xl" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                Departament de Benestar i Família
                </h1>
                <p className="text-red-100 text-sm">Generalitat de Catalunya</p>
            </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="font-semibold">{currentUser?.name}</p>
                    <p className="text-sm text-red-100">{currentUser?.role}</p>
                </div>
                <Button 
                    onClick={onLogout} 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white text-primary hover:bg-gray-200"
                    title="Tancar Sessió"
                >
                    <FaSignOutAlt />
                </Button>
            </div>
        </div>
        </header>
    );
};

export default Header;