
import { Case } from '@/types/case';

export const getAllCases = (): Case[] => {
  try {
    // Get cases from central storage
    const centralCases = localStorage.getItem('cases');
    const parsedCentralCases = centralCases ? JSON.parse(centralCases) : [];
    
    // Get cases from seller-specific storage
    const sellerCases = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seller_case_')) {
        try {
          const caseData = JSON.parse(localStorage.getItem(key) || '{}');
          if (caseData && caseData.address && caseData.sellerId) {
            const caseId = key.replace('seller_case_', '');
            
            // Enrich with form data for complete case information
            const propertyForm = localStorage.getItem('propertyData') || localStorage.getItem(`propertyData_${caseId}`);
            const salePreferences = localStorage.getItem('salePreferencesForm') || localStorage.getItem(`salePreferencesForm_${caseId}`);
            
            let enrichedCase = { ...caseData };
            
            // Add property form data
            if (propertyForm) {
              try {
                const parsed = JSON.parse(propertyForm);
                enrichedCase = {
                  ...enrichedCase,
                  propertyType: parsed.propertyType || enrichedCase.type,
                  type: parsed.propertyType || enrichedCase.type,
                  size: parsed.size ? `${parsed.size} m²` : enrichedCase.size,
                  buildYear: parsed.buildYear || enrichedCase.buildYear,
                  rooms: parsed.rooms || enrichedCase.rooms,
                  notes: parsed.notes || enrichedCase.notes,
                  municipality: parsed.city || enrichedCase.municipality,
                  address: enrichedCase.address || `${parsed.address || 'Ukendt adresse'}, ${parsed.city || ''}`
                };
              } catch (error) {
                console.error('Error parsing property form in getAllCases:', error);
              }
            }
            
            // Add sales preferences
            if (salePreferences) {
              try {
                const parsed = JSON.parse(salePreferences);
                if (parsed.expectedPrice && Array.isArray(parsed.expectedPrice) && parsed.expectedPrice[0]) {
                  enrichedCase.price = `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr`;
                  enrichedCase.priceValue = parsed.expectedPrice[0];
                }
                enrichedCase.timeframe = parsed.timeframe?.[0];
                enrichedCase.timeframeType = parsed.timeframeType;
                enrichedCase.priorities = {
                  speed: parsed.prioritySpeed || false,
                  price: parsed.priorityPrice || false,
                  service: parsed.priorityService || false
                };
                enrichedCase.specialRequests = parsed.specialRequests;
                enrichedCase.flexiblePrice = parsed.flexiblePrice;
                enrichedCase.marketingBudget = parsed.marketingBudget?.[0];
                enrichedCase.freeIfNotSold = parsed.freeIfNotSold;
              } catch (error) {
                console.error('Error parsing sales preferences in getAllCases:', error);
              }
            }
            
            // Ensure essential fields
            enrichedCase.id = caseId;
            enrichedCase.rooms = enrichedCase.rooms || 'Ikke angivet';
            enrichedCase.size = enrichedCase.size || 'Ikke angivet';
            enrichedCase.price = enrichedCase.price || 'Ikke angivet';
            enrichedCase.type = enrichedCase.type || 'Ikke angivet';
            enrichedCase.status = enrichedCase.status || 'active';
            
            sellerCases.push(enrichedCase);
          }
        } catch (error) {
          console.error('Error parsing seller case in getAllCases:', error);
        }
      }
    }
    
    // Combine all cases and remove duplicates
    const allCases = [...Array.isArray(parsedCentralCases) ? parsedCentralCases : [], ...sellerCases];
    
    // Remove duplicates based on ID and filter valid cases
    const uniqueCases = allCases.filter((case_, index, array) => {
      // Only include cases that have a proper sellerId from a real user
      if (!case_.sellerId || !case_.address || !case_.id) return false;
      
      // Check if seller actually exists
      const allUsers = JSON.parse(localStorage.getItem('test_users') || '[]');
      const realUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const seller = [...allUsers, ...realUsers].find(u => u.id === case_.sellerId);
      
      // Check for duplicates
      const firstIndex = array.findIndex(c => c.id === case_.id);
      const isUnique = firstIndex === index;
      
      return seller && isUnique;
    });
    
    console.log('getAllCases found:', uniqueCases.length, 'valid unique cases:', uniqueCases);
    return uniqueCases;
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
