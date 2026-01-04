import { useState, useEffect, useCallback } from 'react';
import { Client, LeadSource } from '@/types';
import { demoClients } from '@/data/demoData';
import { toast } from 'sonner';

const STORAGE_KEY = 'studio-crm-clients';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load clients from localStorage or use demo data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const clientsWithDates = parsed.map((client: Client) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        lastEventDate: client.lastEventDate ? new Date(client.lastEventDate) : undefined,
      }));
      setClients(clientsWithDates);
    } else {
      setClients(demoClients);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoClients));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever clients change
  const saveClients = useCallback((newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
  }, []);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date(),
      totalBookings: 0,
      totalSpent: 0,
    };
    const updatedClients = [newClient, ...clients];
    saveClients(updatedClients);
    toast.success('Client added successfully');
    return newClient;
  }, [clients, saveClients]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id
        ? { ...client, ...updates }
        : client
    );
    saveClients(updatedClients);
    toast.success('Client updated successfully');
  }, [clients, saveClients]);

  const deleteClient = useCallback((id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    saveClients(updatedClients);
    toast.success('Client deleted successfully');
  }, [clients, saveClients]);

  const getClientById = useCallback((id: string) => {
    return clients.find(client => client.id === id);
  }, [clients]);

  const searchClients = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      client.email?.toLowerCase().includes(lowerQuery)
    );
  }, [clients]);

  const getTopClients = useCallback((limit: number = 5) => {
    return [...clients]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }, [clients]);

  const getClientStats = useCallback(() => {
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalBookings = clients.reduce((sum, c) => sum + c.totalBookings, 0);
    return {
      totalClients: clients.length,
      totalRevenue,
      totalBookings,
      averageSpend: clients.length > 0 ? totalRevenue / clients.length : 0,
    };
  }, [clients]);

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    searchClients,
    getTopClients,
    getClientStats,
  };
}
