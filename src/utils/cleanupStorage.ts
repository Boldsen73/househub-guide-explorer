// Utility to clean up storage for fresh start
export const cleanupStorageForFreshStart = () => {
  console.log('Cleaning up storage for fresh start...');
  
  // Remove any test cases or false data
  localStorage.removeItem('cases');
  localStorage.removeItem('test_cases');
  
  // Clear agent-specific state that might contain false data
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('agent_') ||
      key.startsWith('case_') ||
      key.startsWith('showing_registrations_') ||
      key.startsWith('agentCaseStates')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('Removed storage key:', key);
  });
  
  // Initialize clean empty arrays
  localStorage.setItem('cases', JSON.stringify([]));
  localStorage.setItem('test_cases', JSON.stringify([]));
  
  console.log('Storage cleanup completed');
};

// Function to run on app initialization for clean environment
export const initializeCleanEnvironment = () => {
  const currentUser = localStorage.getItem('currentUser');
  
  // Only cleanup if no current user session (fresh start)
  if (!currentUser) {
    cleanupStorageForFreshStart();
  }
};