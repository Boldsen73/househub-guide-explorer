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
  showingDate?: Date;
  showingTime?: string;
  showingNotes?: string;
  showingStatus?: string;
}

export const useCaseFormDataEnricher = () => {
  const getCaseFormData = (caseId: string) => {
    console.log('Getting form data for case:', caseId);
    
    // Try multiple sources for form data
    const sources = [
      `propertyForm_${caseId}`,
      'propertyForm',
      `salePreferences_${caseId}`,
      'salePreferences'
    ];
    
    let propertyFormData = null;
    let salePreferencesData = null;
    
    for (const key of sources) {
      const data = localStorage.getItem(key);
      if (data) {
        if (key.includes('propertyForm')) {
          propertyFormData = data;
        } else if (key.includes('salePreferences')) {
          salePreferencesData = data;
        }
      }
    }
    
    console.log('Property form data found:', propertyFormData);
    console.log('Sale preferences data found:', salePreferencesData);
    
    return {
      propertyForm: propertyFormData,
      salePreferences: salePreferencesData
    };
  };

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
          notes: parsed.notes || enrichedCase.notes || enrichedCase.specialRequests || '',
          address: enrichedCase.address || `${parsed.address || 'Ukendt adresse'}, ${parsed.city || ''}`
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
    
    // Also check for case-specific stored data in multiple locations
    const caseKeys = [
      `seller_case_${caseId}`,
      `case_${caseId}_showing`,
      `showing_data_${enrichedCase.sellerId}`
    ];
    
    for (const key of caseKeys) {
      const caseSpecificData = localStorage.getItem(key);
      if (caseSpecificData) {
        try {
          const parsedCaseData = JSON.parse(caseSpecificData);
          console.log(`Found data in ${key}:`, parsedCaseData);
          
          // Merge showing data if present
          if (parsedCaseData.showingDate || parsedCaseData.date) {
            enrichedCase.showingDate = parsedCaseData.showingDate || parsedCaseData.date;
            enrichedCase.showingTime = parsedCaseData.showingTime || parsedCaseData.time;
            enrichedCase.showingNotes = parsedCaseData.showingNotes || parsedCaseData.notes;
            enrichedCase.showingStatus = parsedCaseData.showingStatus || parsedCaseData.status;
          }
          
          // Merge other case data
          enrichedCase = {
            ...enrichedCase,
            ...parsedCaseData,
            // Keep enriched data priority over stored data for these fields
            propertyType: enrichedCase.propertyType || parsedCaseData.propertyType,
            rooms: enrichedCase.rooms || parsedCaseData.rooms,
            notes: enrichedCase.notes || parsedCaseData.notes,
            specialRequests: enrichedCase.specialRequests || parsedCaseData.specialRequests,
            price: enrichedCase.price || parsedCaseData.price || parsedCaseData.expectedPrice,
            expectedPrice: enrichedCase.expectedPrice || parsedCaseData.expectedPrice
          };
        } catch (error) {
          console.error(`Error parsing data from ${key}:`, error);
        }
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
      freeIfNotSold: enrichedCase.freeIfNotSold,
      showingDate: enrichedCase.showingDate,
      showingTime: enrichedCase.showingTime,
      showingNotes: enrichedCase.showingNotes,
      showingStatus: enrichedCase.showingStatus
    };
    
    console.log('Final enriched case:', finalCase);
    return finalCase;
  };

  return { enrichCaseWithFormData };
};
