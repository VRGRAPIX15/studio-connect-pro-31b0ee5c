import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadStatus, LeadSource, EventType } from '@/types';
import { demoLeads } from '@/data/demoData';
import { toast } from 'sonner';

const STORAGE_KEY = 'studio-crm-leads';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load leads from localStorage or use demo data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const leadsWithDates = parsed.map((lead: Lead) => ({
        ...lead,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt),
        eventDate: lead.eventDate ? new Date(lead.eventDate) : undefined,
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : undefined,
      }));
      setLeads(leadsWithDates);
    } else {
      setLeads(demoLeads);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLeads));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever leads change
  const saveLeads = useCallback((newLeads: Lead[]) => {
    setLeads(newLeads);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLeads));
  }, []);

  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedLeads = [newLead, ...leads];
    saveLeads(updatedLeads);
    toast.success('Lead added successfully');
    return newLead;
  }, [leads, saveLeads]);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    const updatedLeads = leads.map(lead =>
      lead.id === id
        ? { ...lead, ...updates, updatedAt: new Date() }
        : lead
    );
    saveLeads(updatedLeads);
    toast.success('Lead updated successfully');
  }, [leads, saveLeads]);

  const deleteLead = useCallback((id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    saveLeads(updatedLeads);
    toast.success('Lead deleted successfully');
  }, [leads, saveLeads]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    updateLead(id, { status });
  }, [updateLead]);

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
  };
}
