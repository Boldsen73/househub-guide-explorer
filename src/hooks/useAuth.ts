
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, getCurrentUser, logoutUser } from '@/utils/authentication';
import { initializeSystem } from '@/utils/systemInit';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'agent';
  name?: string;
  agencyName?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the system
    initializeSystem();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const currentUser = getCurrentUser();
      console.log('Checking auth status, current user:', currentUser);
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        const userData: AuthUser = {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          name: authenticatedUser.name,
          agencyName: authenticatedUser.company
        };
        
        setUser(userData);
        console.log('Login successful, navigating for role:', authenticatedUser.role);
        
        // Navigate based on role with a small delay to ensure state is set
        setTimeout(() => {
          switch (authenticatedUser.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'seller':
              // Check if seller has existing case, if so go to Min sag, otherwise dashboard
              const hasCase = localStorage.getItem('seller_has_active_case') === 'true';
              navigate(hasCase ? '/saelger/min-sag' : '/saelger/dashboard');
              break;
            case 'agent':
              // Agents go to browse cases (Åbne sager)
              navigate('/maegler/gennemse-sager');
              break;
            default:
              navigate('/');
          }
        }, 100);
        
        return { success: true };
      } else {
        console.log('Authentication failed');
        return { success: false, error: 'Ugyldige loginoplysninger' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login fejlede' };
    }
  };

  const logout = () => {
    console.log('useAuth logout called');
    logoutUser();
    setUser(null);
    
    // Clear all localStorage except essential system data
    const keysToKeep = ['systemInitialized'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
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
