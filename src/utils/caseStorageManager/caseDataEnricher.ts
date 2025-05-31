
import { Case } from '@/types/case';

export const enrichCaseWithFormData = (caseId: string, basicCaseData: any): Case => {
  console.log('=== ENRICHING CASE WITH FORM DATA ===');
  console.log('Case ID:', caseId);
  console.log('Basic case data:', basicCaseData);
  
  if (!basicCaseData.sellerId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    basicCaseData.sellerId = currentUser.id;
    console.log('Added sellerId from currentUser:', basicCaseData.sellerId);
  }
  
  basicCaseData.id = caseId;
  
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
        propertyType: parsed.propertyType || completeCase.type,
        type: parsed.propertyType || completeCase.type,
        size: parsed.size || completeCase.size,
        buildYear: parsed.buildYear || completeCase.buildYear,
        constructionYear: parsed.buildYear || completeCase.constructionYear,
        rooms: parsed.rooms || completeCase.rooms,
        notes: parsed.notes || completeCase.notes,
        description: parsed.notes || parsed.description || completeCase.description,
        city: parsed.city || completeCase.municipality,
        municipality: parsed.city || completeCase.municipality
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
      
      let expectedPrice = completeCase.price;
      let expectedPriceValue = completeCase.priceValue;
      
      if (parsed.expectedPrice && Array.isArray(parsed.expectedPrice) && parsed.expectedPrice[0]) {
        expectedPriceValue = parsed.expectedPrice[0];
        expectedPrice = `${(parsed.expectedPrice[0] / 1000000).toFixed(1)} mio. kr`;
      }
      
      completeCase = {
        ...completeCase,
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
  
  // Ensure essential fields have values
  completeCase.rooms = completeCase.rooms || 'Ikke angivet';
  completeCase.size = completeCase.size || 'Ikke angivet';
  completeCase.price = completeCase.price || completeCase.expectedPrice || 'Ikke angivet';
  completeCase.type = completeCase.type || completeCase.propertyType || 'Ikke angivet';
  completeCase.status = completeCase.status || 'waiting_for_offers';
  completeCase.energyLabel = completeCase.energyLabel || 'C';
  completeCase.description = completeCase.description || `${completeCase.type} i ${completeCase.municipality}`;
  
  console.log('Complete enriched case:', completeCase);
  return completeCase;
};
