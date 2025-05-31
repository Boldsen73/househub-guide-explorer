
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
          
          // Get cases from central storage first
          const centralCases = getCasesForUser(user.id);
          console.log('Cases from central storage:', centralCases);
          
          // Also check for any local seller_case_ entries
          const userCreatedCases = [];
          const seenCaseIds = new Set();
          
          // Add central cases first
          centralCases.forEach(case_ => {
            if (!seenCaseIds.has(case_.id)) {
              seenCaseIds.add(case_.id);
              const completeData = getCompleteCaseData(case_.id) || case_;
              
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
          });
          
          // Check for additional cases in localStorage that might not be in central storage yet
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('seller_case_')) {
              try {
                const caseData = JSON.parse(localStorage.getItem(key) || '{}');
                if (caseData && caseData.address && caseData.sellerId === user.id) {
                  const caseId = key.replace('seller_case_', '');
                  
                  if (!seenCaseIds.has(caseId)) {
                    seenCaseIds.add(caseId);
                    
                    userCreatedCases.push({
                      id: caseId,
                      address: caseData.address,
                      municipality: caseData.municipality || caseData.city || 'Ikke angivet',
                      type: caseData.propertyType || caseData.type || 'Ikke angivet',
                      size: caseData.size ? `${caseData.size} m²` : 'Ikke angivet',
                      price: caseData.expectedPrice || caseData.price || 'Ikke angivet',
                      buildYear: caseData.buildYear || caseData.constructionYear || new Date().getFullYear(),
                      status: caseData.status || 'active',
                      sellerId: caseData.sellerId,
                      sagsnummer: caseData.sagsnummer || `SAG-${caseId.substring(0, 6).toUpperCase()}`,
                      // Enhanced fields
                      propertyType: caseData.propertyType,
                      expectedPrice: caseData.expectedPrice,
                      expectedPriceValue: caseData.expectedPriceValue,
                      timeframe: caseData.timeframe,
                      timeframeType: caseData.timeframeType,
                      priorities: caseData.priorities,
                      specialRequests: caseData.specialRequests,
                      notes: caseData.notes,
                      rooms: caseData.rooms,
                      flexiblePrice: caseData.flexiblePrice,
                      marketingBudget: caseData.marketingBudget,
                      freeIfNotSold: caseData.freeIfNotSold
                    });
                  }
                }
              } catch {
                // ignore error
              }
            }
          }
          
          console.log('Found unique cases with complete data:', userCreatedCases);
          setUserCases(userCreatedCases);
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
