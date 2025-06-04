
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'seller' | 'agent';
  name?: string;
  agencyName?: string;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
      // Hardcoded admin user for system
      if (email === 'admin@hh.dk' && password === '12345678') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@hh.dk',
          role: 'admin',
          name: 'Administrator'
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        setUser(adminUser);
        navigate('/admin');
        return { success: true };
      }

      // Regular user login for sellers
      if (email.includes('seller')) {
        const sellerUser: User = {
          id: 'seller-1',
          email,
          role: 'seller',
          name: 'Sælger'
        };
        localStorage.setItem('currentUser', JSON.stringify(sellerUser));
        setUser(sellerUser);
        navigate('/seller/my-case');
        return { success: true };
      }

      // Regular user login for agents - includes agency name for display purposes
      const agentUser: User = {
        id: 'agent-1',
        email,
        role: 'agent',
        name: 'Mægler',
        agencyName: 'Ejendomsmægler'
      };
      localStorage.setItem('currentUser', JSON.stringify(agentUser));
      setUser(agentUser);
      navigate('/agent/dashboard');
      return { success: true };

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

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin
  };
};
