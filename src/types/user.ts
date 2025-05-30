
// User data types and interfaces
export interface User {
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

export interface Case {
  id: string;
  sagsnummer: string;
  sellerId: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  address: string;
  postnummer: string;
  municipality: string;
  type: string;
  size: number;
  buildYear: number;
  price: string;
  priceValue: number;
  showingDate?: Date;
  showingTime?: string;
  showingNotes?: string;
  status: 'draft' | 'active' | 'showing_booked' | 'showing_completed' | 'offers_received' | 'realtor_selected' | 'withdrawn' | 'archived';
  createdAt: string;
  offers: Offer[];
  showingRegistrations: ShowingRegistration[];
  messages: Message[];
  rooms?: string;
  description?: string;
  energyLabel?: string;
  constructionYear?: number;
}

export interface Offer {
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

export interface ShowingRegistration {
  id: string;
  caseId: string;
  agentId: string;
  agentName: string;
  agencyName: string;
  registeredAt: string;
}

export interface Message {
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

// Admin user for system management
export const ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@hh.dk',
  password: '12345678',
  name: 'Administrator',
  role: 'admin',
  isActive: true
};
