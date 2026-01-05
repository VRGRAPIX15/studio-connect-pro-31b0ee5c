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

  const createContract = useCallback((contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: `contract-${Date.now()}`,
      contractNumber: `VV-CON-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContracts(prev => [newContract, ...prev]);
    return newContract;
  }, [contracts.length]);

  const updateContract = useCallback((id: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(contract =>
      contract.id === id
        ? { ...contract, ...updates, updatedAt: new Date() }
        : contract
    ));
  }, []);

  const sendContract = useCallback((id: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    updateContract(id, {
      status: 'sent',
      sentAt: new Date(),
      expiresAt,
    });
  }, [updateContract]);

  const signContract = useCallback((id: string, signatureUrl: string, signerName: string, signerIp?: string) => {
    updateContract(id, {
      status: 'signed',
      signedAt: new Date(),
      signatureUrl,
      signerName,
      signerIp,
    });
  }, [updateContract]);

  const cancelContract = useCallback((id: string) => {
    updateContract(id, { status: 'cancelled' });
  }, [updateContract]);

  const deleteContract = useCallback((id: string) => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
  }, []);

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
