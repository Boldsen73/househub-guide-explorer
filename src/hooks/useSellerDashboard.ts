
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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);

        if (user.id) {
          console.log('Loading cases for user:', user.id);
          
          // Get ALL cases from central storage
          const allCases = getCases();
          console.log('All cases in system:', allCases);
          
          // Filter cases for this specific user
          const userCases = allCases.filter(case_ => case_.sellerId === user.id);
          console.log('Cases for user:', userCases);
          
          const userCreatedCases = [];
          
          // Process user cases with complete data
          userCases.forEach(case_ => {
            console.log('Processing case:', case_.id);
            
            // Get complete case data including all seller inputs
            const completeData = getCompleteCaseData(case_.id) || case_;
            console.log('Complete data for case:', completeData);
            
            userCreatedCases.push({
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
            });
          });
          
          console.log('Final processed cases for dashboard:', userCreatedCases);
          setUserCases(userCreatedCases);
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
      console.log('No current user found');
      setCurrentUser(null);
      setUserCases([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUserCases();

    const handleStorageChange = () => {
      console.log('Storage changed, reloading cases');
      loadUserCases();
    };

    const handleCaseCreated = () => {
      console.log('Case created event, reloading cases');
      loadUserCases();
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('caseCreated', handleCaseCreated);
    
    // Also listen for a custom event that we'll dispatch when a case is created
    const handleCaseUpdate = () => {
      console.log('Case update event, reloading cases');
      setTimeout(() => loadUserCases(), 100); // Small delay to ensure data is saved
    };
    
    window.addEventListener('caseUpdated', handleCaseUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('caseCreated', handleCaseCreated);
      window.removeEventListener('caseUpdated', handleCaseUpdate);
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
