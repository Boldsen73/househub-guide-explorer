import { useState, useCallback, useEffect } from 'react';
import { Case } from '@/utils/userData';
import {
  loadCasesData,
  loadSellerCasesFromStorage
} from '@/services/adminDataService';
import {
  getTestUsers,
  TestUser as User
} from '@/utils/userManagement'; // ✅ Opdateret import

import { useCaseStatusManager } from './useCaseStatusManager';
import { useAdminDataEvents } from './useAdminDataEvents';
import { combineAllCases, logDataBreakdown } from '@/utils/adminDataCombiner';

export const useAdminData = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = useCallback(() => {
    console.log('🔄 Henter admin-data...');

    // ✅ Hent brugere direkte fra mock-localStorage
    const allUsers = getTestUsers();
    setUsers(allUsers);

    // Hent sager fra backend eller statisk mock
    const allCases = loadCasesData();

    // Hent lokale sager (fra sælgere) og kombiner dem
    const sellerCases = loadSellerCasesFromStorage(allUsers);
    const combinedCases = combineAllCases(allCases, sellerCases);
    setCases(combinedCases);

    // Log
    logDataBreakdown(allUsers, combinedCases);
  }, []);

  const { handleStatusChange } = useCaseStatusManager(loadData);

  // Sæt event-listere og reloads
  useAdminDataEvents(loadData);

  // Initielt load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    cases,
    users,
    loadData,
    handleStatusChange
  };
};
