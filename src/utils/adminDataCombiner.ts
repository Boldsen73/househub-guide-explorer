
import { Case } from '@/utils/userData';

export const combineAllCases = (userDataCases: Case[], sellerCases: Case[]): Case[] => {
  // Ensure all cases have required properties and consistent types
  const processedUserDataCases: Case[] = userDataCases.map((c: Case) => ({
    ...c,
    id: typeof c.id === 'string' ? c.id : String(c.id),
    sellerName: c.sellerName || 'Ukendt sælger',
    sellerEmail: c.sellerEmail || 'Ikke angivet',
    sellerPhone: c.sellerPhone || 'Ikke angivet',
    postnummer: c.postnummer || '',
    buildYear: c.buildYear || new Date().getFullYear()
  }));

  // Convert seller cases to proper Case format
  const processedSellerCases: Case[] = sellerCases.map((sc: Case) => ({
    ...sc,
    id: typeof sc.id === 'string' ? sc.id : String(sc.id),
    postnummer: sc.postnummer || '',
    buildYear: sc.buildYear || new Date().getFullYear()
  }));

  // Deduplicate cases by ID - prioritize userDataCases over sellerCases
  const seenIds = new Set<string>();
  const deduplicatedCases: Case[] = [];
  
  // Add userDataCases first (higher priority)
  processedUserDataCases.forEach(case_ => {
    if (!seenIds.has(case_.id)) {
      seenIds.add(case_.id);
      deduplicatedCases.push(case_);
    }
  });
  
  // Add sellerCases only if not already seen
  processedSellerCases.forEach(case_ => {
    if (!seenIds.has(case_.id)) {
      seenIds.add(case_.id);
      deduplicatedCases.push(case_);
    }
  });

  const combinedCases: Case[] = deduplicatedCases;
  
  console.log('Final combined data:', { 
    users: 0, // Will be filled by caller
    cases: combinedCases.length,
    caseBreakdown: {
      active: combinedCases.filter(c => !['archived', 'withdrawn'].includes(c.status)).length,
      archived: combinedCases.filter(c => ['archived', 'withdrawn'].includes(c.status)).length,
      showing_booked: combinedCases.filter(c => c.status === 'showing_booked').length,
      showing_completed: combinedCases.filter(c => c.status === 'showing_completed').length
    }
  });

  return combinedCases;
};

export const logDataBreakdown = (users: any[], cases: Case[]) => {
  console.log('Final combined data:', { 
    users: users.length, 
    cases: cases.length,
    userBreakdown: {
      sellers: users.filter(u => u.role === 'seller').length,
      agents: users.filter(u => u.role === 'agent').length,
      admins: users.filter(u => u.role === 'admin').length
    },
    caseBreakdown: {
      active: cases.filter(c => !['archived', 'withdrawn'].includes(c.status)).length,
      archived: cases.filter(c => ['archived', 'withdrawn'].includes(c.status)).length,
      showing_booked: cases.filter(c => c.status === 'showing_booked').length,
      showing_completed: cases.filter(c => c.status === 'showing_completed').length
    }
  });
};
