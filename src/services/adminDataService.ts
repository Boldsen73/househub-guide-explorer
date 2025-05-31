
import { getUsers, getCases, User, Case } from '@/utils/userData';

interface ProcessedSellerCase {
  id: string;
  sagsnummer: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  address: string;
  postnummer: string;
  municipality: string;
  type: string;
  size: number;
  buildYear: number;
  price: string;
  priceValue: number;
  status: Case['status'];
  createdAt: string;
  offers: any[];
  showingRegistrations: any[];
  messages: any[];
  rooms: string;
  description: string;
  energyLabel: string;
  constructionYear: number;
  showingDate?: Date;
  showingTime?: string;
  showingNotes?: string;
}

export const loadUsersData = (): User[] => {
  console.log('Loading users from userData system');
  const allUsers = getUsers();
  console.log('Loaded users:', allUsers);
  return allUsers;
};

export const loadCasesData = (): Case[] => {
  console.log('Loading cases from userData system');
  const allCases = getCases();
  console.log('Loaded cases from userData:', allCases);
  return allCases;
};

export const loadSellerCasesFromStorage = (allUsers: User[]): Case[] => {
  const sellerCases: Case[] = [];
  const sellerKeys: string[] = [];
  
  // Find all seller case keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('seller_case_')) {
      sellerKeys.push(key);
    }
  }
  
  console.log('Found seller case keys:', sellerKeys);
  
  // Process each seller case
  sellerKeys.forEach(key => {
    try {
      const caseData = JSON.parse(localStorage.getItem(key) || '{}');
      if (caseData && caseData.address) {
        const caseId = key.replace('seller_case_', '');
        let sellerCaseStatus = localStorage.getItem(`seller_case_status_${caseId}`) || 'active';
        
        // Check for showing data to update status
        const showingData = localStorage.getItem(`case_${caseId}_showing`);
        if (showingData) {
          const parsedShowing = JSON.parse(showingData);
          if (parsedShowing.status) {
            sellerCaseStatus = parsedShowing.status;
          }
        }
        
        // Only include if not withdrawn or deleted
        if (sellerCaseStatus !== 'withdrawn' && sellerCaseStatus !== 'deleted') {
          // Get seller information with better fallback
          let sellerInfo = { 
            name: 'Ukendt sælger', 
            email: 'Ikke angivet', 
            phone: 'Ikke angivet' 
          };
          
          if (caseData.sellerId) {
            const seller = allUsers.find(u => u.id === caseData.sellerId);
            if (seller) {
              sellerInfo = {
                name: seller.name || 'Ukendt sælger',
                email: seller.email || 'Ikke angivet',
                phone: seller.phone || 'Ikke angivet'
              };
            }
          }

          const processedCase: Case = {
            id: caseId,
            sagsnummer: caseData.sagsnummer || `SAG-${caseId.slice(-6)}`,
            sellerId: caseData.sellerId || 'unknown',
            sellerName: sellerInfo.name,
            sellerEmail: sellerInfo.email,
            sellerPhone: sellerInfo.phone,
            address: caseData.address,
            postnummer: caseData.postnummer || '',
            municipality: caseData.municipality || caseData.city || 'Ikke angivet',
            type: caseData.propertyType || caseData.type || 'Ikke angivet',
            size: typeof caseData.size === 'number' ? caseData.size : parseInt(caseData.size || '0'),
            buildYear: caseData.buildYear || new Date().getFullYear(),
            price: caseData.estimatedPrice || 'Ikke angivet',
            priceValue: parseInt(caseData.estimatedPrice?.replace(/[^\d]/g, '') || '0'),
            status: sellerCaseStatus as Case['status'],
            createdAt: caseData.createdAt || new Date().toISOString(),
            offers: [],
            showingRegistrations: [],
            messages: [],
            rooms: caseData.rooms || "Ikke angivet",
            description: caseData.notes || caseData.comments || `${caseData.propertyType || 'Bolig'} i ${caseData.municipality || caseData.city || 'Danmark'}`,
            energyLabel: caseData.energyLabel || "Ikke angivet",
            constructionYear: caseData.buildYear || new Date().getFullYear()
          };

          // Add showing information if available
          if (showingData) {
            const parsedShowing = JSON.parse(showingData);
            processedCase.showingDate = new Date(parsedShowing.showingDate);
            processedCase.showingTime = parsedShowing.showingTime;
            processedCase.showingNotes = parsedShowing.showingNotes;
          }

          sellerCases.push(processedCase);
        }
      }
    } catch (error) {
      console.error(`Error parsing seller case ${key}:`, error);
    }
  });
  
  console.log('Processed seller cases:', sellerCases);
  return sellerCases;
};
