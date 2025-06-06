import { getTestUsers, addTestUser, seedTestUsers } from './testData';
import { getUsers } from './userManagement';
import { cleanupDuplicateUsers } from './cleanupDuplicateUsers';

export const initializeSystem = () => {
  console.log('Initializing HouseHub system...');

  // Clean up any duplicate users first
  cleanupDuplicateUsers();

  // Initialize test users if not already done
  const testUsers = getTestUsers();
  if (testUsers.length === 0) {
    console.log('No test users found, seeding default test users...');
    seedTestUsers();
  } else {
    console.log('Test users already exist, count:', testUsers.length);
  }

  // Initialize users with test data
  const existingUsers = getUsers(); // This will now return merged users
  console.log('Total users after initialization:', existingUsers.length);

  testUsers.forEach(testUser => {
    try {
      addTestUser(testUser);
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
