
import { useState, useEffect } from 'react';
import { getCasesForUser, getAllCases } from '@/utils/caseStorageManager';
import { getDisplayName } from '@/utils/userNameUtils';

interface DashboardCase {
  id: string;
  address: string;
  municipality: string;
  type: string;
  size: string;
  price: string;
  buildYear: number;
  status: string;
  sellerId: string;
  sagsnummer: string;
  // Enhanced fields
  propertyType?: string;
  expectedPrice?: string;
  expectedPriceValue?: number;
  timeframe?: number;
  timeframeType?: string;
  priorities?: {
    speed: boolean;
    price: boolean;
    service: boolean;
  };
  specialRequests?: string;
  notes?: string;
  rooms?: string;
  flexiblePrice?: boolean;
  marketingBudget?: number;
  freeIfNotSold?: boolean;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  type?: string;
}

export const useSellerDashboard = () => {
  const [userCases, setUserCases] = useState<DashboardCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getUserDisplayName = (user: User | null): string => {
    return getDisplayName(user);
  };

  // Helper function to get all form data for a specific case
  const getCaseFormData = (caseId: string) => {
    console.log('Getting form data for case:', caseId);
    
    // Try to get case-specific form data first
    const caseSpecificPropertyForm = localStorage.getItem(`propertyForm_${caseId}`);
    const caseSpecificSalePreferences = localStorage.getItem(`salePreferences_${caseId}`);
    
    // Fall back to global form data
    const globalPropertyForm = localStorage.getItem('propertyForm');
    const globalSalePreferences = localStorage.getItem('salePreferences');
    
    const propertyFormData = caseSpecificPropertyForm || globalPropertyForm;
    const salePreferencesData = caseSpecificSalePreferences || globalSalePreferences;
    
    console.log('Property form data found:', propertyFormData);
    console.log('Sale preferences data found:', salePreferencesData);
    
    return {
      propertyForm: propertyFormData,
      salePreferences: salePreferencesData
    };
  };

  // Helper function to merge all form data for a case
  const enrichCaseWithFormData = (caseData: any, caseId: string): DashboardCase => {
    console.log('Enriching case with form data:', caseId, caseData);
    
    const { propertyForm, salePreferences } = getCaseFormData(caseId);
    
    let enrichedCase = { ...caseData };
    
    // Add property form data
    if (propertyForm) {
      try {
        const parsed = JSON.parse(propertyForm);
        console.log('Parsed property form:', parsed);
        
        enrichedCase = {
          ...enrichedCase,
          propertyType: parsed.propertyType || enrichedCase.propertyType || enrichedCase.type,
          type: parsed.propertyType || enrichedCase.type || 'Ikke angivet',
          size: parsed.size ? `${parsed.size} m²` : (enrichedCase.size || 'Ikke angivet'),
          buildYear: parsed.buildYear || enrichedCase.buildYear || new Date().getFullYear(),
          rooms: parsed.rooms || enrichedCase.rooms || 'Ikke angivet',
          municipality: parsed.city || enrichedCase.municipality || 'Ikke angivet',
          notes: parsed.notes || enrichedCase.notes || enrichedCase.specialRequests || ''
        };
      } catch (error) {
        console.error('Error parsing property form:', error);
      }
    }
    
    // Add sales preferences
    if (salePreferences) {
      try {
        const parsed = JSON.parse(salePreferences);
        console.log('Parsed sale preferences:', parsed);
        
        let expectedPrice = enrichedCase.expectedPrice || enrichedCase.price;
        let expectedPriceValue = enrichedCase.expectedPriceValue;
        
        if (parsed.expectedPrice && Array.isArray(parsed.expectedPrice) && parsed.expectedPrice[0]) {
          expectedPriceValue = parsed.expectedPrice[0];
          expectedPrice = `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr`;
        }
        
        enrichedCase = {
          ...enrichedCase,
          expectedPrice: expectedPrice,
          price: expectedPrice,
          expectedPriceValue: expectedPriceValue,
          timeframe: parsed.timeframe?.[0],
          timeframeType: parsed.timeframeType,
          priorities: {
            speed: parsed.prioritySpeed || false,
            price: parsed.priorityPrice || false,
            service: parsed.priorityService || false
          },
          specialRequests: parsed.specialRequests || enrichedCase.notes || '',
          flexiblePrice: parsed.flexiblePrice,
          marketingBudget: parsed.marketingBudget?.[0],
          freeIfNotSold: parsed.freeIfNotSold
        };
      } catch (error) {
        console.error('Error parsing sales preferences:', error);
      }
    }
    
    // Also check for case-specific stored data
    const caseSpecificData = localStorage.getItem(`seller_case_${caseId}`);
    if (caseSpecificData) {
      try {
        const parsedCaseData = JSON.parse(caseSpecificData);
        console.log('Found case-specific data:', parsedCaseData);
        
        // Merge case-specific data
        enrichedCase = {
          ...enrichedCase,
          ...parsedCaseData,
          // Preserve our enriched data
          propertyType: enrichedCase.propertyType || parsedCaseData.propertyType,
          rooms: enrichedCase.rooms || parsedCaseData.rooms,
          notes: enrichedCase.notes || parsedCaseData.notes,
          specialRequests: enrichedCase.specialRequests || parsedCaseData.specialRequests
        };
      } catch (error) {
        console.error('Error parsing case-specific data:', error);
      }
    }
    
    // Ensure all required fields have values
    const finalCase: DashboardCase = {
      id: typeof enrichedCase.id === 'string' ? enrichedCase.id : enrichedCase.id.toString(),
      address: enrichedCase.address || 'Ingen adresse',
      municipality: enrichedCase.municipality || 'Ikke angivet',
      type: enrichedCase.propertyType || enrichedCase.type || 'Ikke angivet',
      size: enrichedCase.size || 'Ikke angivet',
      price: enrichedCase.expectedPrice || enrichedCase.price || 'Ikke angivet',
      buildYear: enrichedCase.buildYear || enrichedCase.constructionYear || new Date().getFullYear(),
      status: enrichedCase.status || 'active',
      sellerId: enrichedCase.sellerId || '',
      sagsnummer: enrichedCase.sagsnummer || `SAG-${caseId.substring(0, 6).toUpperCase()}`,
      propertyType: enrichedCase.propertyType,
      expectedPrice: enrichedCase.expectedPrice,
      expectedPriceValue: enrichedCase.expectedPriceValue,
      timeframe: enrichedCase.timeframe,
      timeframeType: enrichedCase.timeframeType,
      priorities: enrichedCase.priorities,
      specialRequests: enrichedCase.specialRequests,
      notes: enrichedCase.notes,
      rooms: enrichedCase.rooms || 'Ikke angivet',
      flexiblePrice: enrichedCase.flexiblePrice,
      marketingBudget: enrichedCase.marketingBudget,
      freeIfNotSold: enrichedCase.freeIfNotSold
    };
    
    console.log('Final enriched case:', finalCase);
    return finalCase;
  };

  const loadUserCases = () => {
    console.log('=== LOADING USER CASES IN DASHBOARD ===');
    setIsLoading(true);
    
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (!savedUser) {
        console.log('No current user found in localStorage');
        setCurrentUser(null);
        setUserCases([]);
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);
      console.log('Current user loaded in dashboard:', user);
      setCurrentUser(user);

      if (!user.id) {
        console.log('No user ID found');
        setUserCases([]);
        setIsLoading(false);
        return;
      }

      console.log('Loading cases for user ID:', user.id);
      
      // Get ALL cases from multiple sources
      const allCases = getAllCases();
      console.log('Cases from central storage:', allCases.length);
      
      const userSpecificCases = getCasesForUser(user.id);
      console.log('User specific cases:', userSpecificCases.length);
      
      // Also check seller-specific cases in localStorage
      const sellerSpecificCases = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('seller_case_')) {
          try {
            const caseData = JSON.parse(localStorage.getItem(key) || '{}');
            if (caseData && caseData.sellerId === user.id) {
              const caseId = key.replace('seller_case_', '');
              const caseStatus = localStorage.getItem(`seller_case_status_${caseId}`) || 'active';
              
              sellerSpecificCases.push({
                ...caseData,
                id: caseId,
                status: caseStatus
              });
            }
          } catch (error) {
            console.error('Error parsing seller case:', error);
          }
        }
      }
      
      console.log('Seller specific cases found:', sellerSpecificCases);
      
      // Combine all sources of cases
      const allUserCases = [...userSpecificCases, ...sellerSpecificCases];
      
      // Remove duplicates based on ID
      const uniqueCases = allUserCases.filter((case_, index, array) => 
        array.findIndex(c => c.id === case_.id) === index
      );
      
      console.log('Combined unique cases:', uniqueCases);
      
      // Process each case and enrich with form data
      const processedCases: DashboardCase[] = uniqueCases.map(case_ => {
        console.log('Processing case for dashboard:', case_.id, case_);
        const caseId = typeof case_.id === 'string' ? case_.id : case_.id.toString();
        return enrichCaseWithFormData(case_, caseId);
      });
      
      console.log('Final processed cases for dashboard:', processedCases.length, processedCases);
      setUserCases(processedCases);
      
    } catch (error) {
      console.error('Error loading user cases:', error);
      setCurrentUser(null);
      setUserCases([]);
    } finally {
      setIsLoading(false);
      console.log('=== FINISHED LOADING USER CASES IN DASHBOARD ===');
    }
  };

  useEffect(() => {
    console.log('=== useSellerDashboard useEffect triggered ===');
    
    // Initial load
    loadUserCases();

    // Event listeners for real-time updates
    const handleCaseEvent = (event?: Event) => {
      console.log('=== CASE EVENT DETECTED IN DASHBOARD ===');
      console.log('Event type:', event?.type);
      
      // Reload cases when events are detected
      setTimeout(() => {
        console.log('Reloading dashboard cases after event');
        loadUserCases();
      }, 100);
    };

    const handleStorageChange = (event: StorageEvent) => {
      console.log('=== STORAGE EVENT DETECTED IN DASHBOARD ===');
      console.log('Storage key changed:', event.key);
      
      if (event.key === 'cases' || event.key?.startsWith('seller_case_') || event.key === 'propertyForm' || event.key === 'salePreferences') {
        console.log('Relevant storage changed, reloading dashboard');
        setTimeout(() => loadUserCases(), 100);
      }
    };

    // Listen for all possible case update events
    window.addEventListener('caseCreated', handleCaseEvent);
    window.addEventListener('caseUpdated', handleCaseEvent);
    window.addEventListener('casesChanged', handleCaseEvent);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      console.log('=== CLEANING UP DASHBOARD LISTENERS ===');
      window.removeEventListener('caseCreated', handleCaseEvent);
      window.removeEventListener('caseUpdated', handleCaseEvent);
      window.removeEventListener('casesChanged', handleCaseEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    userCases,
    isLoading,
    currentUser,
    getUserDisplayName,
    refreshCases: loadUserCases
  };
};
