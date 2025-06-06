// Test environment setup and data management - MOCK DATABASE VERSION
export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'seller' | 'agent' | 'admin';
  phone?: string;
  company?: string;
  authorizationNumber?: string;
  primaryRegion?: string;
  specialties?: string[];
  address?: string;
  isActive?: boolean;
}

export interface TestCase {
  id: string;
  sagsnummer: string;
  sellerId: string;
  address: string;
  postnummer: string;
  municipality: string;
  type: string;
  size: number;
  buildYear: number;
  rooms?: string;
  notes?: string;
  expectedPrice?: string;
  expectedPriceValue?: number;
  flexiblePrice?: boolean;
  timeframe?: number;
  timeframeType?: 'weeks' | 'months';
  priorities?: {
    speed: boolean;
    price: boolean;
    service: boolean;
  };
  marketingBudget?: number;
  freeIfNotSold?: boolean;
  specialRequests?: string;
  status: 'draft' | 'active' | 'showing_booked' | 'showing_completed' | 'offers_received' | 'realtor_selected' | 'withdrawn' | 'archived';
  createdAt: string;
  offers: TestOffer[];
  showingRegistrations: TestShowingRegistration[];
  messages: TestMessage[];
  showingDate?: Date;
  showingTime?: string;
  showingNotes?: string;
}

export interface TestOffer {
  id: string;
  caseId: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  expectedPrice: string;
  priceValue: number;
  commission: string;
  commissionValue: number;
  bindingPeriod: string;
  marketingPackage: string;
  salesStrategy: string;
  marketingMethods: Array<{
    id: string;
    name: string;
    cost: number;
    included: boolean;
  }>;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface TestShowingRegistration {
  id: string;
  caseId: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  registeredAt: string;
}

export interface TestMessage {
  id: string;
  caseId: string;
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

// 👥 Realistiske mock-brugere
export const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem('test_users');
  if (existingUsers && JSON.parse(existingUsers).length > 0) return;

  const mockUsers: TestUser[] = [
    {
      id: 'admin-1',
      email: 'admin@hh.dk',
      password: '12345678',
      name: 'Admin',
      role: 'admin',
      isActive: true
    },
    {
      id: 'agent-1',
      email: 'm1@hh.dk',
      password: '12345678',
      name: 'Mads Mægler',
      role: 'agent',
      company: 'TopMæglerne ApS',
      isActive: true
    },
    {
      id: 'agent-2',
      email: 'm2@hh.dk',
      password: '12345678',
      name: 'Tina Tinglytter',
      role: 'agent',
      company: 'BoligEksperten',
      isActive: true
    },
    {
      id: 'seller-1',
      email: 's1@hh.dk',
      password: '12345678',
      name: 'Sanne Sælger',
      role: 'seller',
      address: 'Hovedgaden 1, 8800 Viborg',
      isActive: true
    },
    {
      id: 'seller-2',
      email: 's2@hh.dk',
      password: '12345678',
      name: 'Bent Boligejer',
      role: 'seller',
      address: 'Vestergade 42, 8900 Randers',
      isActive: true
    }
  ];

  localStorage.setItem('test_users', JSON.stringify(mockUsers));
};

// 🧼 Ryd alt og initialiser tomme arrays
export const initializeTestEnvironment = () => {
  localStorage.clear();
  initializeMockUsers();
  localStorage.setItem('test_cases', JSON.stringify([]));
  localStorage.setItem('agent_notifications', JSON.stringify([]));
  localStorage.setItem('case_messages', JSON.stringify([]));
  localStorage.setItem('agentCaseStates', JSON.stringify({}));
  localStorage.setItem('system_audit_log', JSON.stringify([]));
};

// 📥 User-funktioner
export const getTestUsers = (): TestUser[] => {
  const users = localStorage.getItem('test_users');
  return users ? JSON.parse(users) : [];
};

export const addTestUser = (user: TestUser) => {
  const users = getTestUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingUser) throw new Error('Email already exists');
  users.push(user);
  localStorage.setItem('test_users', JSON.stringify(users));
  if (user.role === 'seller' && user.address) {
    localStorage.setItem('seller_address_cache', user.address);
  }
};

export const updateTestUser = (userId: string, updatedData: Partial<TestUser>) => {
  const users = getTestUsers();
  const updatedUsers = users.map(user => user.id === userId ? { ...user, ...updatedData } : user);
  localStorage.setItem('test_users', JSON.stringify(updatedUsers));
  return updatedUsers;
};

export const deactivateTestUser = (userId: string) => {
  return updateTestUser(userId, { isActive: false });
};

export const deleteTestUser = (userId: string) => {
  const users = getTestUsers();
  const updatedUsers = users.filter(user => user.id !== userId);
  localStorage.setItem('test_users', JSON.stringify(updatedUsers));
  const auditLog = JSON.parse(localStorage.getItem('system_audit_log') || '[]');
  auditLog.push({
    action: 'USER_DELETED',
    userId,
    timestamp: new Date().toISOString(),
    adminId: JSON.parse(localStorage.getItem('currentUser') || '{}').id
  });
  localStorage.setItem('system_audit_log', JSON.stringify(auditLog));
  return updatedUsers;
};

// 🔐 Login
export const authenticateTestUser = (email: string, password: string): TestUser | null => {
  const users = getTestUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user && user.isActive !== false) {
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      agencyName: user.company,
      primaryRegion: user.primaryRegion,
      specialties: user.specialties,
      address: user.address
    }));
    return user;
  }
  return null;
};

// 📦 Cases og beskeder
export const getTestCases = (): TestCase[] => {
  return [];
};

export const getTestCasesForUser = (userId: string): TestCase[] => {
  return [];
};

export const saveTestCase = (testCase: TestCase) => {
  const cases = getTestCases();
  const existingIndex = cases.findIndex(c => c.id === testCase.id);
  if (existingIndex > -1) {
    cases[existingIndex] = testCase;
  } else {
    cases.push(testCase);
  }
  localStorage.setItem('test_cases', JSON.stringify(cases));
  console.log('Test case saved:', testCase.sagsnummer);
};

export const updateCaseStatus = (caseId: string, newStatus: TestCase['status']) => {
  const cases = getTestCases();
  const updatedCases = cases.map(c => c.id === caseId ? { ...c, status: newStatus } : c);
  localStorage.setItem('test_cases', JSON.stringify(updatedCases));
  console.log(`Case ${caseId} status updated to ${newStatus}`);
};

export const getTestCaseById = (id: string): TestCase | null => {
  const cases = getTestCases();
  return cases.find(c => c.id === id) || null;
};

export const getTestCaseBySagsnummer = (sagsnummer: string): TestCase | null => {
  const cases = getTestCases();
  return cases.find(c => c.sagsnummer === sagsnummer) || null;
};

export const generateSagsnummer = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HH-${year}-${timestamp}${random}`;
};

// 📨 Beskeder
export const getCaseMessages = (caseId: string, includeArchived: boolean = false): TestMessage[] => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  return messages.filter((msg: TestMessage) => msg.caseId === caseId && (includeArchived || !msg.archived));
};

export const sendMessage = (message: Omit<TestMessage, 'id' | 'timestamp'>) => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  const newMessage: TestMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  localStorage.setItem('case_messages', JSON.stringify(messages));
  return newMessage;
};

export const archiveCaseMessages = (caseId: string) => {
  const messages = JSON.parse(localStorage.getItem('case_messages') || '[]');
  const updatedMessages = messages.map((msg: TestMessage) =>
    msg.caseId === caseId ? { ...msg, archived: true } : msg
  );
  localStorage.setItem('case_messages', JSON.stringify(updatedMessages));
};

// 🔁 Genstart miljøet
export const resetTestEnvironment = () => {
  initializeTestEnvironment();
};

// 🧠 Auto-udfyld
export const getCachedSellerAddress = (): string | null => {
  return localStorage.getItem('seller_address_cache');
};
