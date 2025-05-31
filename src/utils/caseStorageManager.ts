
import { Case } from '@/types/case';
import { getAllCases, saveCaseToStorage, getCasesForUser, getCaseById } from './caseStorageManager/caseStorageUtils';
import { enrichCaseWithFormData } from './caseStorageManager/caseDataEnricher';

// Re-export functions for backward compatibility
export { getAllCases, saveCaseToStorage, getCasesForUser, getCaseById };

// Create complete case with all form data
export const createCompleteCase = (caseId: string, basicCaseData: any): Case => {
  const completeCase = enrichCaseWithFormData(caseId, basicCaseData);
  saveCaseToStorage(completeCase);
  console.log('=== COMPLETE CASE CREATION FINISHED ===');
  return completeCase;
};
