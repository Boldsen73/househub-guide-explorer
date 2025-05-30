
import { useState, useEffect } from 'react';
import { getTestCasesForUser } from '@/utils/testData';
import { getDisplayName } from '@/utils/userNameUtils';
import { getCompleteCaseData } from '@/utils/caseManagement';

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
          // ONLY get cases that belong to this specific user
          const userOwnedCases = getTestCasesForUser(user.id);
          
          // Also check for any local seller_case_ entries for this specific user
          const userCreatedCases = [];
          const seenCaseIds = new Set(); // Prevent duplicates
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('seller_case_')) {
              try {
                const caseId = key.replace('seller_case_', '');
                const completeData = getCompleteCaseData(caseId);
                
                // STRICT check - only include if sellerId exactly matches current user AND not already seen
                if (completeData && completeData.address && completeData.sellerId === user.id && !seenCaseIds.has(caseId)) {
                  seenCaseIds.add(caseId);
                  userCreatedCases.push({
                    id: caseId,
                    address: completeData.address,
                    municipality: completeData.municipality || completeData.city || 'Ikke angivet',
                    type: completeData.propertyType || completeData.type || 'Ikke angivet',
                    size: completeData.size ? `${completeData.size} m²` : 'Ikke angivet',
                    price: completeData.expectedPrice || completeData.price || 'Ikke angivet',
                    buildYear: completeData.buildYear || completeData.constructionYear || new Date().getFullYear(),
                    status: 'active',
                    sellerId: completeData.sellerId,
                    sagsnummer: `SAG-${caseId.substring(0, 6).toUpperCase()}`,
                    // Enhanced fields
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
                }
              } catch {
                // ignore error
              }
            }
          }

          // Combine cases and remove any duplicates by ID
          const allCases = [...userOwnedCases, ...userCreatedCases];
          const uniqueCases = allCases.filter((case_, index, arr) => 
            arr.findIndex(c => c.id === case_.id) === index
          );
          
          console.log('Loading cases for user:', user.id);
          console.log('Found unique cases with complete data:', uniqueCases);
          setUserCases(uniqueCases);
        } else {
          console.log('No user ID found');
          setUserCases([]);
        }
      } catch {
        console.log('Error parsing user data');
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
      loadUserCases();
    };

    const handleCaseCreated = () => {
      loadUserCases();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('caseCreated', handleCaseCreated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('caseCreated', handleCaseCreated);
    };
  }, []);

  return {
    userCases,
    isLoading,
    currentUser,
    getUserDisplayName
  };
};
