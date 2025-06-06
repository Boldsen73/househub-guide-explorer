
import { useState, useEffect } from 'react';
import { getCasesForUser, getCompleteCaseData } from '@/utils/caseManagement';
import { getTestCasesForUser } from '@/utils/testData';

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

    // Listen for case updates
    const handleCaseUpdate = () => {
      console.log('Case update detected in useSellerCase');
      setTimeout(loadSellerCase, 100);
    };

    window.addEventListener('caseCreated', handleCaseUpdate);
    window.addEventListener('caseUpdated', handleCaseUpdate);
    window.addEventListener('casesChanged', handleCaseUpdate);

    return () => {
      window.removeEventListener('caseCreated', handleCaseUpdate);
      window.removeEventListener('caseUpdated', handleCaseUpdate);
      window.removeEventListener('casesChanged', handleCaseUpdate);
    };
  }, []);

  const loadSellerCase = () => {
    console.log('=== LOADING SELLER CASE ===');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id) {
      console.log('No current user found');
      setSellerCase(null);
      setIsLoading(false);
      return;
    }

    console.log('Loading seller case for user:', currentUser.id);

    // First check real cases from localStorage/caseManagement
    const realCases = getCasesForUser(currentUser.id);
    console.log('Real cases found:', realCases);
    
    // Then check test cases as fallback
    const testCases = getTestCasesForUser(currentUser.id);
    console.log('Test cases found:', testCases);
    
    // Combine and get the most recent case
    const allUserCases = [...realCases, ...testCases];
    
    if (allUserCases.length > 0) {
      // Sort by creation date and get most recent
      allUserCases.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      const userCase = allUserCases[0];
      console.log('Using most recent case:', userCase);
      
      // Get agent registrations - ensure they're specific to this case
      const registrations = JSON.parse(localStorage.getItem(`showing_registrations_${userCase.id}`) || '[]');
      
      // Get offers - ensure they're specific to this case
      const offers = JSON.parse(localStorage.getItem(`case_offers_${userCase.id}`) || '[]');
      
      // Get showing data - ensure it's specific to this case
      const showingData = JSON.parse(localStorage.getItem(`showing_data_${userCase.id}`) || '{}');
      
      // Also check for showing data in multiple formats for robustness
      let finalShowingData = showingData;
      if (!finalShowingData.date && !finalShowingData.time) {
        // Try alternative storage keys
        const altShowingData = JSON.parse(localStorage.getItem(`case_${userCase.id}_showing`) || '{}');
        if (altShowingData.showingDate || altShowingData.showingTime) {
          finalShowingData = {
            date: altShowingData.showingDate,
            time: altShowingData.showingTime,
            completed: altShowingData.status === 'showing_completed'
          };
        }
      }
      
      setSellerCase({
        id: userCase.id.toString(),
        address: userCase.address,
        status: determineStatus(finalShowingData, registrations, offers),
        showingDate: finalShowingData.date,
        showingTime: finalShowingData.time,
        agentRegistrations: registrations,
        offers: offers
      });
    } else {
      console.log('No case found for user');
      setSellerCase(null);
    }
    
    setIsLoading(false);
    console.log('=== SELLER CASE LOADING COMPLETE ===');
  };

  const determineStatus = (showingData: any, registrations: any[], offers: any[]) => {
    if (offers.length > 0) return 'offers_received';
    if (showingData.completed) return 'showing_completed';
    if (showingData.date && showingData.time) return 'showing_scheduled';
    return 'active';
  };

  const scheduleShowing = (date: string, time: string) => {
    if (sellerCase) {
      const showingData = { date, time, completed: false };
      localStorage.setItem(`showing_data_${sellerCase.id}`, JSON.stringify(showingData));
      
      // Also store in agent-accessible format for synchronization
      localStorage.setItem(`case_${sellerCase.id}_showing`, JSON.stringify({
        showingDate: date,
        showingTime: time,
        showingNotes: '',
        status: 'showing_booked'
      }));
      
      // Update the case status in central storage
      const cases = JSON.parse(localStorage.getItem('cases') || '[]');
      const updatedCases = cases.map((c: any) => 
        c.id === sellerCase.id ? { ...c, status: 'showing_booked', showingDate: date, showingTime: time } : c
      );
      localStorage.setItem('cases', JSON.stringify(updatedCases));
      
      // Dispatch events for real-time updates
      window.dispatchEvent(new CustomEvent('caseUpdated'));
      window.dispatchEvent(new CustomEvent('showingBooked', { detail: { caseId: sellerCase.id } }));
      
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
      
      // Update agent-accessible format
      localStorage.setItem(`case_${sellerCase.id}_showing`, JSON.stringify({
        showingDate: sellerCase.showingDate,
        showingTime: sellerCase.showingTime,
        showingNotes: '',
        status: 'showing_completed'
      }));
      
      // Update the case status in central storage
      const cases = JSON.parse(localStorage.getItem('cases') || '[]');
      const updatedCases = cases.map((c: any) => 
        c.id === sellerCase.id ? { ...c, status: 'showing_completed' } : c
      );
      localStorage.setItem('cases', JSON.stringify(updatedCases));
      
      // Dispatch events for real-time updates
      window.dispatchEvent(new CustomEvent('caseUpdated'));
      window.dispatchEvent(new CustomEvent('showingCompleted', { detail: { caseId: sellerCase.id } }));
      
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
