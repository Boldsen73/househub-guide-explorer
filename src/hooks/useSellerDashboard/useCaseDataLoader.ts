
import { getCasesForUser, getAllCases } from '@/utils/caseStorageManager';

export const useCaseDataLoader = () => {
  const loadAllUserCases = (userId: string) => {
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
    return uniqueCases;
  };

  return { loadAllUserCases };
};
