// Passport Photo Business Types

export interface PassportCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PassportOrderItem {
  templateId: string;
  templateName: string;
  country?: string;
  dimensions?: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  photoUrl?: string;
}

export interface PassportOrder {
  id: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: PassportOrderItem[];
  subtotal: number;
  discount?: number;
  tax: number;
  total: number;
  paidAmount?: number;
  balanceDue?: number;
  status: 'pending' | 'printed' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'upi' | 'card' | 'other';
  paymentReference?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string;
}

export interface PassportPhotoPrice {
  id: string;
  templateId: string;
  templateName: string;
  country: string;
  photoType: string;
  price: number;
  pricePerSheet?: number;
  isActive: boolean;
}

export interface PassportSettings {
  studioName: string;
  studioAddress: string;
  studioPhone: string;
  studioEmail?: string;
  gstNumber?: string;
  defaultPricePerPhoto: number;
  defaultPricePerSheet: number;
  taxRate: number; // percentage
  printDpi: number;
  defaultPaperSize: '4x6' | 'a4';
  autoSaveToDrive: boolean;
  driveFolderId?: string;
}

export const defaultPassportSettings: PassportSettings = {
  studioName: 'Varnika Visuals',
  studioAddress: '',
  studioPhone: '',
  studioEmail: '',
  gstNumber: '',
  defaultPricePerPhoto: 30,
  defaultPricePerSheet: 100,
  taxRate: 0,
  printDpi: 300,
  defaultPaperSize: '4x6',
  autoSaveToDrive: false,
};

// Generate order ID
export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PP${year}${month}${day}-${random}`;
}
