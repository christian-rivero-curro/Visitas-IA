// src/data/users.ts
export type UserRole = 'Administrador' | 'Recepcionista' | 'Master';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const users: User[] = [
  { id: '1', name: 'Juan Garcia', role: 'Administrador' },
  { id: '2', name: 'Maria Lopez', role: 'Recepcionista' },
  { id: '3', name: 'Pedro Martinez', role: 'Master' },
];