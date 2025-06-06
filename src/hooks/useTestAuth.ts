import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authenticateTestUser,
  initializeMockUsers,
  TestUser
} from '@/utils/testData';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'agent';
  name?: string;
  agencyName?: string;
}

export const useTestAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 💡 Initialiser mock-brugere ved første indlæsning
    initializeMockUsers();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const testUser = authenticateTestUser(email, password);

      if (testUser) {
        const userData: User = {
          id: testUser.id,
          email: testUser.email,
          role: testUser.role,
          name: testUser.name,
          agencyName: testUser.company
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);

        // 📍 Navigér afhængigt af brugerrolle
        setTimeout(() => {
          switch (testUser.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'seller':
              const hasCase = localStorage.getItem('seller_has_active_case') === 'true';
              navigate(hasCase ? '/seller/my-case' : '/seller/dashboard');
              break;
            case 'agent':
              navigate('/agent/browse-cases');
              break;
            default:
              navigate('/');
          }
        }, 100);

        return { success: true };
      } else {
        return { success: false, error: 'Ugyldige loginoplysninger' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login fejlede' };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
  };

  const isAdmin = () => user?.role === 'admin';
  const isSeller = () => user?.role === 'seller';
  const isAgent = () => user?.role === 'agent';

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
    isSeller,
    isAgent
  };
};
