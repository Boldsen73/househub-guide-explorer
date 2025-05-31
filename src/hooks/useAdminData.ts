import { useState, useEffect, useCallback } from 'react';
import { getUsers, getCases, updateCaseStatus, archiveCaseMessages, User, Case } from '@/utils/userData';

export const useAdminData = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = useCallback(() => {
    console.log('Loading admin data...');
    
    // Load users from userData system
    const allUsers = getUsers();
    console.log('Loaded users:', allUsers);
    setUsers(allUsers);
    
    // Load cases from userData system
    const allCases = getCases();
    console.log('Loaded cases from userData:', allCases);
    
    // Also load seller cases from localStorage
    const sellerCases: Case[] = [];
    const sellerKeys = [];
    
    // Find all seller case keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seller_case_')) {
        sellerKeys.push(key);
      }
    }
    
    console.log('Found seller case keys:', sellerKeys);
    
    // Process each seller case
    sellerKeys.forEach(key => {
      try {
        const caseData = JSON.parse(localStorage.getItem(key) || '{}');
        if (caseData && caseData.address) {
          const caseId = key.replace('seller_case_', '');
          let sellerCaseStatus = localStorage.getItem(`seller_case_status_${caseId}`) || 'active';
          
          // Check for showing data to update status
          const showingData = localStorage.getItem(`case_${caseId}_showing`);
          if (showingData) {
            const parsedShowing = JSON.parse(showingData);
            if (parsedShowing.status) {
              sellerCaseStatus = parsedShowing.status;
            }
          }
          
          // Only include if not withdrawn or deleted
          if (sellerCaseStatus !== 'withdrawn' && sellerCaseStatus !== 'deleted') {
            // Get seller information with better fallback
            let sellerInfo = { 
              name: 'Ukendt sælger', 
              email: 'Ikke angivet', 
              phone: 'Ikke angivet' 
            };
            
            if (caseData.sellerId) {
              const seller = allUsers.find(u => u.id === caseData.sellerId);
              if (seller) {
                sellerInfo = {
                  name: seller.name || 'Ukendt sælger',
                  email: seller.email || 'Ikke angivet',
                  phone: seller.phone || 'Ikke angivet'
                };
              }
            }

            const processedCase: Case = {
              id: caseId,
              sagsnummer: caseData.sagsnummer || `SAG-${caseId.slice(-6)}`,
              sellerId: caseData.sellerId || 'unknown',
              sellerName: sellerInfo.name,
              sellerEmail: sellerInfo.email,
              sellerPhone: sellerInfo.phone,
              address: caseData.address,
              postnummer: caseData.postnummer || '',
              municipality: caseData.municipality || caseData.city || 'Ikke angivet',
              type: caseData.propertyType || caseData.type || 'Ikke angivet',
              size: typeof caseData.size === 'number' ? caseData.size : parseInt(caseData.size || '0'),
              buildYear: caseData.buildYear || new Date().getFullYear(),
              price: caseData.estimatedPrice || 'Ikke angivet',
              priceValue: parseInt(caseData.estimatedPrice?.replace(/[^\d]/g, '') || '0'),
              status: sellerCaseStatus as Case['status'],
              createdAt: caseData.createdAt || new Date().toISOString(),
              offers: [],
              showingRegistrations: [],
              messages: [],
              rooms: caseData.rooms || "Ikke angivet",
              description: caseData.notes || caseData.comments || `${caseData.propertyType || 'Bolig'} i ${caseData.municipality || caseData.city || 'Danmark'}`,
              energyLabel: caseData.energyLabel || "Ikke angivet",
              constructionYear: caseData.buildYear || new Date().getFullYear()
            };

            // Add showing information if available
            if (showingData) {
              const parsedShowing = JSON.parse(showingData);
              processedCase.showingDate = new Date(parsedShowing.showingDate);
              processedCase.showingTime = parsedShowing.showingTime;
              processedCase.showingNotes = parsedShowing.showingNotes;
            }

            sellerCases.push(processedCase);
          }
        }
      } catch (error) {
        console.error(`Error parsing seller case ${key}:`, error);
      }
    });
    
    console.log('Processed seller cases:', sellerCases);
    
    // Combine all cases, ensuring all required properties are present
    const combinedCases: Case[] = [
      ...allCases.map(c => ({
        ...c,
        sellerName: c.sellerName || 'Ukendt sælger',
        sellerEmail: c.sellerEmail || 'Ikke angivet',
        sellerPhone: c.sellerPhone || 'Ikke angivet',
        postnummer: c.postnummer || '',
        buildYear: c.buildYear || c.constructionYear || new Date().getFullYear()
      })), 
      ...sellerCases
    ];
    setCases(combinedCases);
    
    console.log('Final combined data:', { 
      users: allUsers.length, 
      cases: combinedCases.length,
      userBreakdown: {
        sellers: allUsers.filter(u => u.role === 'seller').length,
        agents: allUsers.filter(u => u.role === 'agent').length,
        admins: allUsers.filter(u => u.role === 'admin').length
      },
      caseBreakdown: {
        active: combinedCases.filter(c => !['archived', 'withdrawn'].includes(c.status)).length,
        archived: combinedCases.filter(c => ['archived', 'withdrawn'].includes(c.status)).length,
        showing_booked: combinedCases.filter(c => c.status === 'showing_booked').length,
        showing_completed: combinedCases.filter(c => c.status === 'showing_completed').length
      }
    });
  }, []);

  const handleStatusChange = useCallback((caseId: string, newStatus: Case['status']) => {
    console.log('Changing case status:', caseId, 'to', newStatus);
    
    // Update in userData system if it exists there
    try {
      updateCaseStatus(caseId, newStatus);
    } catch (error) {
      console.log('Case not in userData system, updating seller case status');
    }
    
    // Also update seller case status if it exists
    localStorage.setItem(`seller_case_status_${caseId}`, newStatus);
    
    // Update showing data if needed
    const showingKey = `case_${caseId}_showing`;
    const showingData = localStorage.getItem(showingKey);
    if (showingData) {
      const parsedShowing = JSON.parse(showingData);
      parsedShowing.status = newStatus;
      localStorage.setItem(showingKey, JSON.stringify(parsedShowing));
    }
    
    // If case is being archived, archive messages too
    if (newStatus === 'archived') {
      archiveCaseMessages(caseId);
    }
    
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
    
    // Listen for storage changes to update when new data is created
    const handleStorageChange = () => {
      console.log('Storage changed, reloading admin data');
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when data is created
    const handleDataCreated = () => {
      console.log('Data created event, reloading admin data');
      loadData();
    };
    
    const handleCaseUpdated = () => {
      console.log('Case updated event, reloading admin data');
      loadData();
    };
    
    const handleShowingBooked = () => {
      console.log('Showing booked event, reloading admin data');
      loadData();
    };
    
    window.addEventListener('userCreated', handleDataCreated);
    window.addEventListener('caseCreated', handleDataCreated);
    window.addEventListener('caseUpdated', handleCaseUpdated);
    window.addEventListener('showingBooked', handleShowingBooked);
    
    // Set up interval to check for new data periodically
    const interval = setInterval(() => {
      console.log('Periodic reload of admin data');
      loadData();
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userCreated', handleDataCreated);
      window.removeEventListener('caseCreated', handleDataCreated);
      window.removeEventListener('caseUpdated', handleCaseUpdated);
      window.removeEventListener('showingBooked', handleShowingBooked);
      clearInterval(interval);
    };
  }, [loadData]);

  return {
    cases,
    users,
    loadData,
    handleStatusChange
  };
};
