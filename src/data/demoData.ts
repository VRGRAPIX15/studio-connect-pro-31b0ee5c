import { Lead, Client, Booking, Invoice, Task, User, DashboardStats, Contract, ContractTemplate } from '@/types';

// Team Members
export const teamMembers: User[] = [
  {
    id: 'user-1',
    email: 'owner@studiocrm.com',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'owner',
    avatar: '',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'manager@studiocrm.com',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    role: 'manager',
    avatar: '',
    createdAt: new Date('2023-02-15'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user-3',
    email: 'staff@studiocrm.com',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    role: 'staff',
    avatar: '',
    createdAt: new Date('2023-03-20'),
    lastLogin: new Date(),
    isActive: true,
  },
];

// Demo Leads
export const demoLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Ananya Reddy',
    phone: '+91 99887 76655',
    email: 'ananya.reddy@gmail.com',
    source: 'instagram',
    status: 'new',
    eventType: 'wedding',
    eventDate: new Date('2026-03-15'),
    budget: 250000,
    notes: 'Looking for full wedding coverage - 2 day event',
    assignedTo: 'user-2',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
    followUpDate: new Date('2026-01-05'),
  },
  {
    id: 'lead-2',
    name: 'Vikram Singh',
    phone: '+91 88776 65544',
    email: 'vikram.singh@outlook.com',
    source: 'website',
    status: 'contacted',
    eventType: 'engagement',
    eventDate: new Date('2026-02-20'),
    budget: 80000,
    notes: 'Small family event, needs photographer only',
    assignedTo: 'user-3',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-03'),
    followUpDate: new Date('2026-01-06'),
  },
  {
    id: 'lead-3',
    name: 'Meera Nair',
    phone: '+91 77665 54433',
    email: 'meera.nair@yahoo.com',
    source: 'whatsapp',
    status: 'quoted',
    eventType: 'baby_shower',
    eventDate: new Date('2026-02-10'),
    budget: 45000,
    notes: 'Godh bharai ceremony at home',
    assignedTo: 'user-2',
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2026-01-02'),
    followUpDate: new Date('2026-01-04'),
  },
  {
    id: 'lead-4',
    name: 'Arjun Mehta',
    phone: '+91 66554 43322',
    source: 'referral',
    status: 'converted',
    eventType: 'wedding',
    eventDate: new Date('2026-01-25'),
    budget: 350000,
    notes: 'Referred by Sharma family - Premium package confirmed',
    assignedTo: 'user-1',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-28'),
  },
  {
    id: 'lead-5',
    name: 'Kavitha Rao',
    phone: '+91 55443 32211',
    email: 'kavitha.rao@gmail.com',
    source: 'instagram',
    status: 'new',
    eventType: 'birthday',
    eventDate: new Date('2026-02-05'),
    budget: 25000,
    notes: '1st birthday party - outdoor venue',
    assignedTo: 'user-3',
    createdAt: new Date('2026-01-03'),
    updatedAt: new Date('2026-01-03'),
    followUpDate: new Date('2026-01-05'),
  },
  {
    id: 'lead-6',
    name: 'Sanjay Gupta',
    phone: '+91 44332 21100',
    source: 'walkin',
    status: 'contacted',
    eventType: 'passport_photo',
    notes: 'Family passport photos - 5 members',
    assignedTo: 'user-3',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
  },
  {
    id: 'lead-7',
    name: 'Deepika Joshi',
    phone: '+91 33221 10099',
    email: 'deepika.j@company.com',
    source: 'website',
    status: 'quoted',
    eventType: 'corporate',
    eventDate: new Date('2026-01-30'),
    budget: 75000,
    notes: 'Annual day event coverage for IT company',
    assignedTo: 'user-2',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2026-01-01'),
    followUpDate: new Date('2026-01-05'),
  },
  {
    id: 'lead-8',
    name: 'Rahul Verma',
    phone: '+91 22110 09988',
    source: 'whatsapp',
    status: 'lost',
    eventType: 'wedding',
    eventDate: new Date('2026-02-28'),
    budget: 200000,
    notes: 'Price too high - went with competitor',
    assignedTo: 'user-1',
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2025-12-25'),
  },
  {
    id: 'lead-9',
    name: 'Sneha Kapoor',
    phone: '+91 11009 98877',
    email: 'sneha.kapoor@gmail.com',
    source: 'instagram',
    status: 'new',
    eventType: 'portfolio',
    budget: 15000,
    notes: 'Model portfolio shoot - outdoor locations',
    assignedTo: 'user-3',
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
    followUpDate: new Date('2026-01-06'),
  },
  {
    id: 'lead-10',
    name: 'Manish Agarwal',
    phone: '+91 99988 87766',
    email: 'manish.ag@business.com',
    source: 'referral',
    status: 'contacted',
    eventType: 'product_shoot',
    budget: 35000,
    notes: 'E-commerce product photography - 50 items',
    assignedTo: 'user-2',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-03'),
    followUpDate: new Date('2026-01-07'),
  },
];

// Demo Clients
export const demoClients: Client[] = [
  {
    id: 'client-1',
    name: 'Arjun Mehta',
    phone: '+91 66554 43322',
    email: 'arjun.mehta@gmail.com',
    address: '123, Rose Garden, Banjara Hills, Hyderabad',
    source: 'referral',
    totalBookings: 1,
    totalSpent: 350000,
    notes: 'Premium client - referred by Sharma family',
    createdAt: new Date('2025-12-28'),
    lastEventDate: new Date('2026-01-25'),
  },
  {
    id: 'client-2',
    name: 'Pooja Sharma',
    phone: '+91 88899 90011',
    email: 'pooja.sharma@outlook.com',
    address: '45, Green Valley, Jubilee Hills, Hyderabad',
    source: 'instagram',
    totalBookings: 3,
    totalSpent: 425000,
    notes: 'Repeat client - very particular about editing style',
    createdAt: new Date('2024-06-15'),
    lastEventDate: new Date('2025-11-20'),
  },
  {
    id: 'client-3',
    name: 'Karthik Iyer',
    phone: '+91 77788 89900',
    email: 'karthik.iyer@gmail.com',
    address: '78, Lake View Apartments, Madhapur',
    source: 'website',
    totalBookings: 2,
    totalSpent: 180000,
    notes: 'Software professional - prefers weekend shoots',
    createdAt: new Date('2024-09-10'),
    lastEventDate: new Date('2025-08-15'),
  },
  {
    id: 'client-4',
    name: 'Nisha Patil',
    phone: '+91 66677 78899',
    email: 'nisha.patil@yahoo.com',
    address: '234, Star Enclave, Kondapur',
    source: 'whatsapp',
    totalBookings: 1,
    totalSpent: 45000,
    notes: 'Baby shower client - may return for naming ceremony',
    createdAt: new Date('2025-10-05'),
    lastEventDate: new Date('2025-10-25'),
  },
  {
    id: 'client-5',
    name: 'Ravi Krishnan',
    phone: '+91 55566 67788',
    email: 'ravi.k@company.org',
    address: 'Office 301, Tech Park, HITEC City',
    source: 'referral',
    totalBookings: 4,
    totalSpent: 280000,
    notes: 'Corporate client - annual contract for events',
    createdAt: new Date('2023-08-20'),
    lastEventDate: new Date('2025-12-15'),
  },
  {
    id: 'client-6',
    name: 'Lakshmi Devi',
    phone: '+91 44455 56677',
    email: 'lakshmi.d@gmail.com',
    address: '56, Temple Street, Secunderabad',
    source: 'walkin',
    totalBookings: 2,
    totalSpent: 55000,
    notes: 'Traditional family - prefers classic photography style',
    createdAt: new Date('2024-03-12'),
    lastEventDate: new Date('2025-09-10'),
  },
];

// Demo Bookings
export const demoBookings: Booking[] = [
  {
    id: 'booking-1',
    clientId: 'client-1',
    clientName: 'Arjun Mehta',
    eventType: 'wedding',
    eventDate: new Date('2026-01-25'),
    eventTime: '10:00 AM',
    venue: 'Taj Falaknuma Palace, Hyderabad',
    status: 'confirmed',
    package: 'Premium Wedding Package',
    totalAmount: 350000,
    advancePaid: 175000,
    balanceDue: 175000,
    assignedTeam: ['user-1', 'user-2', 'user-3'],
    notes: '2-day wedding coverage with drone shots',
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2026-01-02'),
  },
  {
    id: 'booking-2',
    clientId: 'client-2',
    clientName: 'Pooja Sharma',
    eventType: 'engagement',
    eventDate: new Date('2026-01-18'),
    eventTime: '5:00 PM',
    venue: 'Novotel HICC, Hyderabad',
    status: 'confirmed',
    package: 'Engagement Special',
    totalAmount: 85000,
    advancePaid: 85000,
    balanceDue: 0,
    assignedTeam: ['user-2'],
    notes: 'Evening event - need lighting equipment',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-22'),
  },
  {
    id: 'booking-3',
    clientId: 'client-5',
    clientName: 'Ravi Krishnan',
    eventType: 'corporate',
    eventDate: new Date('2026-01-30'),
    eventTime: '9:00 AM',
    venue: 'Tech Park Convention Center',
    status: 'confirmed',
    package: 'Corporate Event Coverage',
    totalAmount: 75000,
    advancePaid: 37500,
    balanceDue: 37500,
    assignedTeam: ['user-2', 'user-3'],
    notes: 'Full day event - lunch and dinner coverage',
    createdAt: new Date('2025-12-25'),
    updatedAt: new Date('2025-12-28'),
  },
  {
    id: 'booking-4',
    clientId: 'client-3',
    clientName: 'Karthik Iyer',
    eventType: 'baby_shower',
    eventDate: new Date('2026-02-08'),
    eventTime: '11:00 AM',
    venue: 'Home - Lake View Apartments',
    status: 'inquiry',
    package: 'Baby Shower Package',
    totalAmount: 40000,
    advancePaid: 0,
    balanceDue: 40000,
    assignedTeam: ['user-3'],
    notes: 'Intimate ceremony - 30 guests',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
  },
  {
    id: 'booking-5',
    clientId: 'client-6',
    clientName: 'Lakshmi Devi',
    eventType: 'birthday',
    eventDate: new Date('2026-02-14'),
    eventTime: '4:00 PM',
    venue: 'Function Hall, Secunderabad',
    status: 'confirmed',
    package: 'Birthday Celebration',
    totalAmount: 30000,
    advancePaid: 15000,
    balanceDue: 15000,
    assignedTeam: ['user-3'],
    notes: '60th birthday celebration - traditional theme',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-03'),
  },
];

// Demo Invoices
export const demoInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'VV-2026-001',
    bookingId: 'booking-1',
    clientId: 'client-1',
    clientName: 'Arjun Mehta',
    items: [
      { id: 'item-1', description: 'Premium Wedding Photography', quantity: 1, unitPrice: 250000, amount: 250000 },
      { id: 'item-2', description: 'Drone Coverage', quantity: 1, unitPrice: 50000, amount: 50000 },
      { id: 'item-3', description: 'Photo Album (Premium)', quantity: 2, unitPrice: 25000, amount: 50000 },
    ],
    subtotal: 350000,
    taxAmount: 0,
    discount: 0,
    totalAmount: 350000,
    paidAmount: 175000,
    balanceDue: 175000,
    status: 'partial',
    dueDate: new Date('2026-01-20'),
    createdAt: new Date('2025-12-28'),
    payments: [
      {
        id: 'pay-1',
        invoiceId: 'inv-1',
        amount: 175000,
        method: 'bank_transfer',
        reference: 'NEFT-123456',
        notes: 'Advance payment',
        receivedBy: 'user-1',
        createdAt: new Date('2025-12-28'),
      },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'VV-2025-089',
    bookingId: 'booking-2',
    clientId: 'client-2',
    clientName: 'Pooja Sharma',
    items: [
      { id: 'item-4', description: 'Engagement Photography', quantity: 1, unitPrice: 65000, amount: 65000 },
      { id: 'item-5', description: 'Same Day Edit Video', quantity: 1, unitPrice: 20000, amount: 20000 },
    ],
    subtotal: 85000,
    taxAmount: 0,
    discount: 0,
    totalAmount: 85000,
    paidAmount: 85000,
    balanceDue: 0,
    status: 'paid',
    dueDate: new Date('2025-12-25'),
    createdAt: new Date('2025-12-20'),
    payments: [
      {
        id: 'pay-2',
        invoiceId: 'inv-2',
        amount: 85000,
        method: 'upi',
        reference: 'UPI-789012',
        notes: 'Full payment',
        receivedBy: 'user-2',
        createdAt: new Date('2025-12-22'),
      },
    ],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'VV-2026-002',
    bookingId: 'booking-3',
    clientId: 'client-5',
    clientName: 'Ravi Krishnan',
    items: [
      { id: 'item-6', description: 'Corporate Event Photography', quantity: 1, unitPrice: 50000, amount: 50000 },
      { id: 'item-7', description: 'Video Coverage', quantity: 1, unitPrice: 25000, amount: 25000 },
    ],
    subtotal: 75000,
    taxAmount: 0,
    discount: 0,
    totalAmount: 75000,
    paidAmount: 37500,
    balanceDue: 37500,
    status: 'partial',
    dueDate: new Date('2026-01-25'),
    createdAt: new Date('2025-12-25'),
    payments: [
      {
        id: 'pay-3',
        invoiceId: 'inv-3',
        amount: 37500,
        method: 'bank_transfer',
        reference: 'NEFT-456789',
        notes: '50% advance',
        receivedBy: 'user-2',
        createdAt: new Date('2025-12-28'),
      },
    ],
  },
];

// Demo Tasks
export const demoTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up with Ananya Reddy',
    description: 'Call regarding wedding photography quote',
    assignedTo: 'user-2',
    relatedTo: { type: 'lead', id: 'lead-1' },
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2026-01-05'),
    createdAt: new Date('2026-01-02'),
  },
  {
    id: 'task-2',
    title: 'Send quote to Deepika Joshi',
    description: 'Corporate event package proposal',
    assignedTo: 'user-2',
    relatedTo: { type: 'lead', id: 'lead-7' },
    priority: 'medium',
    status: 'in_progress',
    dueDate: new Date('2026-01-05'),
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'task-3',
    title: 'Prepare equipment for Arjun wedding',
    description: 'Check cameras, lenses, drone batteries',
    assignedTo: 'user-3',
    relatedTo: { type: 'booking', id: 'booking-1' },
    priority: 'urgent',
    status: 'pending',
    dueDate: new Date('2026-01-24'),
    createdAt: new Date('2026-01-03'),
  },
  {
    id: 'task-4',
    title: 'Collect balance from Arjun Mehta',
    description: 'Rs 1,75,000 balance due before event',
    assignedTo: 'user-1',
    relatedTo: { type: 'client', id: 'client-1' },
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2026-01-20'),
    createdAt: new Date('2026-01-02'),
  },
  {
    id: 'task-5',
    title: 'Edit Pooja engagement photos',
    description: 'Deliver edited photos within 7 days',
    assignedTo: 'user-3',
    relatedTo: { type: 'booking', id: 'booking-2' },
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2026-01-25'),
    createdAt: new Date('2026-01-18'),
  },
];

// Contract Templates
export const demoContractTemplates: ContractTemplate[] = [
  {
    id: 'template-1',
    name: 'Wedding Photography Contract',
    eventType: 'wedding',
    content: `PHOTOGRAPHY SERVICES AGREEMENT

This Agreement is entered into between Varnika Visuals & SD Event Avenue ("Photographer") and {{clientName}} ("Client") for photography services.

EVENT DETAILS:
- Event Date: {{eventDate}}
- Venue: {{venue}}
- Package: {{packageName}}

SERVICES INCLUDED:
The Photographer agrees to provide professional photography services for the wedding event, including:
• Pre-wedding consultation
• Full day photography coverage
• Professional editing of selected images
• High-resolution digital images
• Online gallery access
• {{packageName}} deliverables as per package selected

TOTAL FEE: {{totalAmount}}

PAYMENT TERMS:
• 50% advance payment required to confirm booking
• Remaining 50% due 7 days before the event
• Additional services billed separately

The Photographer will deliver the final edited images within 4-6 weeks after the event date.`,
    terms: `TERMS AND CONDITIONS:

1. BOOKING & PAYMENT
- A 50% non-refundable deposit is required to secure the date
- Final payment must be received 7 days before the event
- Additional hours beyond the agreed coverage will be billed at ₹5,000/hour

2. CANCELLATION POLICY
- Cancellation 30+ days before event: 50% refund of deposit
- Cancellation 15-30 days before event: 25% refund of deposit
- Cancellation less than 15 days: No refund

3. IMAGE DELIVERY
- Edited images delivered within 4-6 weeks
- Raw/unedited files are not provided
- Client receives full print rights for personal use

4. LIABILITY
- Photographer is not liable for unforeseen circumstances
- Backup equipment will be used in case of technical failures
- Client responsible for obtaining necessary venue permissions

5. COPYRIGHT
- Photographer retains copyright of all images
- Images may be used for portfolio and marketing purposes
- Client receives license for personal, non-commercial use

By signing below, both parties agree to the terms outlined in this agreement.`,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'template-2',
    name: 'Engagement Photography Contract',
    eventType: 'engagement',
    content: `ENGAGEMENT PHOTOGRAPHY AGREEMENT

This Agreement is made between Varnika Visuals & SD Event Avenue ("Photographer") and {{clientName}} ("Client").

EVENT DETAILS:
- Event Date: {{eventDate}}
- Venue: {{venue}}
- Package: {{packageName}}

SERVICES:
Professional engagement ceremony photography including:
• Full event coverage
• Professional editing
• High-resolution digital images
• Online gallery

TOTAL FEE: {{totalAmount}}

PAYMENT:
• 50% advance to confirm booking
• Balance due before event date`,
    terms: `TERMS:
1. 50% deposit required for booking confirmation
2. Cancellation within 7 days: No refund
3. Images delivered within 2-3 weeks
4. Photographer retains image copyright
5. Client receives personal use license`,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'template-3',
    name: 'Corporate Event Contract',
    eventType: 'corporate',
    content: `CORPORATE EVENT PHOTOGRAPHY AGREEMENT

Agreement between Varnika Visuals & SD Event Avenue ("Photographer") and {{clientName}} ("Client").

EVENT DETAILS:
- Date: {{eventDate}}
- Location: {{venue}}
- Package: {{packageName}}

SCOPE OF WORK:
• Professional event photography
• Executive portraits (if required)
• Stage and presentation coverage
• Networking moments capture
• Same-day preview (optional)

TOTAL FEE: {{totalAmount}}

DELIVERABLES:
• Edited high-resolution images
• Quick turnaround within 1 week
• Commercial usage rights included`,
    terms: `TERMS:
1. Full payment required before event
2. Cancellation policy: 50% fee if cancelled within 7 days
3. Commercial usage rights included in fee
4. Re-editing requests: 2 rounds included
5. Extended hours billed at ₹4,000/hour`,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'template-4',
    name: 'Birthday/Baby Shower Contract',
    eventType: 'birthday',
    content: `CELEBRATION PHOTOGRAPHY AGREEMENT

Between Varnika Visuals & SD Event Avenue and {{clientName}}.

EVENT: Birthday/Celebration Photography
DATE: {{eventDate}}
VENUE: {{venue}}
PACKAGE: {{packageName}}

SERVICES:
• Professional photography coverage
• Candid and posed shots
• Edited digital images
• Online gallery access

TOTAL: {{totalAmount}}`,
    terms: `TERMS:
1. 50% advance required
2. Balance due on event day
3. Images delivered within 2 weeks
4. Personal use license included`,
    isDefault: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'template-5',
    name: 'General Photography Contract',
    eventType: 'other',
    content: `PHOTOGRAPHY SERVICES AGREEMENT

This Agreement is between Varnika Visuals & SD Event Avenue ("Photographer") and {{clientName}} ("Client").

SERVICE DETAILS:
- Date: {{eventDate}}
- Location: {{venue}}
- Package: {{packageName}}
- Fee: {{totalAmount}}

The Photographer agrees to provide professional photography services as discussed and agreed upon with the Client.`,
    terms: `STANDARD TERMS:
1. Advance payment required for booking
2. Cancellation subject to refund policy
3. Images delivered as per agreed timeline
4. Photographer retains copyright
5. Client receives usage license`,
    isDefault: true,
    createdAt: new Date('2024-01-01'),
  },
];

// Demo Contracts
export const demoContracts: Contract[] = [
  {
    id: 'contract-1',
    contractNumber: 'VV-CON-2026-001',
    bookingId: 'booking-1',
    clientId: 'client-1',
    clientName: 'Arjun Mehta',
    clientEmail: 'arjun.mehta@gmail.com',
    templateId: 'template-1',
    eventType: 'wedding',
    eventDate: new Date('2026-01-25'),
    venue: 'Taj Falaknuma Palace, Hyderabad',
    packageName: 'Premium Wedding Package',
    totalAmount: 350000,
    content: `PHOTOGRAPHY SERVICES AGREEMENT

This Agreement is entered into between Varnika Visuals & SD Event Avenue ("Photographer") and Arjun Mehta ("Client") for photography services.

EVENT DETAILS:
- Event Date: 25 January 2026
- Venue: Taj Falaknuma Palace, Hyderabad
- Package: Premium Wedding Package

SERVICES INCLUDED:
The Photographer agrees to provide professional photography services for the wedding event, including:
• Pre-wedding consultation
• Full day photography coverage (2 days)
• Professional editing of selected images
• High-resolution digital images
• Online gallery access
• Drone coverage
• Premium photo album (2 copies)

TOTAL FEE: ₹3,50,000`,
    terms: `TERMS AND CONDITIONS:

1. BOOKING & PAYMENT
- 50% advance payment of ₹1,75,000 received
- Remaining ₹1,75,000 due 7 days before the event

2. CANCELLATION POLICY
- As per standard terms

3. IMAGE DELIVERY
- Edited images delivered within 4-6 weeks

By signing below, both parties agree to the terms outlined in this agreement.`,
    status: 'signed',
    sentAt: new Date('2025-12-29'),
    signedAt: new Date('2025-12-30'),
    signatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    signerName: 'Arjun Mehta',
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2025-12-30'),
  },
  {
    id: 'contract-2',
    contractNumber: 'VV-CON-2026-002',
    bookingId: 'booking-2',
    clientId: 'client-2',
    clientName: 'Pooja Sharma',
    clientEmail: 'pooja.sharma@outlook.com',
    templateId: 'template-2',
    eventType: 'engagement',
    eventDate: new Date('2026-01-18'),
    venue: 'Novotel HICC, Hyderabad',
    packageName: 'Engagement Special',
    totalAmount: 85000,
    content: `ENGAGEMENT PHOTOGRAPHY AGREEMENT

This Agreement is made between Varnika Visuals & SD Event Avenue ("Photographer") and Pooja Sharma ("Client").

EVENT DETAILS:
- Event Date: 18 January 2026
- Venue: Novotel HICC, Hyderabad
- Package: Engagement Special

SERVICES:
Professional engagement ceremony photography including:
• Full event coverage
• Professional editing
• High-resolution digital images
• Online gallery
• Same day edit video

TOTAL FEE: ₹85,000`,
    terms: `TERMS:
1. Full payment received
2. Images delivered within 2-3 weeks
3. Photographer retains image copyright
4. Client receives personal use license`,
    status: 'signed',
    sentAt: new Date('2025-12-21'),
    signedAt: new Date('2025-12-22'),
    signatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    signerName: 'Pooja Sharma',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-22'),
  },
  {
    id: 'contract-3',
    contractNumber: 'VV-CON-2026-003',
    bookingId: 'booking-3',
    clientId: 'client-5',
    clientName: 'Ravi Krishnan',
    clientEmail: 'ravi.k@company.org',
    templateId: 'template-3',
    eventType: 'corporate',
    eventDate: new Date('2026-01-30'),
    venue: 'Tech Park Convention Center',
    packageName: 'Corporate Event Coverage',
    totalAmount: 75000,
    content: `CORPORATE EVENT PHOTOGRAPHY AGREEMENT

Agreement between Varnika Visuals & SD Event Avenue ("Photographer") and Ravi Krishnan ("Client").

EVENT DETAILS:
- Date: 30 January 2026
- Location: Tech Park Convention Center
- Package: Corporate Event Coverage

SCOPE OF WORK:
• Professional event photography
• Stage and presentation coverage
• Networking moments capture
• Full day coverage

TOTAL FEE: ₹75,000`,
    terms: `TERMS:
1. 50% advance received
2. Balance due before event
3. Commercial usage rights included
4. Images delivered within 1 week`,
    status: 'sent',
    sentAt: new Date('2025-12-26'),
    expiresAt: new Date('2026-01-10'),
    createdAt: new Date('2025-12-25'),
    updatedAt: new Date('2025-12-26'),
  },
  {
    id: 'contract-4',
    contractNumber: 'VV-CON-2026-004',
    bookingId: 'booking-5',
    clientId: 'client-6',
    clientName: 'Lakshmi Devi',
    templateId: 'template-4',
    eventType: 'birthday',
    eventDate: new Date('2026-02-14'),
    venue: 'Function Hall, Secunderabad',
    packageName: 'Birthday Celebration',
    totalAmount: 30000,
    content: `CELEBRATION PHOTOGRAPHY AGREEMENT

Between Varnika Visuals & SD Event Avenue and Lakshmi Devi.

EVENT: 60th Birthday Celebration
DATE: 14 February 2026
VENUE: Function Hall, Secunderabad
PACKAGE: Birthday Celebration

SERVICES:
• Professional photography coverage
• Candid and posed shots
• Traditional theme coverage
• Edited digital images

TOTAL: ₹30,000`,
    terms: `TERMS:
1. 50% advance required
2. Balance due on event day
3. Images delivered within 2 weeks`,
    status: 'draft',
    createdAt: new Date('2026-01-03'),
    updatedAt: new Date('2026-01-03'),
  },
];

// Chart Data for Reports
export const revenueData = [
  { month: 'Aug', revenue: 285000 },
  { month: 'Sep', revenue: 320000 },
  { month: 'Oct', revenue: 410000 },
  { month: 'Nov', revenue: 380000 },
  { month: 'Dec', revenue: 520000 },
  { month: 'Jan', revenue: 445000 },
];

export const leadSourceData = [
  { name: 'Instagram', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Website', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'WhatsApp', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Referral', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Walk-in', value: 5, color: 'hsl(var(--chart-5))' },
];

export const serviceRevenueData = [
  { service: 'Wedding', revenue: 850000 },
  { service: 'Engagement', revenue: 180000 },
  { service: 'Baby Shower', revenue: 120000 },
  { service: 'Birthday', revenue: 95000 },
  { service: 'Corporate', revenue: 210000 },
  { service: 'Portrait', revenue: 75000 },
];

export const conversionData = [
  { stage: 'New Leads', count: 45, percentage: 100 },
  { stage: 'Contacted', count: 38, percentage: 84 },
  { stage: 'Quoted', count: 28, percentage: 62 },
  { stage: 'Converted', count: 18, percentage: 40 },
];

export const teamPerformanceData = [
  { name: 'Rajesh Kumar', bookings: 12, revenue: 580000, leads: 8 },
  { name: 'Priya Sharma', bookings: 18, revenue: 420000, leads: 15 },
  { name: 'Amit Patel', bookings: 8, revenue: 180000, leads: 12 },
];

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => ({
  todayBookings: 2,
  newLeadsThisWeek: 5,
  pendingPayments: 3,
  monthlyRevenue: 445000,
  upcomingEvents: demoBookings.filter(b => b.status === 'confirmed').slice(0, 5),
  recentLeads: demoLeads.filter(l => l.status === 'new' || l.status === 'contacted').slice(0, 5),
  overdueInvoices: demoInvoices.filter(i => i.status === 'partial' || i.status === 'pending'),
});
