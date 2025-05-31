
import { Case } from '@/types/user';

export const getCases = (): Case[] => {
  const cases = localStorage.getItem('cases');
  const parsedCases = cases ? JSON.parse(cases) : [];
  console.log('getCases returning:', parsedCases);
  return parsedCases;
};

// Get cases for specific user only
export const getCasesForUser = (userId: string): Case[] => {
  const allCases = getCases();
  const userCases = allCases.filter(case_ => case_.sellerId === userId);
  console.log(`getCasesForUser(${userId}) returning:`, userCases);
  return userCases;
};

export const saveCase = (case_: Case) => {
  const cases = getCases();
  const existingIndex = cases.findIndex(c => c.id === case_.id);
  
  if (existingIndex >= 0) {
    cases[existingIndex] = case_;
    console.log('Updated existing case:', case_.id);
  } else {
    cases.push(case_);
    console.log('Added new case:', case_.id);
  }
  
  localStorage.setItem('cases', JSON.stringify(cases));
  
  // Dispatch multiple events to ensure all components update
  window.dispatchEvent(new CustomEvent('caseUpdated', { detail: case_ }));
  window.dispatchEvent(new CustomEvent('caseCreated', { detail: case_ }));
  
  // Create a proper storage event
  const storageEvent = new Event('storage');
  window.dispatchEvent(storageEvent);
  
  console.log('Dispatched case events for case:', case_.id);
};

// Enhanced case creation that ensures all data is properly saved
export const createCompleteCase = (caseId: string, basicCaseData: any) => {
  console.log('createCompleteCase called with:', { caseId, basicCaseData });
  
  // Prevent duplicate cases by checking if one already exists
  const existingCase = getCaseById(caseId);
  if (existingCase) {
    console.log('Case already exists, updating with new data');
    return updateCaseWithCompleteData(caseId, basicCaseData);
  }

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
  
  // Save to central storage immediately
  console.log('Saving complete case to central storage:', completeCase);
  saveCase(completeCase);
  
  // Also save to case-specific storage for backup
  localStorage.setItem(`seller_case_${caseId}`, JSON.stringify(completeCase));
  
  console.log('Successfully created complete case:', completeCase);
  return completeCase;
};

// Update existing case with complete data
export const updateCaseWithCompleteData = (caseId: string, basicCaseData: any) => {
  console.log('updateCaseWithCompleteData called for:', caseId);
  
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
  return updatedCase;
};

// Enhanced function to get complete case data including seller inputs
export const getCompleteCaseData = (caseId: string) => {
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
  const cases = getCases();
  const updatedCases = cases.map(c => 
    c.id === caseId ? { ...c, status: newStatus } : c
  );
  localStorage.setItem('cases', JSON.stringify(updatedCases));
  
  // Dispatch events to notify components
  window.dispatchEvent(new CustomEvent('caseUpdated'));
  const storageEvent = new Event('storage');
  window.dispatchEvent(storageEvent);
};

export const getCaseById = (id: string): Case | null => {
  const cases = getCases();
  const found = cases.find(c => c.id === id) || null;
  console.log(`getCaseById(${id}) found:`, found);
  return found;
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
