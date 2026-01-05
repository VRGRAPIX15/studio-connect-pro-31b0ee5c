import { useState, useCallback, useMemo } from 'react';
import { Contract, ContractStatus } from '@/types';
import { demoContracts } from '@/data/demoData';

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
  const [contracts, setContracts] = useState<Contract[]>(demoContracts);
  const [filters, setFilters] = useState<ContractFilters>({});

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
  };
}
