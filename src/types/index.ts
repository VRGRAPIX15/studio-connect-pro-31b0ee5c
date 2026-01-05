// Type definitions for the CRM

// User & Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'owner' | 'manager' | 'staff';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Leads & Clients
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
export type LeadSource = 'website' | 'instagram' | 'whatsapp' | 'referral' | 'walkin' | 'other';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  eventType?: EventType;
  eventDate?: Date;
  budget?: number;
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  followUpDate?: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  source: LeadSource;
  totalBookings: number;
  totalSpent: number;
  notes?: string;
  createdAt: Date;
  lastEventDate?: Date;
}

// Events & Bookings
export type EventType = 
  | 'wedding' 
  | 'baby_shower' 
  | 'birthday' 
  | 'engagement' 
  | 'corporate' 
  | 'passport_photo' 
  | 'portfolio' 
  | 'product_shoot'
  | 'other';

export type BookingStatus = 'inquiry' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  eventType: EventType;
  eventDate: Date;
  eventTime?: string;
  venue?: string;
  status: BookingStatus;
  package?: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  assignedTeam: string[];
  notes?: string;
  contractId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invoices & Payments
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'razorpay' | 'cheque';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: PaymentStatus;
  dueDate: Date;
  createdAt: Date;
  payments: Payment[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  receivedBy: string;
  createdAt: Date;
}

// Contracts
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';

export interface ContractTemplate {
  id: string;
  name: string;
  eventType: EventType;
  content: string;
  terms: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Contract {
  id: string;
  contractNumber: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  templateId: string;
  eventType: EventType;
  eventDate: Date;
  venue?: string;
  packageName: string;
  totalAmount: number;
  content: string;
  terms: string;
  status: ContractStatus;
  sentAt?: Date;
  signedAt?: Date;
  expiresAt?: Date;
  signatureUrl?: string;
  signerName?: string;
  signerIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tasks & Workflows
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  relatedTo?: {
    type: 'lead' | 'booking' | 'client';
    id: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  todayBookings: number;
  newLeadsThisWeek: number;
  pendingPayments: number;
  monthlyRevenue: number;
  upcomingEvents: Booking[];
  recentLeads: Lead[];
  overdueInvoices: Invoice[];
}

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}
