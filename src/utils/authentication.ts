
import { User } from '@/types/user';
import { getUsers } from './userManagement';

// Authentication helper
export const authenticateUser = (email: string, password: string): User | null => {
  console.log('Authenticating user:', email);
  
  const users = getUsers();
  console.log('All users in system:', users);
  
  const user = users.find(u => {
    const emailMatch = u.email.toLowerCase() === email.toLowerCase();
    const passwordMatch = u.password === password;
    console.log(`Checking user ${u.email}: emailMatch=${emailMatch}, passwordMatch=${passwordMatch}`);
    return emailMatch && passwordMatch;
  });
  
  console.log('Found user with address data:', user);
  
  if (user) {
    // Check if user is deactivated
    if (user.isActive === false) {
      console.log('User is deactivated:', user.email);
      return null; // Prevent login for deactivated users
    }
    
    // Set as current user with all necessary data including properly separated address fields
    const currentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      agencyName: user.company,
      primaryRegion: user.primaryRegion,
      specialties: user.specialties,
      address: user.address || '',
      postalCode: user.postalCode || '',
      city: user.city || '',
      phone: user.phone,
      authorizationNumber: user.authorizationNumber
    };
    
    console.log('Setting currentUser with address fields:', {
      address: currentUser.address,
      postalCode: currentUser.postalCode,
      city: currentUser.city
    });
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log('User authenticated successfully:', currentUser);
    return user;
  }
  
  console.log('Authentication failed for:', email);
  return null;
};

// Get current logged in user
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  console.log('User logged out');
};
