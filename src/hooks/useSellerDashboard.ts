
import { useState, useEffect } from 'react';
import { getDisplayName } from '@/utils/userNameUtils';
import { useCaseDataLoader } from './useSellerDashboard/useCaseDataLoader';
import { useCaseFormDataEnricher } from './useSellerDashboard/useCaseFormDataEnricher';

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

  const { loadAllUserCases } = useCaseDataLoader();
  const { enrichCaseWithFormData } = useCaseFormDataEnricher();

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

      const uniqueCases = loadAllUserCases(user.id);
      
      // Process each case and enrich with form data
      const processedCases: DashboardCase[] = uniqueCases.map(case_ => {
        console.log('Processing case for dashboard:', case_.id, case_);
        const caseId = typeof case_.id === 'string' ? case_.id : case_.id.toString();
        return enrichCaseWithFormData(case_, caseId);
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
    
    loadUserCases();

    const handleCaseEvent = (event?: Event) => {
      console.log('=== CASE EVENT DETECTED IN DASHBOARD ===');
      console.log('Event type:', event?.type);
      
      setTimeout(() => {
        console.log('Reloading dashboard cases after event');
        loadUserCases();
      }, 100);
    };

    const handleStorageChange = (event: StorageEvent) => {
      console.log('=== STORAGE EVENT DETECTED IN DASHBOARD ===');
      console.log('Storage key changed:', event.key);
      
      if (event.key === 'cases' || event.key?.startsWith('seller_case_') || event.key === 'propertyForm' || event.key === 'salePreferences') {
        console.log('Relevant storage changed, reloading dashboard');
        setTimeout(() => loadUserCases(), 100);
      }
    };

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
