// Test users for the application
export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'seller' | 'agent' | 'admin';
  phone?: string;
  company?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  isActive?: boolean;
}

// 10 test sellers with properly separated address fields
const testSellers: TestUser[] = [
  {
    id: 'seller-1',
    email: 's1@hh.dk',
    password: '12345678',
    name: 'Lars Nielsen',
    role: 'seller',
    phone: '12 34 56 78',
    address: 'Vesterbrogade 1',
    postalCode: '1620',
    city: 'København V',
    isActive: true
  },
  {
    id: 'seller-2',
    email: 's2@hh.dk',
    password: '12345678',
    name: 'Anne Andersen',
    role: 'seller',
    phone: '23 45 67 89',
    address: 'Nørrebrogade 23',
    postalCode: '2200',
    city: 'København N',
    isActive: true
  },
  {
    id: 'seller-3',
    email: 's3@hh.dk',
    password: '12345678',
    name: 'Peter Hansen',
    role: 'seller',
    phone: '34 56 78 90',
    address: 'Østerbrogade 45',
    postalCode: '2100',
    city: 'København Ø',
    isActive: true
  },
  {
    id: 'seller-4',
    email: 's4@hh.dk',
    password: '12345678',
    name: 'Maria Christensen',
    role: 'seller',
    phone: '45 67 89 01',
    address: 'Amager Boulevard 67',
    postalCode: '2300',
    city: 'København S',
    isActive: true
  },
  {
    id: 'seller-5',
    email: 's5@hh.dk',
    password: '12345678',
    name: 'Jens Johansen',
    role: 'seller',
    phone: '56 78 90 12',
    address: 'Frederiksberg Allé 89',
    postalCode: '1820',
    city: 'Frederiksberg',
    isActive: true
  },
  {
    id: 'seller-6',
    email: 's6@hh.dk',
    password: '12345678',
    name: 'Susanne Madsen',
    role: 'seller',
    phone: '67 89 01 23',
    address: 'Trianglen 12',
    postalCode: '2100',
    city: 'København Ø',
    isActive: true
  },
  {
    id: 'seller-7',
    email: 's7@hh.dk',
    password: '12345678',
    name: 'Michael Sørensen',
    role: 'seller',
    phone: '78 90 12 34',
    address: 'Ryesgade 34',
    postalCode: '2200',
    city: 'København N',
    isActive: true
  },
  {
    id: 'seller-8',
    email: 's8@hh.dk',
    password: '12345678',
    name: 'Lotte Larsen',
    role: 'seller',
    phone: '89 01 23 45',
    address: 'Istedgade 56',
    postalCode: '1650',
    city: 'København V',
    isActive: true
  },
  {
    id: 'seller-9',
    email: 's9@hh.dk',
    password: '12345678',
    name: 'Thomas Thomsen',
    role: 'seller',
    phone: '90 12 34 56',
    address: 'Islands Brygge 78',
    postalCode: '2300',
    city: 'København S',
    isActive: true
  },
  {
    id: 'seller-10',
    email: 's10@hh.dk',
    password: '12345678',
    name: 'Camilla Rasmussen',
    role: 'seller',
    phone: '01 23 45 67',
    address: 'Sankt Hans Gade 90',
    postalCode: '2200',
    city: 'København N',
    isActive: true
  }
];

// 5 test agents
const testAgents: TestUser[] = [
  {
    id: 'agent-1',
    email: 'm1@hh.dk',
    password: '12345678',
    name: 'Henrik Olsen',
    role: 'agent',
    phone: '11 22 33 44',
    company: 'Estate Nord Mæglerne',
    isActive: true
  },
  {
    id: 'agent-2',
    email: 'm2@hh.dk',
    password: '12345678',
    name: 'Mette Petersen',
    role: 'agent',
    phone: '22 33 44 55',
    company: 'København Bolig',
    isActive: true
  },
  {
    id: 'agent-3',
    email: 'm3@hh.dk',
    password: '12345678',
    name: 'Bjørn Kristensen',
    role: 'agent',
    phone: '33 44 55 66',
    company: 'Nordea Ejendomme',
    isActive: true
  },
  {
    id: 'agent-4',
    email: 'm4@hh.dk',
    password: '12345678',
    name: 'Pia Mortensen',
    role: 'agent',
    phone: '44 55 66 77',
    company: 'Danske Boligmæglere',
    isActive: true
  },
  {
    id: 'agent-5',
    email: 'm5@hh.dk',
    password: '12345678',
    name: 'Anders Frederiksen',
    role: 'agent',
    phone: '55 66 77 88',
    company: 'Hovedstaden Ejendomme',
    isActive: true
  }
];

// Admin user
const adminUser: TestUser = {
  id: 'admin-1',
  email: 'admin@hh.dk',
  password: '12345678',
  name: 'Administrator',
  role: 'admin',
  isActive: true
};

// Export all test users
export const testUsers: TestUser[] = [
  adminUser,
  ...testSellers,
  ...testAgents
];

// Export by role for convenience
export const testSellerUsers = testSellers;
export const testAgentUsers = testAgents;
export const testAdminUser = adminUser;
