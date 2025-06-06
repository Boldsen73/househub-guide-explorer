import { getTestUsers, addTestUser, seedTestUsers } from './testData';
import { getUsers } from './userManagement';
import { cleanupDuplicateUsers } from './cleanupDuplicateUsers';

export const initializeSystem = () => {
  console.log('Initializing HouseHub system...');

  // Clean up any duplicate users first
  cleanupDuplicateUsers();

  // Force seed test users to ensure they exist
  console.log('Force seeding test users to ensure all are present...');
  seedTestUsers();
  
  const testUsers = getTestUsers();
  console.log('Test users after seeding:', testUsers.length);

  // Get final user count
  const existingUsers = getUsers(); // This will now return merged users
  console.log('Total users after initialization:', existingUsers.length);

  // Initialize other system components
  initializeCases();
  initializeOffers();

  console.log('System initialization complete');
};

const initializeCases = () => {
  if (!localStorage.getItem('cases')) {
    localStorage.setItem('cases', JSON.stringify([]));
  }
};

const initializeOffers = () => {
  if (!localStorage.getItem('offers')) {
    localStorage.setItem('offers', JSON.stringify([]));
  }
};
