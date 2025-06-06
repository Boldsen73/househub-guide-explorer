// src/utils/userManagement.ts
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'seller' | 'agent';
  name: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  company?: string;
  primaryRegion?: string;
  specialties?: string[];
  authorizationNumber?: string;
  isActive?: boolean;
}

// Re-export TestUser functions to maintain compatibility
export type { TestUser } from './testData';
export { getTestUsers, addTestUser, updateTestUser, deleteTestUser, deactivateTestUser, authenticateTestUser } from './testData';

// 🎯 Standard testbrugere (admin inkluderes altid)
const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@hh.dk',
    password: '12345678',
    role: 'admin',
    name: 'Admin',
    isActive: true
  },
  // Du kan tilføje flere default brugere her...
];

// 🔁 Sikrer at testbrugere eksisterer i localStorage (legacy - use testData version)
const seedTestUsersLegacy = () => {
  const existing = JSON.parse(localStorage.getItem('users') || '[]');
  const existingEmails = new Set(existing.map((u: User) => u.email));
  const merged = [...existing];
  for (const user of DEFAULT_USERS) {
    if (!existingEmails.has(user.email)) {
      merged.push(user);
    }
  }
  localStorage.setItem('users', JSON.stringify(merged));
};

// 📤 Hent alle brugere
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// ➕ Tilføj ny bruger (legacy)
const addUserLegacy = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// 🔄 Opdater eksisterende bruger (legacy)
const updateUserLegacy = (id: string, updates: Partial<User>) => {
  const users = getUsers().map(user =>
    user.id === id ? { ...user, ...updates } : user
  );
  localStorage.setItem('users', JSON.stringify(users));
};

// ❌ Deaktiver bruger (legacy)
const deactivateUserLegacy = (id: string) => {
  updateUserLegacy(id, { isActive: false });
};

// 🗑️ Slet bruger (legacy)
const deleteUserLegacy = (id: string) => {
  const users = getUsers().filter(user => user.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
};

// 🔐 Login validering (legacy)
const authenticateUserLegacy = (email: string, password: string): User | null => {
  const users = getUsers();
  return users.find(u =>
    u.email.toLowerCase() === email.toLowerCase() &&
    u.password === password &&
    u.isActive !== false
  ) || null;
};
