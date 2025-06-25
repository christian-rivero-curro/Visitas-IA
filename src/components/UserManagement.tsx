// src/components/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import Button from './Button.tsx';
import Input from './Input.tsx';
import Select from './Select.tsx';
import { API_BASE_URL } from '../apiConfig.ts';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface User {
  id: string;
  fullName: string;
  role: 'admin' | 'employee' | 'master';
  building: string;
  lastAccess: string; // ISO string date
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // For editing existing user
  onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User>(user || {
    id: '',
    fullName: '',
    role: 'employee',
    building: '',
    lastAccess: new Date().toISOString(), // Default for new users
  });

  useEffect(() => {
    // Reset form data when user prop changes (e.g., opening for new user or editing a different user)
    setFormData(user || {
      id: '',
      fullName: '',
      role: 'employee',
      building: '',
      lastAccess: new Date().toISOString(),
    });
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // The parent's onClose will handle clearing currentUser and closing modal
  };

  const handleCancel = () => {
    // This will trigger the useEffect to reset formData to default if user is null
    // or to the original user's data if editing.
    // The parent's onClose should also set currentUser to null to ensure clear form on next open.
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">{user ? 'Editar Usuari' : 'Crear Nou Usuari'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!user && ( // Only show ID for new user creation
            <div className="text-center"> {/* Centering this div */}
              <label className="block text-sm font-medium mb-1">ID:</label>
              <Input
                value={formData.id}
                onChange={(val) => handleChange('id', val)}
                required
                className="mx-auto" // Center the input itself
              />
            </div>
          )}
          <div className="text-center"> {/* Centering this div */}
            <label className="block text-sm font-medium mb-1">Nom Complet:</label>
            <Input
              value={formData.fullName}
              onChange={(val) => handleChange('fullName', val)}
              required
              className="mx-auto" // Center the input itself
            />
          </div>
          <div className="text-center"> {/* Centering this div */}
            <label className="block text-sm font-medium mb-1">Edifici:</label>
            <Input
              value={formData.building}
              onChange={(val) => handleChange('building', val)}
              required
              className="mx-auto" // Center the input itself
            />
          </div>
          <div className="text-center"> {/* Centering this div */}
            <label className="block text-sm font-medium mb-1">Rol:</label>
            <Select
              value={formData.role}
              onChange={(val) => handleChange('role', val as 'admin' | 'employee' | 'master')}
              options={[
                { value: 'admin', label: 'Administrador' },
                { value: 'employee', label: 'Empleat' },
                { value: 'master', label: 'Master' },
              ]}
              required
              className="mx-auto" // Center the select itself
            />
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <Button type="submit" variant="primary">
              Guardar
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel·lar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error al carregar els usuaris.');
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCreateUser = () => {
    setCurrentUser(null); // Ensure currentUser is null for new user creation
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null); // Clear currentUser when modal closes, ensuring form resets for next open
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm(`Estàs segur que vols eliminar l'usuari amb ID: ${id}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Usuari eliminat correctament.');
          fetchUsers();
        } else {
          throw new Error('Error eliminant usuari.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar l\'usuari.');
      }
    }
  };

  const handleSaveUser = async (userToSave: User) => {
    const method = userToSave.id && users.some(u => u.id === userToSave.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${API_BASE_URL}/users/${userToSave.id}` : `${API_BASE_URL}/users`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToSave),
      });

      if (response.ok) {
        alert(`Usuari ${method === 'PUT' ? 'actualitzat' : 'creat'} correctament.`);
        handleCloseModal(); // Close modal and clear current user after successful save
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${method === 'PUT' ? 'actualitzant' : 'creant'} usuari.`);
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(`Error al ${method === 'PUT' ? 'actualitzar' : 'crear'} l'usuari: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Gestió d'Usuaris</h1>
      
      {/* Changed for full row and centered button */}
      <div className="mb-4 text-right"> 
        <Button onClick={handleCreateUser} variant="primary"> {/* Removed size="sm" to allow more natural sizing */}
          <FaPlus className="inline-block mr-2" /> Nou Usuari {/* Ensure FaPlus and text are inline */}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium">Nom Complet</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium">Rol</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium">Edifici</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium">Últim Accés</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-xs font-medium">Accions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                  No hi ha usuaris registrats.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-xs">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">{user.fullName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">{user.role}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">{user.building}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs">
                    {new Date(user.lastAccess).toLocaleString('ca-ES')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Button 
                      onClick={() => handleEditUser(user)} 
                      variant="secondary" 
                      size="sm" 
                      className="mr-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteUser(user.id)} 
                      variant="danger" 
                      size="sm"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} // Use the new handler here
        user={currentUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;