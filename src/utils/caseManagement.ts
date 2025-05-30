
import { Case } from '@/types/user';

export const getCases = (): Case[] => {
  const cases = localStorage.getItem('cases');
  return cases ? JSON.parse(cases) : [];
};

// Get cases for specific user only
export const getCasesForUser = (userId: string): Case[] => {
  const allCases = getCases();
  return allCases.filter(case_ => case_.sellerId === userId);
};

export const saveCase = (case_: Case) => {
  const cases = getCases();
  const existingIndex = cases.findIndex(c => c.id === case_.id);
  
  if (existingIndex >= 0) {
    cases[existingIndex] = case_;
  } else {
    cases.push(case_);
  }
  
  localStorage.setItem('cases', JSON.stringify(cases));
};

export const updateCaseStatus = (caseId: string, newStatus: Case['status']) => {
  const cases = getCases();
  const updatedCases = cases.map(c => 
    c.id === caseId ? { ...c, status: newStatus } : c
  );
  localStorage.setItem('cases', JSON.stringify(updatedCases));
};

export const getCaseById = (id: string): Case | null => {
  const cases = getCases();
  return cases.find(c => c.id === id) || null;
};

export const getCaseBySagsnummer = (sagsnummer: string): Case | null => {
  const cases = getCases();
  return cases.find(c => c.sagsnummer === sagsnummer) || null;
};

export const generateSagsnummer = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HH-${year}-${timestamp}${random}`;
};
