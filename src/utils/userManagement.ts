// src/utils/userManagement.ts
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'seller' | 'agent';
  name?: string;
  phone?: string;
  address?: string;
  postnummer?: string;
  city?: string;
  company?: string;
  primaryRegion?: string;
  specialties?: string[];
  isActive?: boolean;
}

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

// 🔁 Sikrer at testbrugere eksisterer i localStorage
export const seedTestUsers = () => {
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

// ➕ Tilføj ny bruger
export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

// 🔄 Opdater eksisterende bruger
export const updateUser = (id: string, updates: Partial<User>) => {
  const users = getUsers().map(user =>
    user.id === id ? { ...user, ...updates } : user
  );
  localStorage.setItem('users', JSON.stringify(users));
};

// ❌ Deaktiver bruger
export const deactivateUser = (id: string) => {
  updateUser(id, { isActive: false });
};

// 🗑️ Slet bruger
export const deleteUser = (id: string) => {
  const users = getUsers().filter(user => user.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
};

// 🔐 Login validering
export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  return users.find(u =>
    u.email.toLowerCase() === email.toLowerCase() &&
    u.password === password &&
    u.isActive !== false
  ) || null;
};
