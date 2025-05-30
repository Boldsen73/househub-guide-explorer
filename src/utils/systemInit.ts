
import { testUsers } from '@/data/testUsers';
import { getUsers, addUser } from './userManagement';

export const initializeSystem = () => {
  console.log('Initializing HouseHub system...');
  
  // Initialize users with test data if none exist
  const existingUsers = getUsers();
  
  // Add test users if they don't already exist
  testUsers.forEach(testUser => {
    const exists = existingUsers.find(u => u.email === testUser.email);
    if (!exists) {
      try {
        addUser(testUser);
        console.log('Added test user:', testUser.email);
      } catch (error) {
        // User might already exist, that's ok
        console.log('Test user already exists:', testUser.email);
      }
    }
  });
  
  // Initialize other system components
  initializeCases();
  initializeOffers();
  
  console.log('System initialization complete');
};

const initializeCases = () => {
  // Initialize cases if needed
  if (!localStorage.getItem('cases')) {
    localStorage.setItem('cases', JSON.stringify([]));
  }
};

const initializeOffers = () => {
  // Initialize offers if needed
  if (!localStorage.getItem('offers')) {
    localStorage.setItem('offers', JSON.stringify([]));
  }
};
