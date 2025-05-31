
// Centralized case storage manager for consistent data handling
import { Case } from '@/types/user';

// Get all cases from localStorage
export const getAllCases = (): Case[] => {
  try {
    const cases = localStorage.getItem('cases');
    if (!cases) {
      console.log('No cases found in localStorage, initializing empty array');
      localStorage.setItem('cases', JSON.stringify([]));
      return [];
    }
    const parsedCases = JSON.parse(cases);
    console.log('getAllCases found:', parsedCases.length, 'cases:', parsedCases);
    return Array.isArray(parsedCases) ? parsedCases : [];
  } catch (error) {
    console.error('Error getting cases from localStorage:', error);
    localStorage.setItem('cases', JSON.stringify([]));
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
    console.log('Existing cases before save:', existingCases.length);
    
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
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('cases', JSON.stringify(updatedCases));
      console.log('Cases saved to localStorage successfully');
    } catch (storageError) {
      console.error('Failed to save to localStorage:', storageError);
      throw storageError;
    }
    
    // Also save individual case for backup
    try {
      localStorage.setItem(`seller_case_${case_.id}`, JSON.stringify(case_));
      console.log('Individual case backup saved for:', case_.id);
    } catch (backupError) {
      console.error('Failed to save case backup:', backupError);
    }
    
    // Verify the save worked
    const verification = localStorage.getItem('cases');
    if (verification) {
      const verifiedCases = JSON.parse(verification);
      console.log('VERIFICATION: Cases in localStorage after save:', verifiedCases.length);
      
      if (verifiedCases.length !== updatedCases.length) {
        console.error('Save verification failed! Expected:', updatedCases.length, 'Actual:', verifiedCases.length);
      }
    }
    
    // Dispatch events to notify all listening components
    console.log('Dispatching case update events...');
    window.dispatchEvent(new CustomEvent('caseCreated', { detail: case_ }));
    window.dispatchEvent(new CustomEvent('caseUpdated', { detail: case_ }));
    window.dispatchEvent(new CustomEvent('casesChanged', { detail: { case: case_, allCases: updatedCases } }));
    window.dispatchEvent(new Event('storage'));
    
    console.log('=== CASE SAVE COMPLETE ===');
    
  } catch (error) {
    console.error('Error saving case:', error);
    throw error;
  }
};

// Get cases for a specific user
export const getCasesForUser = (userId: string): Case[] => {
  console.log('getCasesForUser called for userId:', userId);
  const allCases = getAllCases();
  const userCases = allCases.filter(case_ => {
    const matches = case_.sellerId === userId;
    console.log(`Case ${case_.id} sellerId: ${case_.sellerId}, matches user ${userId}: ${matches}`);
    return matches;
  });
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
  
  // Ensure basic required fields are present
  if (!basicCaseData.sellerId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    basicCaseData.sellerId = currentUser.id;
    console.log('Added sellerId from currentUser:', basicCaseData.sellerId);
  }
  
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
