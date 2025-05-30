
import { User, ADMIN_USER } from '@/types/user';
import { getCases } from './caseManagement';

// User management functions
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem('users');
    let parsedUsers = users ? JSON.parse(users) : [ADMIN_USER];
    
    // Ensure admin user always exists
    const hasAdmin = parsedUsers.find(u => u.id === ADMIN_USER.id);
    if (!hasAdmin) {
      parsedUsers.unshift(ADMIN_USER);
    }
    
    console.log('getUsers returning:', parsedUsers);
    return parsedUsers;
  } catch (error) {
    console.error('Error getting users:', error);
    return [ADMIN_USER];
  }
};

export const addUser = (user: User) => {
  const users = getUsers();
  
  // Check for duplicate email
  const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // Ensure user has proper structure
  const newUser = {
    ...user,
    isActive: user.isActive !== false // Default to true if not specified
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  console.log('User added:', newUser);
  console.log('All users now:', users);
  
  // Cache seller address for auto-fill functionality
  if (user.role === 'seller' && user.address) {
    localStorage.setItem('seller_address_cache', user.address);
  }
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('userCreated', { detail: newUser }));
  
  // Also trigger storage event for components listening to it
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'users',
    newValue: JSON.stringify(users),
    storageArea: localStorage
  }));
  
  return newUser;
};

export const updateUser = (userId: string, updatedData: Partial<User>) => {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, ...updatedData } : user
  );
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  console.log('User updated:', { userId, updatedData });
  
  // Trigger storage event for real-time updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'users',
    newValue: JSON.stringify(updatedUsers),
    storageArea: localStorage
  }));
  
  return updatedUsers;
};

export const deactivateUser = (userId: string) => {
  return updateUser(userId, { isActive: false });
};

export const deleteUser = (userId: string) => {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== userId);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  // Also delete related cases if it's a seller
  const cases = getCases();
  const updatedCases = cases.filter(case_ => case_.sellerId !== userId);
  localStorage.setItem('cases', JSON.stringify(updatedCases));
  
  // Log deletion for audit purposes
  const auditLog = JSON.parse(localStorage.getItem('system_audit_log') || '[]');
  auditLog.push({
    action: 'USER_DELETED',
    userId,
    timestamp: new Date().toISOString(),
    adminId: JSON.parse(localStorage.getItem('currentUser') || '{}').id
  });
  localStorage.setItem('system_audit_log', JSON.stringify(auditLog));
  
  console.log('User deleted:', userId);
  
  // Trigger storage event for real-time updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'users',
    newValue: JSON.stringify(updatedUsers),
    storageArea: localStorage
  }));
  
  return updatedUsers;
};

// Get cached seller address for auto-fill
export const getCachedSellerAddress = (): string | null => {
  return localStorage.getItem('seller_address_cache');
};

// Find user by email (for login purposes)
export const findUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

// Validate user credentials
export const validateUserCredentials = (email: string, password: string): boolean => {
  const user = findUserByEmail(email);
  return user ? user.password === password && user.isActive !== false : false;
};
