
// Re-export everything for backward compatibility
export * from './caseManagement';
export * from './messageManagement';
export * from './authentication';
export * from './systemInit';

// Export User and Case types
export type { User, Case } from '@/types/user';
export { updateTestUser as updateUser, addTestUser as addUser } from './testData';
export { getUsers } from './userManagement';
