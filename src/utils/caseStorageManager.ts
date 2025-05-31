
// Centralized case storage manager for consistent data handling
import { Case } from '@/types/user';

// Get all cases from localStorage
export const getAllCases = (): Case[] => {
  try {
    const cases = localStorage.getItem('cases');
    const parsedCases = cases ? JSON.parse(cases) : [];
    console.log('getAllCases returning:', parsedCases.length, 'cases:', parsedCases);
    return parsedCases;
  } catch (error) {
    console.error('Error getting cases:', error);
    return [];
  }
};

// Save a case and ensure all systems are notified
export const saveCaseToStorage = (case_: Case): void => {
  try {
    console.log('=== SAVING CASE TO STORAGE ===');
    console.log('Case being saved:', case_);
    
    // Get existing cases
    const existingCases = getAllCases();
    console.log('Existing cases before save:', existingCases.length, existingCases);
    
    // Find if case already exists
    const existingIndex = existingCases.findIndex(c => c.id === case_.id);
    
    let updatedCases;
    if (existingIndex >= 0) {
      // Update existing case
      existingCases[existingIndex] = case_;
      updatedCases = existingCases;
      console.log('Updated existing case at index:', existingIndex);
    } else {
      // Add new case
      updatedCases = [...existingCases, case_];
      console.log('Added new case. Total cases now:', updatedCases.length);
    }
    
    // Save to localStorage
    localStorage.setItem('cases', JSON.stringify(updatedCases));
    console.log('Cases saved to localStorage. Updated cases:', updatedCases);
    
    // Also save individual case for backup
    localStorage.setItem(`seller_case_${case_.id}`, JSON.stringify(case_));
    console.log('Individual case backup saved for:', case_.id);
    
    // Verify the save worked
    const verification = localStorage.getItem('cases');
    const verifiedCases = verification ? JSON.parse(verification) : [];
    console.log('VERIFICATION: Cases in localStorage after save:', verifiedCases.length, verifiedCases);
    
    // Dispatch comprehensive events
    dispatchCaseEvents(case_, updatedCases);
    
    console.log('=== CASE SAVE COMPLETE ===');
    
  } catch (error) {
    console.error('Error saving case:', error);
  }
};

// Dispatch all necessary events for case updates
const dispatchCaseEvents = (case_: Case, allCases: Case[]): void => {
  console.log('=== DISPATCHING EVENTS ===');
  console.log('Dispatching events for case:', case_.id);
  console.log('Total cases for events:', allCases.length);
  
  // Force a small delay to ensure localStorage write is complete
  setTimeout(() => {
    // Custom events for specific listeners
    window.dispatchEvent(new CustomEvent('caseCreated', { detail: case_ }));
    window.dispatchEvent(new CustomEvent('caseUpdated', { detail: case_ }));
    window.dispatchEvent(new CustomEvent('casesChanged', { detail: { case: case_, allCases } }));
    
    // Storage event to trigger other listeners
    window.dispatchEvent(new Event('storage'));
    
    // Force dashboard refresh
    window.dispatchEvent(new CustomEvent('forceDashboardRefresh', { detail: case_ }));
    
    console.log('All case events dispatched for:', case_.id);
    console.log('=== EVENTS DISPATCH COMPLETE ===');
  }, 50);
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
  console.log('=== CREATING COMPLETE CASE ===');
  console.log('Case ID:', caseId);
  console.log('Basic case data:', basicCaseData);
  
  // Get all form data from localStorage
  const propertyData = localStorage.getItem('propertyForm');
  const salesPreferences = localStorage.getItem('salePreferences');
  
  console.log('Property form data:', propertyData);
  console.log('Sales preferences data:', salesPreferences);
  
  let completeCase = { ...basicCaseData };
  
  // Add property form data if available
  if (propertyData) {
    try {
      const parsed = JSON.parse(propertyData);
      console.log('Parsed property data:', parsed);
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
      console.log('Parsed sales preferences:', parsed);
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
  
  console.log('Complete case before save:', completeCase);
  
  // Save the complete case
  saveCaseToStorage(completeCase);
  
  console.log('=== COMPLETE CASE CREATION FINISHED ===');
  return completeCase;
};
