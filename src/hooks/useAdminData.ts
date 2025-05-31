
import { useState, useCallback } from 'react';
import { User, Case } from '@/utils/userData';
import { loadUsersData, loadCasesData, loadSellerCasesFromStorage } from '@/services/adminDataService';
import { useCaseStatusManager } from './useCaseStatusManager';
import { useAdminDataEvents } from './useAdminDataEvents';
import { combineAllCases, logDataBreakdown } from '@/utils/adminDataCombiner';

export const useAdminData = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = useCallback(() => {
    console.log('Loading admin data...');
    
    // Load users from userData system
    const allUsers = loadUsersData();
    setUsers(allUsers);
    
    // Load cases from userData system
    const allCases = loadCasesData();
    
    // Load seller cases from localStorage
    const sellerCases = loadSellerCasesFromStorage(allUsers);
    
    // Combine all cases
    const combinedCases = combineAllCases(allCases, sellerCases);
    setCases(combinedCases);
    
    // Log final breakdown
    logDataBreakdown(allUsers, combinedCases);
  }, []);

  const { handleStatusChange } = useCaseStatusManager(loadData);
  
  // Set up event listeners and periodic reloading
  useAdminDataEvents(loadData);

  // Initial load
  useState(() => {
    loadData();
  });

  return {
    cases,
    users,
    loadData,
    handleStatusChange
  };
};
