
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCachedSellerAddress, getCases } from '@/utils/userData';
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
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Get cached address for auto-fill
      const address = getCachedSellerAddress();
      setCachedAddress(address);
      
      // Check for existing cases
      const cases = getCases();
      const userCase = cases.find(c => c.sellerId === currentUser.id);
      
      if (userCase) {
        setHasActiveCase(true);
        setSellerCase({
          id: typeof userCase.id === 'string' ? userCase.id : userCase.id.toString(),
          address: userCase.address,
          status: userCase.status as 'draft' | 'active' | 'completed',
          submittedAt: userCase.createdAt
        });
      } else {
        setHasActiveCase(false);
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      setHasActiveCase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnStatus = () => {
    if (hasActiveCase) {
      navigate(ROUTES.SELLER_MY_CASE);
    } else {
      // Updated to use correct English route
      navigate(ROUTES.SELLER_PROPERTY_DATA_NEW);
    }
  };

  const markCaseAsSubmitted = () => {
    localStorage.setItem('seller_has_active_case', 'true');
    setHasActiveCase(true);
  };

  return {
    hasActiveCase,
    sellerCase,
    isLoading,
    cachedAddress,
    redirectBasedOnStatus,
    markCaseAsSubmitted
  };
};
