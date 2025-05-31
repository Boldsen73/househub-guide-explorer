
import { useState, useEffect } from 'react';
import { getCasesForUser, getCompleteCaseData, getCases } from '@/utils/caseManagement';
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
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Current user loaded in dashboard:', user);
        setCurrentUser(user);

        if (user.id) {
          console.log('Loading cases for user ID:', user.id);
          
          // Get ALL cases from central storage with detailed logging
          const allCases = getCases();
          console.log('Total cases in system:', allCases.length);
          console.log('All cases data:', allCases);
          
          // Filter cases for this specific user
          const userCases = allCases.filter(case_ => {
            const matches = case_.sellerId === user.id;
            console.log(`Case ${case_.id} sellerId: ${case_.sellerId}, user.id: ${user.id}, matches: ${matches}`);
            return matches;
          });
          
          console.log('Cases matching user', user.id, ':', userCases.length);
          console.log('Matching cases:', userCases);
          
          const processedCases: DashboardCase[] = userCases.map(case_ => {
            console.log('Processing case for dashboard:', case_.id, case_);
            
            // Get complete case data including all seller inputs
            const completeData = getCompleteCaseData(case_.id) || case_;
            console.log('Complete data for dashboard:', case_.id, completeData);
            
            const processedCase = {
              id: case_.id,
              address: completeData.address || case_.address,
              municipality: completeData.municipality || completeData.city || case_.municipality || 'Ikke angivet',
              type: completeData.propertyType || case_.type || 'Ikke angivet',
              size: completeData.size ? `${completeData.size} m²` : (case_.size ? `${case_.size} m²` : 'Ikke angivet'),
              price: completeData.expectedPrice || case_.price || 'Ikke angivet',
              buildYear: completeData.buildYear || case_.buildYear || new Date().getFullYear(),
              status: case_.status || 'active',
              sellerId: case_.sellerId,
              sagsnummer: case_.sagsnummer || `SAG-${case_.id.substring(0, 6).toUpperCase()}`,
              // Enhanced fields - ensure ALL data is included
              propertyType: completeData.propertyType,
              expectedPrice: completeData.expectedPrice,
              expectedPriceValue: completeData.expectedPriceValue,
              timeframe: completeData.timeframe,
              timeframeType: completeData.timeframeType,
              priorities: completeData.priorities,
              specialRequests: completeData.specialRequests,
              notes: completeData.notes,
              rooms: completeData.rooms,
              flexiblePrice: completeData.flexiblePrice,
              marketingBudget: completeData.marketingBudget,
              freeIfNotSold: completeData.freeIfNotSold
            };
            
            console.log('Processed case for dashboard:', processedCase);
            return processedCase;
          });
          
          console.log('Final processed cases for dashboard:', processedCases.length, processedCases);
          setUserCases(processedCases);
        } else {
          console.log('No user ID found');
          setUserCases([]);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setCurrentUser(null);
        setUserCases([]);
      }
    } else {
      console.log('No current user found in localStorage');
      setCurrentUser(null);
      setUserCases([]);
    }
    
    setIsLoading(false);
    console.log('=== FINISHED LOADING USER CASES IN DASHBOARD ===');
  };

  useEffect(() => {
    console.log('=== useSellerDashboard useEffect triggered ===');
    
    // Initial load
    loadUserCases();

    // Enhanced event listeners for real-time updates
    const handleCaseEvent = (event?: Event) => {
      console.log('=== CASE EVENT DETECTED IN DASHBOARD ===');
      console.log('Event type:', event?.type);
      console.log('Event detail:', (event as any)?.detail);
      
      // Small delay to ensure data is saved
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

    const handleForcedRefresh = (event: Event) => {
      console.log('=== FORCED DASHBOARD REFRESH ===');
      console.log('Force refresh event:', event);
      loadUserCases();
    };

    // Listen for all possible case update events
    window.addEventListener('caseCreated', handleCaseEvent);
    window.addEventListener('caseUpdated', handleCaseEvent);
    window.addEventListener('casesChanged', handleCaseEvent);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('forceDashboardRefresh', handleForcedRefresh);
    
    // Also set up an interval to check for updates periodically as fallback
    const intervalId = setInterval(() => {
      console.log('=== PERIODIC DASHBOARD CHECK ===');
      
      // Check if there are new cases since last load
      const currentCaseCount = userCases.length;
      const allCases = getCases();
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          const actualUserCases = allCases.filter(case_ => case_.sellerId === user.id);
          
          if (actualUserCases.length !== currentCaseCount) {
            console.log(`Case count changed: ${currentCaseCount} -> ${actualUserCases.length}, reloading`);
            loadUserCases();
          }
        } catch (error) {
          console.error('Error in periodic check:', error);
        }
      }
    }, 2000); // Check every 2 seconds

    return () => {
      console.log('=== CLEANING UP DASHBOARD LISTENERS ===');
      window.removeEventListener('caseCreated', handleCaseEvent);
      window.removeEventListener('caseUpdated', handleCaseEvent);
      window.removeEventListener('casesChanged', handleCaseEvent);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('forceDashboardRefresh', handleForcedRefresh);
      clearInterval(intervalId);
    };
  }, [userCases.length]);

  return {
    userCases,
    isLoading,
    currentUser,
    getUserDisplayName,
    refreshCases: loadUserCases
  };
};
