import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadStatus, LeadSource } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leads from API
  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getLeads`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const leadsWithDates = data.map((lead: any) => ({
          id: lead.Id,
          name: lead.Name,
          phone: lead.Phone,
          email: lead.Email || undefined,
          source: lead.Source as LeadSource,
          status: lead.Status as LeadStatus,
          eventType: lead.EventType || undefined,
          eventDate: lead.EventDate ? new Date(lead.EventDate) : undefined,
          budget: lead.Budget ? Number(lead.Budget) : undefined,
          notes: lead.Notes || undefined,
          assignedTo: lead.AssignedTo || undefined,
          createdAt: new Date(lead.CreatedAt),
          updatedAt: new Date(lead.UpdatedAt),
          followUpDate: lead.FollowUpDate ? new Date(lead.FollowUpDate) : undefined,
        }));
        setLeads(leadsWithDates);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = useCallback(async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addLead',
          lead: {
            Name: leadData.name,
            Phone: leadData.phone,
            Email: leadData.email || '',
            Source: leadData.source,
            EventType: leadData.eventType || '',
            EventDate: leadData.eventDate?.toISOString() || '',
            Budget: leadData.budget || '',
            Notes: leadData.notes || '',
            AssignedTo: leadData.assignedTo || '',
            FollowUpDate: leadData.followUpDate?.toISOString() || '',
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Lead added successfully');
        fetchLeads(); // Refresh data
        return result.lead;
      } else {
        toast.error(result.error || 'Failed to add lead');
        return null;
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
      return null;
    }
  }, [fetchLeads]);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateLead',
          id,
          lead: {
            Name: updates.name,
            Phone: updates.phone,
            Email: updates.email,
            Source: updates.source,
            Status: updates.status,
            EventType: updates.eventType,
            EventDate: updates.eventDate?.toISOString(),
            Budget: updates.budget,
            Notes: updates.notes,
            AssignedTo: updates.assignedTo,
            FollowUpDate: updates.followUpDate?.toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Lead updated successfully');
        fetchLeads();
      } else {
        toast.error(result.error || 'Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  }, [fetchLeads]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteLead', id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Lead deleted successfully');
        fetchLeads();
      } else {
        toast.error(result.error || 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  }, [fetchLeads]);

  const updateLeadStatus = useCallback(async (id: string, status: LeadStatus) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateLeadStatus', id, status }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Lead status updated');
        fetchLeads();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  }, [fetchLeads]);

  const getLeadsByStatus = useCallback((status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  }, [leads]);

  const getLeadsBySource = useCallback((source: LeadSource) => {
    return leads.filter(lead => lead.source === source);
  }, [leads]);

  const searchLeads = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(lowerQuery) ||
      lead.phone.includes(query) ||
      lead.email?.toLowerCase().includes(lowerQuery)
    );
  }, [leads]);

  const getLeadStats = useCallback(() => {
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      quoted: leads.filter(l => l.status === 'quoted').length,
      converted: leads.filter(l => l.status === 'converted').length,
      lost: leads.filter(l => l.status === 'lost').length,
    };
  }, [leads]);

  return {
    leads,
    isLoading,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    getLeadsByStatus,
    getLeadsBySource,
    searchLeads,
    getLeadStats,
    refetch: fetchLeads,
  };
}
