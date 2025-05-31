
import { Case } from '@/types/user';
import { 
  getAllCases, 
  saveCaseToStorage, 
  getCasesForUser as getStoredCasesForUser,
  getCaseById as getStoredCaseById,
  createCompleteCase as createStoredCompleteCase
} from './caseStorageManager';

export const getCases = (): Case[] => {
  console.log('getCases called from caseManagement');
  const cases = getAllCases();
  console.log('getCases returning:', cases.length, 'cases');
  return cases;
};

// Get cases for specific user only
export const getCasesForUser = (userId: string): Case[] => {
  console.log('getCasesForUser called for:', userId);
  const cases = getStoredCasesForUser(userId);
  console.log('getCasesForUser returning:', cases.length, 'cases for user', userId);
  return cases;
};

export const saveCase = (case_: Case) => {
  console.log('=== saveCase called in caseManagement ===');
  console.log('Case to save:', case_);
  saveCaseToStorage(case_);
  console.log('=== saveCase completed in caseManagement ===');
};

// Enhanced case creation that ensures all data is properly saved
export const createCompleteCase = (caseId: string, basicCaseData: any) => {
  console.log('=== createCompleteCase called in caseManagement ===');
  console.log('Case ID:', caseId);
  console.log('Basic case data:', basicCaseData);
  
  const result = createStoredCompleteCase(caseId, basicCaseData);
  
  console.log('=== createCompleteCase completed in caseManagement ===');
  return result;
};

// Update existing case with complete data
export const updateCaseWithCompleteData = (caseId: string, basicCaseData: any) => {
  console.log('=== updateCaseWithCompleteData called ===');
  console.log('Case ID:', caseId);
  console.log('Basic case data:', basicCaseData);
  
  const existingCase = getCaseById(caseId);
  if (!existingCase) {
    console.log('No existing case found, creating new one');
    return createCompleteCase(caseId, basicCaseData);
  }

  // Get all form data
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  
  let updatedCase = { ...existingCase, ...basicCaseData };
  
  // Add property form data
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      updatedCase = {
        ...updatedCase,
        propertyType: parsed.propertyType,
        size: parsed.size,
        buildYear: parsed.buildYear,
        rooms: parsed.rooms,
        notes: parsed.notes,
        city: parsed.city || updatedCase.municipality
      };
    } catch (error) {
      console.error('Error parsing property data:', error);
    }
  }
  
  // Add sales preferences
  if (salesPreferences) {
    try {
      const parsed = JSON.parse(salesPreferences);
      updatedCase = {
        ...updatedCase,
        expectedPrice: parsed.expectedPrice?.[0] ? `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : updatedCase.price,
        expectedPriceValue: parsed.expectedPrice?.[0] || updatedCase.priceValue,
        timeframe: parsed.timeframe?.[0],
        timeframeType: parsed.timeframeType,
        priorities: {
          speed: parsed.prioritySpeed || false,
          price: parsed.priorityPrice || false,
          service: parsed.priorityService || false
        },
        specialRequests: parsed.specialRequests,
        flexiblePrice: parsed.flexiblePrice,
        marketingBudget: parsed.marketingBudget?.[0],
        freeIfNotSold: parsed.freeIfNotSold
      };
    } catch (error) {
      console.error('Error parsing sales preferences:', error);
    }
  }
  
  // Save updated case
  saveCase(updatedCase);
  localStorage.setItem(`seller_case_${caseId}`, JSON.stringify(updatedCase));
  
  console.log('Successfully updated complete case:', updatedCase);
  console.log('=== updateCaseWithCompleteData completed ===');
  return updatedCase;
};

// Enhanced function to get complete case data including seller inputs
export const getCompleteCaseData = (caseId: string) => {
  console.log('getCompleteCaseData called for:', caseId);
  
  // First try to get from central cases storage
  const case_ = getCaseById(caseId);
  if (case_) {
    console.log('Found case in central storage:', case_);
    return case_;
  }

  // Fallback to case-specific storage
  const caseSpecificData = localStorage.getItem(`seller_case_${caseId}`);
  if (caseSpecificData) {
    try {
      const parsed = JSON.parse(caseSpecificData);
      console.log('Found case in case-specific storage:', parsed);
      // Also save to central storage for consistency
      saveCase(parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing case-specific data:', error);
    }
  }

  console.log('No case data found for:', caseId);
  return null;
};

export const updateCaseStatus = (caseId: string, newStatus: Case['status']) => {
  console.log('updateCaseStatus called for:', caseId, 'new status:', newStatus);
  
  const cases = getCases();
  const updatedCases = cases.map(c => 
    c.id === caseId ? { ...c, status: newStatus } : c
  );
  
  localStorage.setItem('cases', JSON.stringify(updatedCases));
  
  // Dispatch events to notify components
  window.dispatchEvent(new CustomEvent('caseUpdated'));
  window.dispatchEvent(new Event('storage'));
  
  console.log('Case status updated and events dispatched');
};

export const getCaseById = (id: string): Case | null => {
  console.log('getCaseById called for:', id);
  const case_ = getStoredCaseById(id);
  console.log('getCaseById result:', case_);
  return case_;
};

export const getCaseBySagsnummer = (sagsnummer: string): Case | null => {
  const cases = getCases();
  return cases.find(c => c.sagsnummer === sagsnummer) || null;
};

export const generateSagsnummer = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HH-${year}-${timestamp}${random}`;
};
