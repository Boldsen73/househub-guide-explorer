// Utility to clean up duplicate users

export const cleanupDuplicateUsers = () => {
  console.log('=== CLEANING UP DUPLICATE USERS ===');

  // Clean up test_users
  const testUsers = JSON.parse(localStorage.getItem('test_users') || '[]');
  const uniqueTestUsers: any[] = [];
  const seenEmails = new Set<string>();

  testUsers.forEach((user: any) => {
    const emailLower = user.email.toLowerCase();
    if (!seenEmails.has(emailLower)) {
      seenEmails.add(emailLower);
      uniqueTestUsers.push(user);
    } else {
      console.log('Removing duplicate test user:', user.email);
    }
  });

  localStorage.setItem('test_users', JSON.stringify(uniqueTestUsers));
  console.log(`Test users: reduced from ${testUsers.length} to ${uniqueTestUsers.length}`);

  // Clean up regular users
  const regularUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const uniqueRegularUsers: any[] = [];
  const seenRegularEmails = new Set<string>();

  regularUsers.forEach((user: any) => {
    const emailLower = user.email.toLowerCase();
    if (!seenRegularEmails.has(emailLower)) {
      seenRegularEmails.add(emailLower);
      uniqueRegularUsers.push(user);
    } else {
      console.log('Removing duplicate regular user:', user.email);
    }
  });

  localStorage.setItem('users', JSON.stringify(uniqueRegularUsers));
  console.log(`Regular users: reduced from ${regularUsers.length} to ${uniqueRegularUsers.length}`);
  
  console.log('=== CLEANUP COMPLETE ===');
};