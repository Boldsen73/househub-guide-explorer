
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
      
      // Also check seller-specific cases in localStorage
      const sellerSpecificCases = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('seller_case_')) {
          try {
            const caseData = JSON.parse(localStorage.getItem(key) || '{}');
            if (caseData && caseData.sellerId === user.id) {
              const caseId = key.replace('seller_case_', '');
              const caseStatus = localStorage.getItem(`seller_case_status_${caseId}`) || 'active';
              
              sellerSpecificCases.push({
                ...caseData,
                id: caseId,
                status: caseStatus
              });
            }
          } catch (error) {
            console.error('Error parsing seller case:', error);
          }
        }
      }
      
      console.log('Seller specific cases found:', sellerSpecificCases);
      
      // Use the centralized function to get user cases
      const userSpecificCases = getCasesForUser(user.id);
      console.log('Cases for user', user.id, ':', userSpecificCases.length);
      console.log('User specific cases:', userSpecificCases);
      
      // Combine both sources of cases
      const allUserCases = [...userSpecificCases, ...sellerSpecificCases];
      
      // Remove duplicates based on ID
      const uniqueCases = allUserCases.filter((case_, index, array) => 
        array.findIndex(c => c.id === case_.id) === index
      );
      
      console.log('Combined unique cases:', uniqueCases);
      
      const processedCases: DashboardCase[] = uniqueCases.map(case_ => {
        console.log('Processing case for dashboard:', case_.id, case_);
        
        // Safely convert ID to string
        const caseId = typeof case_.id === 'string' ? case_.id : case_.id.toString();
        
        const processedCase: DashboardCase = {
          id: caseId,
          address: case_.address || 'Ingen adresse',
          municipality: case_.municipality || (case_ as any).city || 'Ikke angivet',
          type: (case_ as any).propertyType || case_.type || 'Ikke angivet',
          size: case_.size ? `${case_.size} m²` : 'Ikke angivet',
          price: (case_ as any).expectedPrice || case_.price || 'Ikke angivet',
          buildYear: (case_ as any).buildYear || case_.constructionYear || new Date().getFullYear(),
          status: case_.status || 'active',
          sellerId: case_.sellerId || '',
          sagsnummer: (case_ as any).sagsnummer || `SAG-${caseId.substring(0, 6).toUpperCase()}`,
          // Enhanced fields with safe access
          propertyType: (case_ as any).propertyType,
          expectedPrice: (case_ as any).expectedPrice,
          expectedPriceValue: (case_ as any).expectedPriceValue,
          timeframe: (case_ as any).timeframe,
          timeframeType: (case_ as any).timeframeType,
          priorities: (case_ as any).priorities,
          specialRequests: (case_ as any).specialRequests,
          notes: (case_ as any).notes,
          rooms: case_.rooms,
          flexiblePrice: (case_ as any).flexiblePrice,
          marketingBudget: (case_ as any).marketingBudget,
          freeIfNotSold: (case_ as any).freeIfNotSold
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
