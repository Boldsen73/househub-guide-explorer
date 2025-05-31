
import { getCasesForUser, getAllCases } from '@/utils/caseStorageManager';

export const useCaseDataLoader = () => {
  const loadAllUserCases = (userId: string) => {
    console.log('=== LOADING ALL USER CASES ===');
    console.log('Loading cases for user ID:', userId);
    
    // Get ALL cases from multiple sources
    const allCases = getAllCases();
    console.log('Cases from central storage:', allCases.length);
    
    const userSpecificCases = getCasesForUser(userId);
    console.log('User specific cases:', userSpecificCases.length);
    
    // Also check seller-specific cases in localStorage
    const sellerSpecificCases = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seller_case_')) {
        try {
          const caseData = JSON.parse(localStorage.getItem(key) || '{}');
          if (caseData && caseData.sellerId === userId) {
            const caseId = key.replace('seller_case_', '');
            const caseStatus = localStorage.getItem(`seller_case_status_${caseId}`) || 'active';
            
            // Enhanced form data loading for each case
            const propertyForm = localStorage.getItem('propertyForm') || 
                               localStorage.getItem(`propertyForm_${caseId}`);
            const salePreferences = localStorage.getItem('salePreferences') || 
                                  localStorage.getItem(`salePreferences_${caseId}`);
            
            console.log(`Loading form data for case ${caseId}:`, {
              propertyForm: !!propertyForm,
              salePreferences: !!salePreferences
            });
            
            // Parse and merge form data
            let enrichedCase = { ...caseData };
            
            if (propertyForm) {
              try {
                const parsed = JSON.parse(propertyForm);
                enrichedCase = {
                  ...enrichedCase,
                  propertyType: parsed.propertyType || enrichedCase.type,
                  type: parsed.propertyType || enrichedCase.type,
                  size: parsed.size ? `${parsed.size} m²` : enrichedCase.size,
                  buildYear: parsed.buildYear || enrichedCase.buildYear,
                  constructionYear: parsed.buildYear || enrichedCase.constructionYear,
                  rooms: parsed.rooms || enrichedCase.rooms,
                  notes: parsed.notes || enrichedCase.notes,
                  description: parsed.notes || parsed.description || enrichedCase.description,
                  city: parsed.city || enrichedCase.municipality,
                  municipality: parsed.city || enrichedCase.municipality,
                  address: enrichedCase.address || `${parsed.address || 'Ukendt adresse'}, ${parsed.city || ''}`
                };
              } catch (error) {
                console.error('Error parsing property form:', error);
              }
            }
            
            if (salePreferences) {
              try {
                const parsed = JSON.parse(salePreferences);
                let expectedPrice = enrichedCase.price;
                let expectedPriceValue = enrichedCase.priceValue;
                
                if (parsed.expectedPrice && Array.isArray(parsed.expectedPrice) && parsed.expectedPrice[0]) {
                  expectedPriceValue = parsed.expectedPrice[0];
                  expectedPrice = `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr`;
                }
                
                enrichedCase = {
                  ...enrichedCase,
                  expectedPrice: expectedPrice,
                  price: expectedPrice,
                  expectedPriceValue: expectedPriceValue,
                  priceValue: expectedPriceValue,
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
            
            // Check for showing data
            const showingDataKey = `showing_data_${userId}`;
            const showingData = localStorage.getItem(showingDataKey);
            if (showingData) {
              try {
                const parsedShowing = JSON.parse(showingData);
                enrichedCase = {
                  ...enrichedCase,
                  showingDate: parsedShowing.date,
                  showingTime: parsedShowing.time,
                  showingNotes: parsedShowing.notes,
                  showingStatus: parsedShowing.status || 'planlagt'
                };
              } catch (error) {
                console.error('Error parsing showing data:', error);
              }
            }
            
            // Ensure essential fields have values
            enrichedCase.rooms = enrichedCase.rooms || 'Ikke angivet';
            enrichedCase.size = enrichedCase.size || 'Ikke angivet';
            enrichedCase.price = enrichedCase.price || enrichedCase.expectedPrice || 'Ikke angivet';
            enrichedCase.type = enrichedCase.type || enrichedCase.propertyType || 'Ikke angivet';
            enrichedCase.status = caseStatus;
            enrichedCase.id = caseId;
            enrichedCase.energyLabel = enrichedCase.energyLabel || 'C';
            enrichedCase.description = enrichedCase.description || `${enrichedCase.type} i ${enrichedCase.municipality}`;
            
            sellerSpecificCases.push(enrichedCase);
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
    
    console.log('=== FINAL COMBINED UNIQUE CASES ===');
    console.log('Combined unique cases:', uniqueCases.length);
    uniqueCases.forEach(case_ => {
      console.log(`Case ${case_.id}:`, {
        address: case_.address,
        type: case_.type,
        size: case_.size,
        price: case_.price,
        rooms: case_.rooms,
        showingDate: case_.showingDate,
        showingTime: case_.showingTime
      });
    });
    
    return uniqueCases;
  };

  return { loadAllUserCases };
};
