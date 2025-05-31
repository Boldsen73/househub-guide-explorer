import { useState, useEffect } from 'react';
import { CaseStatus, AgentOffer } from '@/types/agent';
import { Case } from '@/types/case';
import { getAllCases } from '@/utils/caseStorageManager';

// Use the Case interface from types/case.ts and extend it
interface CaseWithStatus extends Case {
  agentStatus: CaseStatus;
  agentOffer?: AgentOffer;
  rejectedAt?: string;
  submittedAt?: string;
  deadline?: string;
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
}

export const useAgentCases = () => {
  const [activeTab, setActiveTab] = useState<CaseStatus>('active');
  const [cases, setCases] = useState<CaseWithStatus[]>([]);

  useEffect(() => {
    // Load saved tab from localStorage
    const savedTab = localStorage.getItem('agentActiveTab') as CaseStatus;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const loadCases = () => {
      console.log('Loading cases for agent...');
      
      // Get all users first for seller information
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('All users for agent case loading:', allUsers);
      
      // Get cases from central storage first
      const centralCases = getAllCases();
      console.log('Central cases found:', centralCases);
      
      // Also check for individual seller cases for backward compatibility
      const userCases: CaseWithStatus[] = [];
      const processedCaseIds = new Set<string>();
      
      // Process central cases first
      centralCases.forEach(caseData => {
        if (caseData && caseData.address && caseData.id) {
          const caseId = caseData.id.toString();
          
          if (!processedCaseIds.has(caseId)) {
            // Get seller information
            let sellerInfo = { 
              name: 'Ukendt sælger', 
              email: 'Ikke angivet', 
              phone: 'Ikke angivet' 
            };
            
            if (caseData.sellerId) {
              const seller = allUsers.find(u => u.id === caseData.sellerId);
              if (seller) {
                sellerInfo = {
                  name: seller.name || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Ukendt sælger',
                  email: seller.email || 'Ikke angivet',
                  phone: seller.phone || 'Ikke angivet'
                };
              }
            }

            userCases.push({
              id: parseInt(caseId),
              address: caseData.address,
              municipality: caseData.municipality || caseData.city || 'Ikke angivet',
              type: caseData.type || caseData.propertyType || 'Ikke angivet',
              size: caseData.size ? (typeof caseData.size === 'string' ? caseData.size : `${caseData.size} m²`) : 'Ikke angivet',
              price: caseData.price || caseData.expectedPrice || 'Ikke angivet',
              priceValue: caseData.priceValue || caseData.expectedPriceValue || 0,
              constructionYear: caseData.buildYear || new Date().getFullYear(),
              status: 'waiting_for_offers' as const,
              sellerId: caseData.sellerId,
              sellerName: sellerInfo.name,
              sellerEmail: sellerInfo.email,
              sellerPhone: sellerInfo.phone,
              rooms: caseData.rooms || "Ikke angivet",
              description: caseData.notes || caseData.sellerComments || caseData.comments || `${caseData.type || caseData.propertyType || 'Bolig'} i ${caseData.municipality || caseData.city || 'Danmark'}`,
              energyLabel: caseData.energyLabel || "C",
              agentStatus: 'active' as CaseStatus,
              deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
            processedCaseIds.add(caseId);
            console.log(`Added central case ${caseId} to agent view`);
          }
        }
      });
      
      // Also scan for individual seller cases (backward compatibility)
      console.log('Scanning localStorage for individual seller cases...');
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('seller_case_')) {
          try {
            const caseData = JSON.parse(localStorage.getItem(key) || '{}');
            const caseId = key.replace('seller_case_', '');
            
            // Skip if this case ID is already processed from central storage
            if (processedCaseIds.has(caseId)) {
              console.log(`Case ${caseId} already processed from central storage, skipping individual case`);
              continue;
            }
            
            if (caseData && caseData.address) {
              // Check if the case is still active from seller perspective
              const sellerCaseStatus = localStorage.getItem(`seller_case_status_${caseId}`);
              const showingData = localStorage.getItem(`case_${caseId}_showing`);
              
              const isVisible = !sellerCaseStatus || 
                               sellerCaseStatus === 'active' || 
                               sellerCaseStatus === 'showing_booked' || 
                               sellerCaseStatus === 'showing_completed' ||
                               showingData;
              
              if (isVisible) {
                let sellerInfo = { 
                  name: 'Ukendt sælger', 
                  email: 'Ikke angivet', 
                  phone: 'Ikke angivet' 
                };
                
                if (caseData.sellerId) {
                  const seller = allUsers.find(u => u.id === caseData.sellerId);
                  if (seller) {
                    sellerInfo = {
                      name: seller.name || `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Ukendt sælger',
                      email: seller.email || 'Ikke angivet',
                      phone: seller.phone || 'Ikke angivet'
                    };
                  }
                }

                userCases.push({
                  id: parseInt(caseId),
                  address: caseData.address,
                  municipality: caseData.municipality || caseData.city || 'Ikke angivet',
                  type: caseData.propertyType || caseData.type || 'Ikke angivet',
                  size: caseData.size ? (typeof caseData.size === 'string' ? caseData.size : `${caseData.size} m²`) : 'Ikke angivet',
                  price: caseData.expectedPrice || caseData.estimatedPrice || 'Ikke angivet',
                  priceValue: caseData.expectedPriceValue || parseInt(caseData.estimatedPrice?.replace(/[^\d]/g, '') || '0'),
                  constructionYear: caseData.buildYear || new Date().getFullYear(),
                  status: 'waiting_for_offers' as const,
                  sellerId: caseData.sellerId,
                  sellerName: sellerInfo.name,
                  sellerEmail: sellerInfo.email,
                  sellerPhone: sellerInfo.phone,
                  rooms: caseData.rooms || "Ikke angivet",
                  description: caseData.notes || caseData.sellerComments || caseData.comments || `${caseData.propertyType || 'Bolig'} i ${caseData.municipality || caseData.city || 'Danmark'}`,
                  energyLabel: caseData.energyLabel || "C",
                  agentStatus: 'active' as CaseStatus,
                  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                });
                processedCaseIds.add(caseId);
                console.log(`Added individual case ${caseId} to agent view`);
              }
            }
          } catch (error) {
            console.error(`Error parsing case data for key ${key}:`, error);
          }
        }
      }
      
      console.log('All cases found for agents:', userCases);
      
      if (!userCases || userCases.length === 0) {
        console.log('No cases found for agents');
        setCases([]);
        return;
      }
      
      // Convert cases to agent case format
      const agentCaseStates = JSON.parse(localStorage.getItem('agentCaseStates') || '{}');
      console.log('Agent case states:', agentCaseStates);
      
      const convertedCases = userCases.map(sellerCase => {
        const agentState = agentCaseStates[sellerCase.id];
        
        return {
          ...sellerCase,
          agentStatus: agentState?.agentStatus || 'active' as CaseStatus,
          submittedAt: agentState?.submittedAt,
          rejectedAt: agentState?.rejectedAt,
          agentOffer: agentState?.agentOffer,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      });
      
      console.log('Final converted cases for agent view:', convertedCases);
      setCases(convertedCases);
    };

    // Initial load
    loadCases();
    
    // Listen for storage changes to update when new cases are created
    const handleStorageChange = () => {
      console.log('Storage changed, reloading cases');
      loadCases();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when cases are created
    const handleCaseCreated = () => {
      console.log('Case created event received, reloading cases');
      loadCases();
    };
    
    const handleCaseUpdated = () => {
      console.log('Case updated event received, reloading cases');
      loadCases();
    };
    
    const handleShowingBooked = () => {
      console.log('Showing booked event received, reloading cases');
      loadCases();
    };
    
    window.addEventListener('caseCreated', handleCaseCreated);
    window.addEventListener('caseUpdated', handleCaseUpdated);
    window.addEventListener('showingBooked', handleShowingBooked);
    
    // Set up interval to check for new cases periodically
    const interval = setInterval(loadCases, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('caseCreated', handleCaseCreated);
      window.removeEventListener('caseUpdated', handleCaseUpdated);
      window.removeEventListener('showingBooked', handleShowingBooked);
      clearInterval(interval);
    };
  }, []);

  const saveCaseStates = (caseId: number, agentStatus: CaseStatus, offer?: AgentOffer) => {
    const savedCaseStates = localStorage.getItem('agentCaseStates');
    let caseStates: { [key: number]: any } = {};
    if (savedCaseStates) {
      try {
        caseStates = JSON.parse(savedCaseStates);
      } catch (error) {
        console.error('Error parsing saved case states:', error);
      }
    }

    caseStates[caseId] = {
      agentStatus,
      submittedAt: agentStatus === 'offer_submitted' ? new Date().toISOString() : caseStates[caseId]?.submittedAt,
      rejectedAt: agentStatus === 'rejected' ? new Date().toISOString() : caseStates[caseId]?.rejectedAt,
      agentOffer: offer || caseStates[caseId]?.agentOffer
    };

    localStorage.setItem('agentCaseStates', JSON.stringify(caseStates));
  };

  const updateCaseStatus = (caseId: number, newStatus: CaseStatus, offer?: AgentOffer) => {
    saveCaseStates(caseId, newStatus, offer);
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  const unrejectCase = (caseId: number) => {
    updateCaseStatus(caseId, 'active');
  };

  const saveActiveTab = (tab: CaseStatus) => {
    setActiveTab(tab);
    localStorage.setItem('agentActiveTab', tab);
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Udløbet', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (diffDays === 0) return { text: 'I dag', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (diffDays === 1) return { text: '1 dag tilbage', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (diffDays === 2) return { text: '2 dage tilbage', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: `${diffDays} dage tilbage`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  return {
    activeTab,
    setActiveTab: saveActiveTab,
    updateCaseStatus,
    unrejectCase,
    getTimeRemaining,
    cases
  };
};
