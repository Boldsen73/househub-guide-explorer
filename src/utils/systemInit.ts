import { getTestUsers } from '@/utils/testData'; // <-- Opdateret import
import { getUsers, addUser } from './userManagement';

export const initializeSystem = () => {
  console.log('Initializing HouseHub system...');

  // Clear existing users to ensure fresh data from test users
  localStorage.removeItem('users');

  // Initialize users with test data
  const existingUsers = getUsers(); // This will now return only ADMIN_USER

  const testUsers = getTestUsers(); // <-- Henter brugerlisten korrekt

  testUsers.forEach(testUser => {
    try {
      addUser(testUser);
      console.log('Added test user:', testUser.email, 'with address fields:', {
        address: testUser.address,
        postalCode: testUser.postalCode,
        city: testUser.city
      });
    } catch (error) {
      // User might already exist, that's ok
      console.log('Test user already exists:', testUser.email);
    }
  });

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
