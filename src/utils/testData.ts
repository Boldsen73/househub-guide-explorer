// src/utils/testData.ts

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
  postalCode?: string;
  city?: string;
  isActive?: boolean;
}

export interface TestCase {
  id: string;
  sagsnummer: string;
  sellerId: string;
  address: string;
  postalCode: string;
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

// ✅ Testdata – 1 admin, 10 sælgere, 5 mæglere
export const DEFAULT_TEST_USERS: TestUser[] = [
  {
    id: 'admin-1',
    email: 'admin@hh.dk',
    password: '12345678',
    name: 'Administrator',
    role: 'admin',
    isActive: true
  },
  {
    id: 's1',
    name: 'Lars Nielsen',
    email: 's1@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '12 34 56 78',
    address: 'Vesterbrogade 1',
    postalCode: '1620',
    city: 'København V',
    isActive: true
  },
  {
    id: 's2',
    name: 'Anne Andersen',
    email: 's2@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '23 45 67 89',
    address: 'Nørrebrogade 23',
    postalCode: '2200',
    city: 'København N',
    isActive: true
  },
  {
    id: 's3',
    name: 'Peter Hansen',
    email: 's3@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '34 56 78 90',
    address: 'Østerbrogade 45',
    postalCode: '2100',
    city: 'København Ø',
    isActive: true
  },
  {
    id: 's4',
    name: 'Maria Christensen',
    email: 's4@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '45 67 89 01',
    address: 'Amager Boulevard 67',
    postalCode: '2300',
    city: 'København S',
    isActive: true
  },
  {
    id: 's5',
    name: 'Jens Johansen',
    email: 's5@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '56 78 90 12',
    address: 'Frederiksberg Allé 89',
    postalCode: '1820',
    city: 'Frederiksberg',
    isActive: true
  },
  {
    id: 's6',
    name: 'Susanne Madsen',
    email: 's6@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '67 89 01 23',
    address: 'Valby Langgade 12',
    postalCode: '2500',
    city: 'Valby',
    isActive: true
  },
  {
    id: 's7',
    name: 'Thomas Sørensen',
    email: 's7@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '78 90 12 34',
    address: 'Gl. Kongevej 99',
    postalCode: '1850',
    city: 'Frederiksberg',
    isActive: true
  },
  {
    id: 's8',
    name: 'Karen Petersen',
    email: 's8@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '89 01 23 45',
    address: 'Hellerupvej 54',
    postalCode: '2900',
    city: 'Hellerup',
    isActive: true
  },
  {
    id: 's9',
    name: 'Morten Holm',
    email: 's9@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '90 12 34 56',
    address: 'Gentoftegade 11',
    postalCode: '2820',
    city: 'Gentofte',
    isActive: true
  },
  {
    id: 's10',
    name: 'Louise Lund',
    email: 's10@hh.dk',
    password: '12345678',
    role: 'seller',
    phone: '01 23 45 67',
    address: 'Bagsværd Hovedgade 8',
    postalCode: '2880',
    city: 'Bagsværd',
    isActive: true
  },
  {
    id: 'm1',
    name: 'Jesper Høj',
    email: 'm1@hh.dk',
    password: '12345678',
    role: 'agent',
    phone: '31 31 31 31',
    company: 'Høj Mæglerfirma',
    primaryRegion: 'Storkøbenhavn',
    specialties: ['Villa', 'Lejlighed'],
    isActive: true
  },
  {
    id: 'm2',
    name: 'Camilla Mægler',
    email: 'm2@hh.dk',
    password: '12345678',
    role: 'agent',
    phone: '32 32 32 32',
    company: 'Camilla Bolig',
    primaryRegion: 'Nordsjælland',
    specialties: ['Rækkehus', 'Sommerhus'],
    isActive: true
  },
  {
    id: 'm3',
    name: 'Anders Holm',
    email: 'm3@hh.dk',
    password: '12345678',
    role: 'agent',
    phone: '33 33 33 33',
    company: 'Holm & Co',
    primaryRegion: 'Midtjylland',
    specialties: ['Lejlighed', 'Erhverv'],
    isActive: true
  },
  {
    id: 'm4',
    name: 'Pernille Ejendom',
    email: 'm4@hh.dk',
    password: '12345678',
    role: 'agent',
    phone: '34 34 34 34',
    company: 'Pernille Ejendomsmægler',
    primaryRegion: 'Fyn',
    specialties: ['Grund'],
    isActive: true
  },
  {
    id: 'm5',
    name: 'Rasmus Bolig',
    email: 'm5@hh.dk',
    password: '12345678',
    role: 'agent',
    phone: '35 35 35 35',
    company: 'BoligPartner',
    primaryRegion: 'Sydsjælland',
    specialties: ['Villa'],
    isActive: true
  }
];

// ✅ Export functions that other files need
export const getTestUsers = (): TestUser[] => {
  return JSON.parse(localStorage.getItem('test_users') || '[]');
};

export const authenticateTestUser = (email: string, password: string): TestUser | null => {
  const users = getTestUsers();
  return users.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password &&
    user.isActive !== false
  ) || null;
};

export const addTestUser = (user: TestUser): void => {
  const existing = getTestUsers();
  const updated = [...existing, user];
  localStorage.setItem('test_users', JSON.stringify(updated));
};

export const updateTestUser = (id: string, updates: Partial<TestUser>): void => {
  const existing = getTestUsers();
  const updated = existing.map(user => 
    user.id === id ? { ...user, ...updates } : user
  );
  localStorage.setItem('test_users', JSON.stringify(updated));
};

export const deactivateTestUser = (id: string): void => {
  updateTestUser(id, { isActive: false });
};

export const deleteTestUser = (id: string): void => {
  const existing = getTestUsers();
  const updated = existing.filter(user => user.id !== id);
  localStorage.setItem('test_users', JSON.stringify(updated));
};

// ✅ Missing case-related functions
export const getTestCases = (): TestCase[] => {
  return JSON.parse(localStorage.getItem('test_cases') || '[]');
};

export const getTestCasesForUser = (userId: string): TestCase[] => {
  const allCases = getTestCases();
  return allCases.filter(testCase => testCase.sellerId === userId);
};

export const getCaseMessages = (caseId: string, includeArchived: boolean = false): TestMessage[] => {
  const allMessages = JSON.parse(localStorage.getItem('test_messages') || '[]');
  return allMessages.filter((msg: TestMessage) => 
    msg.caseId === caseId && (includeArchived || !msg.archived)
  );
};

export const sendMessage = (message: Omit<TestMessage, 'id' | 'timestamp'>): void => {
  const existingMessages = JSON.parse(localStorage.getItem('test_messages') || '[]');
  const newMessage: TestMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [...existingMessages, newMessage];
  localStorage.setItem('test_messages', JSON.stringify(updated));
};

// Brug kun ved første load
export const seedTestUsers = () => {
  const existing = getTestUsers();
  const emails = existing.map((u: TestUser) => u.email.toLowerCase());
  const toAdd = DEFAULT_TEST_USERS.filter(user => !emails.includes(user.email.toLowerCase()));
  const updated = [...existing, ...toAdd];
  localStorage.setItem('test_users', JSON.stringify(updated));
};
