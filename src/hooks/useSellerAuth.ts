
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCasesForUser, getCompleteCaseData } from '@/utils/caseManagement';
import { getTestCasesForUser } from '@/utils/testData';
import { ROUTES } from '@/constants/routes';

interface SellerCase {
  id: string;
  address: string;
  status: 'draft' | 'active' | 'completed';
  submittedAt?: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  type?: string;
}

export const useSellerAuth = () => {
  const [hasActiveCase, setHasActiveCase] = useState<boolean | null>(null);
  const [sellerCase, setSellerCase] = useState<SellerCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedAddress, setCachedAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    try {
      console.log('=== CHECKING SELLER STATUS ===');
      
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('Current user in useSellerAuth:', currentUser);
      
      // Get cached address for auto-fill from localStorage
      const address = localStorage.getItem('lastUsedAddress') || null;
      setCachedAddress(address);
      
      if (!currentUser.id) {
        console.log('No current user ID found');
        setHasActiveCase(false);
        setSellerCase(null);
        setIsLoading(false);
        return;
      }
      
      // Check for existing cases - try both real and test cases
      const realCases = getCasesForUser(currentUser.id);
      const testCases = getTestCasesForUser(currentUser.id);
      
      console.log('Real cases found:', realCases.length);
      console.log('Test cases found:', testCases.length);
      
      const allUserCases = [...realCases, ...testCases];
      
      if (allUserCases.length > 0) {
        // Get the most recent case
        allUserCases.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        const mostRecentCase = allUserCases[0];
        console.log('Most recent case found:', mostRecentCase);
        
        setHasActiveCase(true);
        setSellerCase({
          id: typeof mostRecentCase.id === 'string' ? mostRecentCase.id : mostRecentCase.id.toString(),
          address: mostRecentCase.address,
          status: mostRecentCase.status as 'draft' | 'active' | 'completed',
          submittedAt: mostRecentCase.createdAt
        });
      } else {
        console.log('No cases found for user');
        setHasActiveCase(false);
        setSellerCase(null);
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      setHasActiveCase(false);
      setSellerCase(null);
    } finally {
      setIsLoading(false);
      console.log('=== SELLER STATUS CHECK COMPLETE ===');
    }
  };

  const redirectBasedOnStatus = () => {
    if (hasActiveCase && sellerCase) {
      navigate(`${ROUTES.SELLER_MY_CASE}/${sellerCase.id}`);
    } else {
      navigate(ROUTES.SELLER_PROPERTY_DATA_NEW);
    }
  };

  const markCaseAsSubmitted = () => {
    localStorage.setItem('seller_has_active_case', 'true');
    setHasActiveCase(true);
    // Refresh the status to get the latest case data
    checkSellerStatus();
  };

  return {
    hasActiveCase,
    sellerCase,
    isLoading,
    cachedAddress,
    redirectBasedOnStatus,
    markCaseAsSubmitted,
    refreshStatus: checkSellerStatus
  };
};
