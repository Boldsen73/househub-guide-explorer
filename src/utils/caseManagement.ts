
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

// Enhanced function to get complete case data including seller inputs
export const getCompleteCaseData = (caseId: string) => {
  // Get basic case data
  const case_ = getCaseById(caseId);
  if (!case_) return null;

  // Get additional seller data that was stored separately
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  const sellerInfo = localStorage.getItem('sellerInfo');
  
  // Get case-specific data
  const caseSpecificData = localStorage.getItem(`seller_case_${caseId}`);

  let completeData: any = { ...case_ };

  // Add property form data if it exists
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      completeData.propertyType = parsed.propertyType;
      completeData.size = parsed.size;
      completeData.buildYear = parsed.buildYear;
      completeData.rooms = parsed.rooms;
      completeData.notes = parsed.notes;
      completeData.city = parsed.city;
    } catch (error) {
      console.error('Error parsing property data:', error);
    }
  }

  // Add sales preferences if they exist
  if (salesPreferences) {
    try {
      const parsed = JSON.parse(salesPreferences);
      completeData.expectedPrice = parsed.expectedPrice?.[0] ? `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr` : undefined;
      completeData.expectedPriceValue = parsed.expectedPrice?.[0];
      completeData.timeframe = parsed.timeframe?.[0];
      completeData.timeframeType = parsed.timeframeType;
      completeData.priorities = {
        speed: parsed.prioritySpeed,
        price: parsed.priorityPrice,
        service: parsed.priorityService
      };
      completeData.specialRequests = parsed.specialRequests;
      completeData.flexiblePrice = parsed.flexiblePrice;
      completeData.marketingBudget = parsed.marketingBudget?.[0];
      completeData.freeIfNotSold = parsed.freeIfNotSold;
    } catch (error) {
      console.error('Error parsing sales preferences:', error);
    }
  }

  // Add case-specific data if it exists
  if (caseSpecificData) {
    try {
      const parsed = JSON.parse(caseSpecificData);
      completeData = { ...completeData, ...parsed };
    } catch (error) {
      console.error('Error parsing case-specific data:', error);
    }
  }

  return completeData;
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
