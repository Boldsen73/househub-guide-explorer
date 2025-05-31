
import { useState, useEffect } from 'react';
import { getCasesForUser, getAllCases } from '@/utils/caseStorageManager';
import { getDisplayName } from '@/utils/userNameUtils';

interface DashboardCase {
  id: string;
  address: string;
  municipality: string;
  type: string;
  size: string;
  price: string;
  buildYear: number;
  status: string;
  sellerId: string;
  sagsnummer: string;
  // Enhanced fields
  propertyType?: string;
  expectedPrice?: string;
  expectedPriceValue?: number;
  timeframe?: number;
  timeframeType?: string;
  priorities?: {
    speed: boolean;
    price: boolean;
    service: boolean;
  };
  specialRequests?: string;
  notes?: string;
  rooms?: string;
  flexiblePrice?: boolean;
  marketingBudget?: number;
  freeIfNotSold?: boolean;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  type?: string;
}

export const useSellerDashboard = () => {
  const [userCases, setUserCases] = useState<DashboardCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getUserDisplayName = (user: User | null): string => {
    return getDisplayName(user);
  };

  const loadUserCases = () => {
    console.log('=== LOADING USER CASES IN DASHBOARD ===');
    setIsLoading(true);
    
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (!savedUser) {
        console.log('No current user found in localStorage');
        setCurrentUser(null);
        setUserCases([]);
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);
      console.log('Current user loaded in dashboard:', user);
      setCurrentUser(user);

      if (!user.id) {
        console.log('No user ID found');
        setUserCases([]);
        setIsLoading(false);
        return;
      }

      console.log('Loading cases for user ID:', user.id);
      
      // Get ALL cases from storage with detailed logging
      const allCases = getAllCases();
      console.log('Total cases in system:', allCases.length);
      console.log('All cases data:', allCases);
      
      // Use the centralized function to get user cases
      const userSpecificCases = getCasesForUser(user.id);
      console.log('Cases for user', user.id, ':', userSpecificCases.length);
      console.log('User specific cases:', userSpecificCases);
      
      const processedCases: DashboardCase[] = userSpecificCases.map(case_ => {
        console.log('Processing case for dashboard:', case_.id, case_);
        
        const processedCase = {
          id: case_.id,
          address: case_.address || 'Ingen adresse',
          municipality: case_.municipality || case_.city || 'Ikke angivet',
          type: case_.propertyType || case_.type || 'Ikke angivet',
          size: case_.size ? `${case_.size} m²` : 'Ikke angivet',
          price: case_.expectedPrice || case_.price || 'Ikke angivet',
          buildYear: case_.buildYear || new Date().getFullYear(),
          status: case_.status || 'active',
          sellerId: case_.sellerId,
          sagsnummer: case_.sagsnummer || `SAG-${case_.id.substring(0, 6).toUpperCase()}`,
          // Enhanced fields
          propertyType: case_.propertyType,
          expectedPrice: case_.expectedPrice,
          expectedPriceValue: case_.expectedPriceValue,
          timeframe: case_.timeframe,
          timeframeType: case_.timeframeType,
          priorities: case_.priorities,
          specialRequests: case_.specialRequests,
          notes: case_.notes,
          rooms: case_.rooms,
          flexiblePrice: case_.flexiblePrice,
          marketingBudget: case_.marketingBudget,
          freeIfNotSold: case_.freeIfNotSold
        };
        
        console.log('Processed case for dashboard:', processedCase);
        return processedCase;
      });
      
      console.log('Final processed cases for dashboard:', processedCases.length, processedCases);
      setUserCases(processedCases);
      
    } catch (error) {
      console.error('Error loading user cases:', error);
      setCurrentUser(null);
      setUserCases([]);
    } finally {
      setIsLoading(false);
      console.log('=== FINISHED LOADING USER CASES IN DASHBOARD ===');
    }
  };

  useEffect(() => {
    console.log('=== useSellerDashboard useEffect triggered ===');
    
    // Initial load
    loadUserCases();

    // Event listeners for real-time updates
    const handleCaseEvent = (event?: Event) => {
      console.log('=== CASE EVENT DETECTED IN DASHBOARD ===');
      console.log('Event type:', event?.type);
      
      // Reload cases when events are detected
      setTimeout(() => {
        console.log('Reloading dashboard cases after event');
        loadUserCases();
      }, 100);
    };

    const handleStorageChange = (event: StorageEvent) => {
      console.log('=== STORAGE EVENT DETECTED IN DASHBOARD ===');
      console.log('Storage key changed:', event.key);
      
      if (event.key === 'cases' || event.key?.startsWith('seller_case_')) {
        console.log('Cases storage changed, reloading dashboard');
        setTimeout(() => loadUserCases(), 100);
      }
    };

    // Listen for all possible case update events
    window.addEventListener('caseCreated', handleCaseEvent);
    window.addEventListener('caseUpdated', handleCaseEvent);
    window.addEventListener('casesChanged', handleCaseEvent);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      console.log('=== CLEANING UP DASHBOARD LISTENERS ===');
      window.removeEventListener('caseCreated', handleCaseEvent);
      window.removeEventListener('caseUpdated', handleCaseEvent);
      window.removeEventListener('casesChanged', handleCaseEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    userCases,
    isLoading,
    currentUser,
    getUserDisplayName,
    refreshCases: loadUserCases
  };
};
