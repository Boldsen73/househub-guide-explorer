
import { useState, useEffect } from 'react';
import { getTestCasesForUser } from '@/utils/testData';
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
                const caseData = JSON.parse(localStorage.getItem(key) || '{}');
                const caseId = key.replace('seller_case_', '');
                
                // STRICT check - only include if sellerId exactly matches current user AND not already seen
                if (caseData && caseData.address && caseData.sellerId === user.id && !seenCaseIds.has(caseId)) {
                  seenCaseIds.add(caseId);
                  userCreatedCases.push({
                    id: caseId,
                    address: caseData.address,
                    municipality: caseData.municipality || caseData.city || 'Ikke angivet',
                    type: caseData.propertyType || 'Ikke angivet',
                    size: `${caseData.size || 0} m²`,
                    price: caseData.estimatedPrice || 'Ikke angivet',
                    buildYear: caseData.buildYear || new Date().getFullYear(),
                    status: 'active',
                    sellerId: caseData.sellerId,
                    sagsnummer: `SAG-${caseId.substring(0, 6).toUpperCase()}`
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
          console.log('Found unique cases:', uniqueCases);
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
