
import { Case } from '@/types/user';

export const getCases = (): Case[] => {
  const cases = localStorage.getItem('cases');
  return cases ? JSON.parse(cases) : [];
};

// Get cases for specific user only
export const getCasesForUser = (userId: string): Case[] => {
  const allCases = getCases();
  return allCases.filter(case_ => case_.sellerId === userId);
};

export const saveCase = (case_: Case) => {
  const cases = getCases();
  const existingIndex = cases.findIndex(c => c.id === case_.id);
  
  if (existingIndex >= 0) {
    cases[existingIndex] = case_;
  } else {
    cases.push(case_);
  }
  
  localStorage.setItem('cases', JSON.stringify(cases));
};

// Create a complete case from form data and save it properly
export const createCompleteCase = (caseId: string, basicCaseData: any) => {
  // Prevent duplicate cases by checking if one already exists
  const existingCase = getCaseById(caseId);
  if (existingCase) {
    console.log('Case already exists, updating instead of creating duplicate');
    return updateCaseWithCompleteData(caseId, basicCaseData);
  }

  // Get all form data
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  const sellerInfo = localStorage.getItem('sellerInfo');
  
  let completeCase = { ...basicCaseData };
  
  // Add property form data
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      completeCase.propertyType = parsed.propertyType;
      completeCase.size = parsed.size;
      completeCase.buildYear = parsed.buildYear;
      completeCase.rooms = parsed.rooms;
      completeCase.notes = parsed.notes;
      completeCase.city = parsed.city;
    } catch (error) {
      console.error('Error parsing property data:', error);
    }
  }
  
  // Add sales preferences
  if (salesPreferences) {
    try {
      const parsed = JSON.parse(salesPreferences);
      completeCase.expectedPrice = parsed.expectedPrice?.[0] ? `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : undefined;
      completeCase.expectedPriceValue = parsed.expectedPrice?.[0];
      completeCase.timeframe = parsed.timeframe?.[0];
      completeCase.timeframeType = parsed.timeframeType;
      completeCase.priorities = {
        speed: parsed.prioritySpeed,
        price: parsed.priorityPrice,
        service: parsed.priorityService
      };
      completeCase.specialRequests = parsed.specialRequests;
      completeCase.flexiblePrice = parsed.flexiblePrice;
      completeCase.marketingBudget = parsed.marketingBudget?.[0];
      completeCase.freeIfNotSold = parsed.freeIfNotSold;
    } catch (error) {
      console.error('Error parsing sales preferences:', error);
    }
  }
  
  // Save to both central cases and case-specific storage
  saveCase(completeCase);
  localStorage.setItem(`seller_case_${caseId}`, JSON.stringify(completeCase));
  
  console.log('Created complete case:', completeCase);
  return completeCase;
};

// Update existing case with complete data
export const updateCaseWithCompleteData = (caseId: string, basicCaseData: any) => {
  const existingCase = getCaseById(caseId);
  if (!existingCase) return null;

  // Get all form data
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  
  let updatedCase = { ...existingCase, ...basicCaseData };
  
  // Add property form data
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      updatedCase.propertyType = parsed.propertyType;
      updatedCase.size = parsed.size;
      updatedCase.buildYear = parsed.buildYear;
      updatedCase.rooms = parsed.rooms;
      updatedCase.notes = parsed.notes;
      updatedCase.city = parsed.city;
    } catch (error) {
      console.error('Error parsing property data:', error);
    }
  }
  
  // Add sales preferences
  if (salesPreferences) {
    try {
      const parsed = JSON.parse(salesPreferences);
      updatedCase.expectedPrice = parsed.expectedPrice?.[0] ? `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : undefined;
      updatedCase.expectedPriceValue = parsed.expectedPrice?.[0];
      updatedCase.timeframe = parsed.timeframe?.[0];
      updatedCase.timeframeType = parsed.timeframeType;
      updatedCase.priorities = {
        speed: parsed.prioritySpeed,
        price: parsed.priorityPrice,
        service: parsed.priorityService
      };
      updatedCase.specialRequests = parsed.specialRequests;
      updatedCase.flexiblePrice = parsed.flexiblePrice;
      updatedCase.marketingBudget = parsed.marketingBudget?.[0];
      updatedCase.freeIfNotSold = parsed.freeIfNotSold;
    } catch (error) {
      console.error('Error parsing sales preferences:', error);
    }
  }
  
  // Save updated case
  saveCase(updatedCase);
  localStorage.setItem(`seller_case_${caseId}`, JSON.stringify(updatedCase));
  
  console.log('Updated complete case:', updatedCase);
  return updatedCase;
};

// Enhanced function to get complete case data including seller inputs
export const getCompleteCaseData = (caseId: string) => {
  // First try to get from central cases storage
  const case_ = getCaseById(caseId);
  if (case_) {
    return case_;
  }

  // Fallback to case-specific storage
  const caseSpecificData = localStorage.getItem(`seller_case_${caseId}`);
  if (caseSpecificData) {
    try {
      return JSON.parse(caseSpecificData);
    } catch (error) {
      console.error('Error parsing case-specific data:', error);
    }
  }

  return null;
};

export const updateCaseStatus = (caseId: string, newStatus: Case['status']) => {
  const cases = getCases();
  const updatedCases = cases.map(c => 
    c.id === caseId ? { ...c, status: newStatus } : c
  );
  localStorage.setItem('cases', JSON.stringify(updatedCases));
};

export const getCaseById = (id: string): Case | null => {
  const cases = getCases();
  return cases.find(c => c.id === id) || null;
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
