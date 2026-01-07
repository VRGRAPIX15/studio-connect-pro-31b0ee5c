import { useState, useCallback, useMemo, useEffect } from 'react';
import { Contract, ContractStatus } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

export interface ContractFilters {
  status?: ContractStatus;
  eventType?: string;
  search?: string;
}

export interface ContractStats {
  total: number;
  draft: number;
  sent: number;
  signed: number;
  expired: number;
}

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ContractFilters>({});

  // Fetch contracts from API
  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getContracts`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const contractsWithDates = data.map((c: any) => ({
          id: c.Id,
          contractNumber: c.ContractNumber,
          bookingId: c.BookingId || undefined,
          clientId: c.ClientId,
          clientName: c.ClientName,
          clientEmail: c.ClientEmail,
          templateId: c.TemplateId,
          eventType: c.EventType,
          eventDate: c.EventDate ? new Date(c.EventDate) : undefined,
          venue: c.Venue,
          packageName: c.PackageName,
          totalAmount: Number(c.TotalAmount) || 0,
          content: c.Content,
          terms: c.Terms,
          status: c.Status as ContractStatus,
          sentAt: c.SentAt ? new Date(c.SentAt) : undefined,
          signedAt: c.SignedAt ? new Date(c.SignedAt) : undefined,
          expiresAt: c.ExpiresAt ? new Date(c.ExpiresAt) : undefined,
          signatureUrl: c.SignatureUrl,
          signerName: c.SignerName,
          signerIp: c.SignerIp,
          createdAt: new Date(c.CreatedAt),
          updatedAt: new Date(c.UpdatedAt),
        }));
        setContracts(contractsWithDates);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      // Don't show error toast on initial load - API might not be configured
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const stats = useMemo((): ContractStats => ({
    total: contracts.length,
    draft: contracts.filter(c => c.status === 'draft').length,
    sent: contracts.filter(c => c.status === 'sent').length,
    signed: contracts.filter(c => c.status === 'signed').length,
    expired: contracts.filter(c => c.status === 'expired').length,
  }), [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      if (filters.status && contract.status !== filters.status) return false;
      if (filters.eventType && contract.eventType !== filters.eventType) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          contract.clientName.toLowerCase().includes(search) ||
          contract.contractNumber.toLowerCase().includes(search) ||
          contract.packageName.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [contracts, filters]);

  const getContract = useCallback((id: string) => {
    return contracts.find(c => c.id === id);
  }, [contracts]);

  const createContract = useCallback(async (contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addContract',
          contract: {
            BookingId: contract.bookingId,
            ClientId: contract.clientId,
            ClientName: contract.clientName,
            ClientEmail: contract.clientEmail,
            TemplateId: contract.templateId,
            EventType: contract.eventType,
            EventDate: contract.eventDate?.toISOString(),
            Venue: contract.venue,
            PackageName: contract.packageName,
            TotalAmount: contract.totalAmount,
            Content: contract.content,
            Terms: contract.terms,
            Status: contract.status,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Contract created successfully');
        fetchContracts();
        return result.contract;
      } else {
        toast.error(result.error || 'Failed to create contract');
        return null;
      }
    } catch (error) {
      console.error('Error adding contract:', error);
      toast.error('Failed to create contract');
      return null;
    }
  }, [fetchContracts]);

  const updateContract = useCallback(async (id: string, updates: Partial<Contract>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateContract',
          id,
          contract: {
            Status: updates.status,
            SentAt: updates.sentAt?.toISOString(),
            SignedAt: updates.signedAt?.toISOString(),
            ExpiresAt: updates.expiresAt?.toISOString(),
            SignatureUrl: updates.signatureUrl,
            SignerName: updates.signerName,
            SignerIp: updates.signerIp,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchContracts();
      } else {
        toast.error(result.error || 'Failed to update contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('Failed to update contract');
    }
  }, [fetchContracts]);

  const sendContract = useCallback(async (id: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await updateContract(id, {
      status: 'sent',
      sentAt: new Date(),
      expiresAt,
    });
    toast.success('Contract sent for signature');
  }, [updateContract]);

  const signContract = useCallback(async (id: string, signatureUrl: string, signerName: string, signerIp?: string) => {
    await updateContract(id, {
      status: 'signed',
      signedAt: new Date(),
      signatureUrl,
      signerName,
      signerIp,
    });
    toast.success('Contract signed successfully');
  }, [updateContract]);

  const cancelContract = useCallback(async (id: string) => {
    await updateContract(id, { status: 'cancelled' });
    toast.success('Contract cancelled');
  }, [updateContract]);

  const deleteContract = useCallback(async (id: string) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteContract', id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Contract deleted');
        fetchContracts();
      } else {
        toast.error(result.error || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Failed to delete contract');
    }
  }, [fetchContracts]);

  return {
    contracts: filteredContracts,
    allContracts: contracts,
    isLoading,
    stats,
    filters,
    setFilters,
    getContract,
    createContract,
    updateContract,
    sendContract,
    signContract,
    cancelContract,
    deleteContract,
    refetch: fetchContracts,
  };
}
