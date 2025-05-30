
import { useState, useEffect } from 'react';
import { getTestCases } from '@/utils/testData';

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
    const cases = getTestCases();
    const userCase = cases.find(c => c.sellerId === currentUser.id);
    
    if (userCase) {
      // Get agent registrations - ensure they're specific to this case
      const registrations = JSON.parse(localStorage.getItem(`showing_registrations_${userCase.id}`) || '[]');
      
      // Get offers - ensure they're specific to this case
      const offers = JSON.parse(localStorage.getItem(`case_offers_${userCase.id}`) || '[]');
      
      // Get showing data - ensure it's specific to this case, not inherited from other cases
      const showingData = JSON.parse(localStorage.getItem(`showing_data_${userCase.id}`) || '{}');
      
      setSellerCase({
        id: userCase.id,
        address: userCase.address,
        status: determineStatus(showingData, registrations, offers),
        showingDate: showingData.date,
        showingTime: showingData.time,
        agentRegistrations: registrations,
        offers: offers
      });
    } else {
      // Check if we have a newly created case in localStorage that doesn't exist in test data yet
      const userCreatedCases = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('seller_case_') && currentUser.id) {
          try {
            const caseData = JSON.parse(localStorage.getItem(key) || '{}');
            if (caseData && caseData.address && caseData.sellerId === currentUser.id) {
              const caseId = key.replace('seller_case_', '');
              
              // For new cases, start fresh without inherited showing data
              const newCaseRegistrations = JSON.parse(localStorage.getItem(`showing_registrations_${caseId}`) || '[]');
              const newCaseOffers = JSON.parse(localStorage.getItem(`case_offers_${caseId}`) || '[]');
              const newCaseShowingData = JSON.parse(localStorage.getItem(`showing_data_${caseId}`) || '{}');
              
              setSellerCase({
                id: caseId,
                address: caseData.address,
                status: determineStatus(newCaseShowingData, newCaseRegistrations, newCaseOffers),
                showingDate: newCaseShowingData.date,
                showingTime: newCaseShowingData.time,
                agentRegistrations: newCaseRegistrations,
                offers: newCaseOffers
              });
              break; // Only take the first matching case
            }
          } catch {
            // ignore error
          }
        }
      }
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
