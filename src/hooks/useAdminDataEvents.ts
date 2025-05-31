
import { useEffect } from 'react';

export const useAdminDataEvents = (loadData: () => void) => {
  useEffect(() => {
    // Listen for storage changes to update when new data is created
    const handleStorageChange = () => {
      console.log('Storage changed, reloading admin data');
      loadData();
    };
    
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
    
    window.addEventListener('storage', handleStorageChange);
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
};
