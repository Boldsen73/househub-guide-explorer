
import { ADMIN_USER } from '@/types/user';
import { getUsers } from './userManagement';

// Initialize system with admin user only
export const initializeSystem = () => {
  const users = getUsers();
  if (users.length === 0) {
    localStorage.setItem('users', JSON.stringify([ADMIN_USER]));
  }
  
  if (!localStorage.getItem('cases')) {
    localStorage.setItem('cases', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('agent_notifications')) {
    localStorage.setItem('agent_notifications', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('case_messages')) {
    localStorage.setItem('case_messages', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('agentCaseStates')) {
    localStorage.setItem('agentCaseStates', JSON.stringify({}));
  }
  
  if (!localStorage.getItem('system_audit_log')) {
    localStorage.setItem('system_audit_log', JSON.stringify([]));
  }
};

// Reset system completely
export const resetSystem = () => {
  localStorage.clear();
  initializeSystem();
};
