
import { Case } from '@/types/case';

export const getAllCases = (): Case[] => {
  try {
    // Always return empty array for clean environment - no false test cases
    const cases = localStorage.getItem('cases');
    if (!cases) {
      console.log('No cases found in localStorage, initializing empty array');
      localStorage.setItem('cases', JSON.stringify([]));
      return [];
    }
    const parsedCases = JSON.parse(cases);
    
    // Filter out any test cases or invalid cases to ensure clean environment
    const validCases = Array.isArray(parsedCases) ? parsedCases.filter(case_ => {
      // Only include cases that have a proper sellerId from a real user
      if (!case_.sellerId) return false;
      
      // Check if seller actually exists
      const allUsers = JSON.parse(localStorage.getItem('test_users') || '[]');
      const realUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const seller = [...allUsers, ...realUsers].find(u => u.id === case_.sellerId);
      
      return seller && case_.address && case_.id;
    }) : [];
    
    console.log('getAllCases found:', validCases.length, 'valid cases:', validCases);
    return validCases;
  } catch (error) {
    console.error('Error getting cases from localStorage:', error);
    localStorage.setItem('cases', JSON.stringify([]));
    return [];
  }
};

export const saveCaseToStorage = (case_: Case): void => {
  try {
    console.log('=== SAVING CASE TO STORAGE ===');
    console.log('Case being saved:', case_);
    
    if (!case_.id) {
      case_.id = Date.now().toString();
      console.log('Generated new case ID:', case_.id);
    }
    
    const existingCases = getAllCases();
    console.log('Existing cases before save:', existingCases.length);
    
    const existingIndex = existingCases.findIndex(c => c.id === case_.id);
    
    let updatedCases;
    if (existingIndex >= 0) {
      existingCases[existingIndex] = case_;
      updatedCases = existingCases;
      console.log('Updated existing case at index:', existingIndex);
    } else {
      updatedCases = [...existingCases, case_];
      console.log('Added new case. Total cases now:', updatedCases.length);
    }
    
    try {
      localStorage.setItem('cases', JSON.stringify(updatedCases));
      console.log('Cases saved to localStorage successfully');
    } catch (storageError) {
      console.error('Failed to save to localStorage:', storageError);
      throw storageError;
    }
    
    try {
      localStorage.setItem(`seller_case_${case_.id}`, JSON.stringify(case_));
      console.log('Individual case backup saved for:', case_.id);
    } catch (backupError) {
      console.error('Failed to save case backup:', backupError);
    }
    
    const verification = localStorage.getItem('cases');
    if (verification) {
      const verifiedCases = JSON.parse(verification);
      console.log('VERIFICATION: Cases in localStorage after save:', verifiedCases.length);
      
      if (verifiedCases.length !== updatedCases.length) {
        console.error('Save verification failed! Expected:', updatedCases.length, 'Actual:', verifiedCases.length);
      }
    }
    
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

export const getCaseById = (caseId: string): Case | null => {
  const allCases = getAllCases();
  const case_ = allCases.find(c => c.id === caseId) || null;
  console.log(`getCaseById(${caseId}) found:`, case_);
  return case_;
};
