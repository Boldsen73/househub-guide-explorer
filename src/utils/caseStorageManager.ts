
// Centralized case storage manager for consistent data handling
import { Case } from '@/types/user';

// Get all cases from localStorage
export const getAllCases = (): Case[] => {
  try {
    const cases = localStorage.getItem('cases');
    const parsedCases = cases ? JSON.parse(cases) : [];
    console.log('getAllCases returning:', parsedCases);
    return parsedCases;
  } catch (error) {
    console.error('Error getting cases:', error);
    return [];
  }
};

// Save a case and ensure all systems are notified
export const saveCaseToStorage = (case_: Case): void => {
  try {
    console.log('saveCaseToStorage called with case:', case_);
    
    // Get existing cases
    const existingCases = getAllCases();
    
    // Find if case already exists
    const existingIndex = existingCases.findIndex(c => c.id === case_.id);
    
    if (existingIndex >= 0) {
      // Update existing case
      existingCases[existingIndex] = case_;
      console.log('Updated existing case at index:', existingIndex);
    } else {
      // Add new case
      existingCases.push(case_);
      console.log('Added new case. Total cases now:', existingCases.length);
    }
    
    // Save to localStorage
    localStorage.setItem('cases', JSON.stringify(existingCases));
    console.log('Cases saved to localStorage. Current cases:', existingCases);
    
    // Also save individual case for backup
    localStorage.setItem(`seller_case_${case_.id}`, JSON.stringify(case_));
    
    // Dispatch comprehensive events
    dispatchCaseEvents(case_);
    
  } catch (error) {
    console.error('Error saving case:', error);
  }
};

// Dispatch all necessary events for case updates
const dispatchCaseEvents = (case_: Case): void => {
  console.log('Dispatching events for case:', case_.id);
  
  // Custom events for specific listeners
  window.dispatchEvent(new CustomEvent('caseCreated', { detail: case_ }));
  window.dispatchEvent(new CustomEvent('caseUpdated', { detail: case_ }));
  window.dispatchEvent(new CustomEvent('casesChanged', { detail: case_ }));
  
  // Storage event to trigger other listeners
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'cases',
    newValue: localStorage.getItem('cases'),
    oldValue: null,
    storageArea: localStorage
  }));
  
  console.log('All case events dispatched for:', case_.id);
};

// Get cases for a specific user
export const getCasesForUser = (userId: string): Case[] => {
  const allCases = getAllCases();
  const userCases = allCases.filter(case_ => case_.sellerId === userId);
  console.log(`getCasesForUser(${userId}) returning ${userCases.length} cases:`, userCases);
  return userCases;
};

// Get a specific case by ID
export const getCaseById = (caseId: string): Case | null => {
  const allCases = getAllCases();
  const case_ = allCases.find(c => c.id === caseId) || null;
  console.log(`getCaseById(${caseId}) found:`, case_);
  return case_;
};

// Create complete case with all form data
export const createCompleteCase = (caseId: string, basicCaseData: any): Case => {
  console.log('createCompleteCase called with:', { caseId, basicCaseData });
  
  // Get all form data from localStorage
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  
  let completeCase = { ...basicCaseData };
  
  // Add property form data if available
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      console.log('Adding property data:', parsed);
      completeCase = {
        ...completeCase,
        propertyType: parsed.propertyType,
        size: parsed.size,
        buildYear: parsed.buildYear,
        rooms: parsed.rooms,
        notes: parsed.notes,
        city: parsed.city || completeCase.municipality
      };
    } catch (error) {
      console.error('Error parsing property data:', error);
    }
  }
  
  // Add sales preferences if available
  if (salesPreferences) {
    try {
      const parsed = JSON.parse(salesPreferences);
      console.log('Adding sales preferences:', parsed);
      completeCase = {
        ...completeCase,
        expectedPrice: parsed.expectedPrice?.[0] ? `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : completeCase.price,
        expectedPriceValue: parsed.expectedPrice?.[0] || completeCase.priceValue,
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
  
  // Save the complete case
  saveCaseToStorage(completeCase);
  
  console.log('Successfully created complete case:', completeCase);
  return completeCase;
};
