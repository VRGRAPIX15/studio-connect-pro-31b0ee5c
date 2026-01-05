/**
 * API Service Layer for Studio CRM
 * Connects frontend to Google Apps Script backend
 */

import { Client, Lead, Booking, Contract, Invoice, Task, User, Payment } from '@/types';

// API Configuration - Replace with your deployed Google Apps Script URL
const API_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// Check if API is configured
export const isApiConfigured = () => Boolean(API_URL);

// Generic API call handler
async function apiCall<T>(action: string, method: 'GET' | 'POST' = 'GET', data?: Record<string, unknown>): Promise<T> {
  if (!API_URL) {
    throw new Error('API not configured. Please set VITE_GOOGLE_SCRIPT_URL in your environment.');
  }

  try {
    if (method === 'GET') {
      const url = new URL(API_URL);
      url.searchParams.append('action', action);
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
      const response = await fetch(url.toString());
      return await response.json();
    } else {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action, ...data }),
      });
      return await response.json();
    }
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

export const authApi = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    return apiCall('login', 'POST', { email, password });
  },
};

// ==================== CLIENTS ====================

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const result = await apiCall<Client[]>('getClients');
    return Array.isArray(result) ? result : [];
  },

  add: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<{ success: boolean; id: string; client: Client }> => {
    return apiCall('addClient', 'POST', { client });
  },

  update: async (id: string, updates: Partial<Client>): Promise<{ success: boolean }> => {
    return apiCall('updateClient', 'POST', { id, client: updates });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiCall('deleteClient', 'POST', { id });
  },
};

// ==================== LEADS ====================

export const leadsApi = {
  getAll: async (): Promise<Lead[]> => {
    const result = await apiCall<Lead[]>('getLeads');
    return Array.isArray(result) ? result : [];
  },

  add: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id: string; lead: Lead }> => {
    return apiCall('addLead', 'POST', { lead });
  },

  update: async (id: string, updates: Partial<Lead>): Promise<{ success: boolean }> => {
    return apiCall('updateLead', 'POST', { id, lead: updates });
  },

  updateStatus: async (id: string, status: string): Promise<{ success: boolean }> => {
    return apiCall('updateLeadStatus', 'POST', { id, status });
  },

  convert: async (id: string): Promise<{ success: boolean; clientId: string }> => {
    return apiCall('convertLead', 'POST', { id });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiCall('deleteLead', 'POST', { id });
  },
};

// ==================== BOOKINGS ====================

export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const result = await apiCall<Booking[]>('getBookings');
    return Array.isArray(result) ? result : [];
  },

  add: async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id: string; booking: Booking }> => {
    return apiCall('addBooking', 'POST', { booking });
  },

  update: async (id: string, updates: Partial<Booking>): Promise<{ success: boolean }> => {
    return apiCall('updateBooking', 'POST', { id, booking: updates });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiCall('deleteBooking', 'POST', { id });
  },
};

// ==================== CONTRACTS ====================

export const contractsApi = {
  getAll: async (): Promise<Contract[]> => {
    const result = await apiCall<Contract[]>('getContracts');
    return Array.isArray(result) ? result : [];
  },

  add: async (contract: Partial<Contract>): Promise<{ success: boolean; id: string; contract: Contract }> => {
    return apiCall('addContract', 'POST', { contract });
  },

  update: async (id: string, updates: Partial<Contract>): Promise<{ success: boolean }> => {
    return apiCall('updateContract', 'POST', { id, contract: updates });
  },

  sign: async (id: string, signatureData: string): Promise<{ success: boolean }> => {
    return apiCall('signContract', 'POST', { id, signature: signatureData });
  },
};

// ==================== INVOICES ====================

export const invoicesApi = {
  getAll: async (): Promise<Invoice[]> => {
    const result = await apiCall<Invoice[]>('getInvoices');
    return Array.isArray(result) ? result : [];
  },

  add: async (invoice: Partial<Invoice>): Promise<{ success: boolean; id: string; invoiceNumber: string; invoice: Invoice }> => {
    return apiCall('addInvoice', 'POST', { invoice });
  },

  update: async (id: string, updates: Partial<Invoice>): Promise<{ success: boolean }> => {
    return apiCall('updateInvoice', 'POST', { id, invoice: updates });
  },

  recordPayment: async (invoiceId: string, payment: Omit<Payment, 'id' | 'invoiceId' | 'createdAt'>): Promise<{ success: boolean }> => {
    return apiCall('recordPayment', 'POST', { invoiceId, payment });
  },
};

// ==================== TASKS ====================

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const result = await apiCall<Task[]>('getTasks');
    return Array.isArray(result) ? result : [];
  },

  add: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<{ success: boolean; id: string; task: Task }> => {
    return apiCall('addTask', 'POST', { task });
  },

  update: async (id: string, updates: Partial<Task>): Promise<{ success: boolean }> => {
    return apiCall('updateTask', 'POST', { id, task: updates });
  },

  updateStatus: async (id: string, status: string): Promise<{ success: boolean }> => {
    return apiCall('updateTaskStatus', 'POST', { id, status });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiCall('deleteTask', 'POST', { id });
  },
};

// ==================== USERS ====================

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const result = await apiCall<User[]>('getUsers');
    return Array.isArray(result) ? result : [];
  },
};

// ==================== DASHBOARD ====================

export const dashboardApi = {
  getStats: async (): Promise<Record<string, unknown>> => {
    return apiCall('getDashboardStats');
  },
};

// ==================== SETTINGS ====================

export const settingsApi = {
  get: async (): Promise<Record<string, unknown>> => {
    return apiCall('getSettings');
  },

  update: async (settings: Record<string, unknown>): Promise<{ success: boolean }> => {
    return apiCall('updateSettings', 'POST', { settings });
  },
};

// ==================== FILE UPLOAD ====================

export const fileApi = {
  upload: async (fileName: string, base64Data: string, mimeType: string, folderId?: string): Promise<{ success: boolean; fileUrl: string; fileId: string }> => {
    return apiCall('uploadFile', 'POST', { fileName, base64Data, mimeType, folderId });
  },
};
