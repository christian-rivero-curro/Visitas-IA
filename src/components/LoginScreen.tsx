// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { users } from '../data/users.ts';
import Select from './Select.tsx';
import Button from './Button.tsx';

const LoginScreen: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!selectedUserId) {
      alert('Si us plau, selecciona un usuari.');
      return;
    }
    const userToLogin = users.find(u => u.id === selectedUserId);
    if (userToLogin) {
      login(userToLogin);
    }
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.role})`
  }));

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <header className="bg-[#4a4a4a] text-white py-4 px-6">
        <div className="flex items-center">
          <div className="flex items-center">
          <img src="https://preproduccio.autenticaciogicar4.extranet.gencat.cat/siteminderagent/forms/gicar2021/img/logo_generalitat_gris.png" alt="Generalitat de Catalunya" className="h-6 inline-block mr-2" />
          </div>
          <h1 className="text-lg font-normal">Autenticació d'usuaris</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center pt-16">
        <div className="w-full max-w-4xl px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Block - Certificate Access */}
            <div className="bg-white border-l-4 border-[#f4c430] shadow-sm">
              <div className="bg-[#f4c430] px-6 py-3">
                <h2 className="text-lg font-medium text-gray-800">Accés amb certificat</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 mb-6">
                  Si disposeu de certificat digital reconegut pel <span className="text-red-600 font-medium">Consorci AOC</span>,
                  podreu accedir a l'aplicació.
                </p>
                <Button 
                  onClick={() => {/* Certificate login logic */}}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium flex items-center"
                >
                  <span className="mr-2">🔒</span>
                  Accedeix
                </Button>
              </div>
            </div>

            {/* Right Block - Corporate Credentials */}
            <div className="bg-white border-l-4 border-[#7cb342] shadow-sm">
              <div className="bg-[#7cb342] px-6 py-3">
                <h2 className="text-lg font-medium text-white">Accés amb credencials corporatives</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Usuari<span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={selectedUserId}
                      onChange={setSelectedUserId}
                      options={userOptions}
                      placeholder="Selecciona un usuari..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contrasenya<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
                      value="••••••••"
                      readOnly
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button 
                      onClick={handleLogin} 
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium flex items-center"
                    >
                      <span className="mr-2">🔒</span>
                      Accedeix
                    </Button>
                    <div className="text-right">
                      <a href="#" className="text-red-600 text-xs hover:underline block mb-1">
                        Canvi de contrasenya
                      </a>
                      <a href="#" className="text-red-600 text-xs hover:underline block">
                        Heu oblidat la contrasenya?
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Notice */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>
              Recordeu que quan us caduqui la contrasenya o la vulgueu canviar cal que compleixi els següents{' '}
              <a href="#" className="text-red-600 hover:underline">criteris</a>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-300">
        <div className="container mx-auto px-8 text-xs text-gray-500 flex items-center">
            <img src="https://preproduccio.autenticaciogicar4.extranet.gencat.cat/siteminderagent/forms/gicar2021/img/logo_generalitat_gris.png" alt="Generalitat de Catalunya" className="h-6 inline-block mr-2" />
            <p>Avís legal: La Generalitat de Catalunya permet la reutilització dels continguts i de les dades sempre que se citi la font i la data d'actualització, que no es desnaturalitzi la informació i que no es contradigui amb una llicència específica.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginScreen;