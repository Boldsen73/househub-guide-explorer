export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'seller' | 'agent' | 'admin';
  phone?: string;
  company?: string;
  address?: string;
  postnummer?: string;
  city?: string;
  authorizationNumber?: string;
  primaryRegion?: string;
  specialties?: string[];
  isActive?: boolean;
}

// Brugere (oprettes i seed-funktion)
export let TEST_USERS: TestUser[] = [];

export const seedTestUsers = () => {
  TEST_USERS = [
    // ADMIN
    {
      id: 'admin-1',
      email: 'admin@hh.dk',
      password: '12345678',
      name: 'Administrator',
      role: 'admin',
      isActive: true,
    },

    // SÆLGERE
    {
      id: 'seller-1',
      name: 'Lars Nielsen',
      email: 's1@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '12 34 56 78',
      address: 'Vesterbrogade 1',
      postnummer: '1620',
      city: 'København',
      isActive: true,
    },
    {
      id: 'seller-2',
      name: 'Anne Andersen',
      email: 's2@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '23 45 67 89',
      address: 'Nørrebrogade 23',
      postnummer: '2200',
      city: 'København',
      isActive: true,
    },
    {
      id: 'seller-3',
      name: 'Peter Hansen',
      email: 's3@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '34 56 78 90',
      address: 'Østerbrogade 45',
      postnummer: '2100',
      city: 'København',
      isActive: true,
    },
    {
      id: 'seller-4',
      name: 'Maria Christensen',
      email: 's4@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '45 67 89 01',
      address: 'Amager Boulevard 67',
      postnummer: '2300',
      city: 'København S',
      isActive: true,
    },
    {
      id: 'seller-5',
      name: 'Jens Johansen',
      email: 's5@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '56 78 90 12',
      address: 'Frederiksberg Allé 89',
      postnummer: '1820',
      city: 'Frederiksberg',
      isActive: true,
    },
    {
      id: 'seller-6',
      name: 'Susanne Madsen',
      email: 's6@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '78 90 12 34',
      address: 'Lyngbyvej 12',
      postnummer: '2100',
      city: 'København',
      isActive: true,
    },
    {
      id: 'seller-7',
      name: 'Niels Sørensen',
      email: 's7@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '67 89 01 23',
      address: 'Gl. Kongevej 134',
      postnummer: '1850',
      city: 'Frederiksberg',
      isActive: true,
    },
    {
      id: 'seller-8',
      name: 'Karen Jakobsen',
      email: 's8@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '90 12 34 56',
      address: 'Strandboulevarden 1',
      postnummer: '2100',
      city: 'København',
      isActive: true,
    },
    {
      id: 'seller-9',
      name: 'Henrik Kristensen',
      email: 's9@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '89 01 23 45',
      address: 'Islands Brygge 55',
      postnummer: '2300',
      city: 'København S',
      isActive: true,
    },
    {
      id: 'seller-10',
      name: 'Mette Holm',
      email: 's10@hh.dk',
      password: '12345678',
      role: 'seller',
      phone: '23 45 67 89',
      address: 'Tagensvej 97',
      postnummer: '2200',
      city: 'København',
      isActive: true,
    },

    // MÆGLERE
    {
      id: 'agent-1',
      name: 'Allan Ejendom',
      email: 'm1@hh.dk',
      password: '12345678',
      role: 'agent',
      phone: '11 22 33 44',
      company: 'BoligPartner',
      primaryRegion: 'København',
      specialties: ['Villa', 'Rækkehus'],
      isActive: true,
    },
    {
      id: 'agent-2',
      name: 'Birgit Bolig',
      email: 'm2@hh.dk',
      password: '12345678',
      role: 'agent',
      phone: '22 33 44 55',
      company: 'DanBolig',
      primaryRegion: 'Frederiksberg',
      specialties: ['Lejlighed'],
      isActive: true,
    },
    {
      id: 'agent-3',
      name: 'Carsten Salg',
      email: 'm3@hh.dk',
      password: '12345678',
      role: 'agent',
      phone: '33 44 55 66',
      company: 'EDC',
      primaryRegion: 'København S',
      specialties: ['Villa', 'Sommerhus'],
      isActive: true,
    },
    {
      id: 'agent-4',
      name: 'Dorte Ejendom',
      email: 'm4@hh.dk',
      password: '12345678',
      role: 'agent',
      phone: '44 55 66 77',
      company: 'Home',
      primaryRegion: 'København NV',
      specialties: ['Erhverv', 'Lejlighed'],
      isActive: true,
    },
    {
      id: 'agent-5',
      name: 'Erik Vurdering',
      email: 'm5@hh.dk',
      password: '12345678',
      role: 'agent',
      phone: '55 66 77 88',
      company: 'Nybolig',
      primaryRegion: 'Amager',
      specialties: ['Villa', 'Grund'],
      isActive: true,
    },
  ];

  // Gem i localStorage
  localStorage.setItem('test_users', JSON.stringify(TEST_USERS));
};
