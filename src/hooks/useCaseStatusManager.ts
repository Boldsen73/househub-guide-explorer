
import { useCallback } from 'react';
import { updateCaseStatus, archiveCaseMessages, Case } from '@/utils/userData';

export const useCaseStatusManager = (loadData: () => void) => {
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

  return { handleStatusChange };
};
