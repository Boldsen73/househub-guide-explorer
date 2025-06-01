import { useState, useEffect } from 'react';
import { getTestCases } from '@/utils/testData';
import { getCasesForUser } from '@/utils/caseManagement';

export interface SellerCase {
  id: string;
  address: string;
  status: 'draft' | 'active' | 'showing_scheduled' | 'showing_completed' | 'offers_received' | 'broker_selected';
  showingDate?: string;
  showingTime?: string;
  agentRegistrations: Array<{
    id: number;
    agentName: string;
    agencyName: string;
    status: 'registered' | 'declined';
    registeredAt: string;
  }>;
  offers: Array<{
    id: number;
    agentName: string;
    agencyName: string;
    expectedPrice: string;
    priceValue: number;
    commission: string;
    commissionValue: number;
    bindingPeriod: string;
    marketingPackage: string;
    score: number;
    submittedAt: string;
  }>;
}

export const useSellerCase = () => {
  const [sellerCase, setSellerCase] = useState<SellerCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSellerCase();
  }, []);

  const loadSellerCase = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id) {
      setSellerCase(null);
      setIsLoading(false);
      return;
    }

    console.log('Loading seller case for user:', currentUser.id);

    // First check real cases from localStorage/caseManagement
    const realCases = getCasesForUser(currentUser.id);
    console.log('Real cases found:', realCases);
    
    // Then check test cases as fallback
    const testCases = getTestCases();
    const testUserCase = testCases.find(c => c.sellerId === currentUser.id);
    
    // Use real case if available, otherwise use test case
    const userCase = realCases.length > 0 ? realCases[0] : testUserCase;
    
    if (userCase) {
      console.log('Found user case:', userCase);
      
      // Get agent registrations - ensure they're specific to this case
      const registrations = JSON.parse(localStorage.getItem(`showing_registrations_${userCase.id}`) || '[]');
      
      // Get offers - ensure they're specific to this case
      const offers = JSON.parse(localStorage.getItem(`case_offers_${userCase.id}`) || '[]');
      
      // Get showing data - ensure it's specific to this case
      const showingData = JSON.parse(localStorage.getItem(`showing_data_${userCase.id}`) || '{}');
      
      setSellerCase({
        id: userCase.id.toString(),
        address: userCase.address,
        status: determineStatus(showingData, registrations, offers),
        showingDate: showingData.date,
        showingTime: showingData.time,
        agentRegistrations: registrations,
        offers: offers
      });
    } else {
      console.log('No case found for user');
      setSellerCase(null);
    }
    
    setIsLoading(false);
  };

  const determineStatus = (showingData: any, registrations: any[], offers: any[]) => {
    if (offers.length > 0) return 'offers_received';
    if (showingData.completed) return 'showing_completed';
    if (showingData.date) return 'showing_scheduled';
    return 'active';
  };

  const scheduleShowing = (date: string, time: string) => {
    if (sellerCase) {
      const showingData = { date, time, completed: false };
      localStorage.setItem(`showing_data_${sellerCase.id}`, JSON.stringify(showingData));
      loadSellerCase();
    }
  };

  const markShowingCompleted = () => {
    if (sellerCase) {
      const showingData = { 
        date: sellerCase.showingDate, 
        time: sellerCase.showingTime, 
        completed: true 
      };
      localStorage.setItem(`showing_data_${sellerCase.id}`, JSON.stringify(showingData));
      loadSellerCase();
    }
  };

  return {
    sellerCase,
    isLoading,
    scheduleShowing,
    markShowingCompleted,
    refreshCase: loadSellerCase
  };
};
