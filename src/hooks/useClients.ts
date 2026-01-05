import { useState, useEffect, useCallback } from 'react';
import { Client, LeadSource } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clients from API
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getClients`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const clientsWithDates = data.map((client: any) => ({
          id: client.Id,
          name: client.Name,
          phone: client.Phone,
          email: client.Email || undefined,
          address: client.Address || undefined,
          source: (client.Source || 'walkin') as LeadSource,
          totalBookings: Number(client.TotalBookings) || 0,
          totalSpent: Number(client.TotalSpent) || 0,
          notes: client.Notes || undefined,
          createdAt: new Date(client.CreatedAt),
          lastEventDate: client.LastEventDate ? new Date(client.LastEventDate) : undefined,
        }));
        setClients(clientsWithDates);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addClient',
          client: {
            Name: clientData.name,
            Phone: clientData.phone,
            Email: clientData.email || '',
            Address: clientData.address || '',
            Source: clientData.source || 'walkin',
            Notes: clientData.notes || '',
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Client added successfully');
        fetchClients();
        return result.client;
      } else {
        toast.error(result.error || 'Failed to add client');
        return null;
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      return null;
    }
  }, [fetchClients]);

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateClient',
          id,
          client: {
            Name: updates.name,
            Phone: updates.phone,
            Email: updates.email,
            Address: updates.address,
            Source: updates.source,
            Notes: updates.notes,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Client updated successfully');
        fetchClients();
      } else {
        toast.error(result.error || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  }, [fetchClients]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteClient', id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Client deleted successfully');
        fetchClients();
      } else {
        toast.error(result.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  }, [fetchClients]);

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
    refetch: fetchClients,
  };
}
