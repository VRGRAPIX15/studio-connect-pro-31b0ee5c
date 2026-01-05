import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Grid3X3, 
  List, 
  Search,
  Filter,
  Clock,
  CheckCircle,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractCard } from '@/components/contracts/ContractCard';
import { ContractTable } from '@/components/contracts/ContractTable';
import { ContractDetailSheet } from '@/components/contracts/ContractDetailSheet';
import { CreateContractDialog } from '@/components/contracts/CreateContractDialog';
import { useContracts } from '@/hooks/useContracts';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { useBookings } from '@/hooks/useBookings';
import { Contract, ContractStatus } from '@/types';
import { downloadContractPdf } from '@/lib/contractPdf';
import { toast } from 'sonner';

export default function Contracts() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { 
    contracts, 
    stats, 
    filters, 
    setFilters, 
    sendContract, 
    cancelContract,
    createContract 
  } = useContracts();
  
  const { templates, fillTemplate } = useContractTemplates();
  const { bookings } = useBookings();

  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailSheetOpen(true);
  };

  const handleSend = (contract: Contract) => {
    sendContract(contract.id);
    toast.success('Contract sent for signature');
    setDetailSheetOpen(false);
  };

  const handleDownload = (contract: Contract) => {
    downloadContractPdf(contract);
  };

  const handleCancel = (contract: Contract) => {
    cancelContract(contract.id);
    toast.success('Contract cancelled');
    setDetailSheetOpen(false);
  };

  const handleCreate = (contractData: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => {
    createContract(contractData);
  };

  const statCards = [
    { label: 'Total Contracts', value: stats.total, icon: FileText, color: 'text-primary' },
    { label: 'Drafts', value: stats.draft, icon: FileText, color: 'text-muted-foreground' },
    { label: 'Pending Signature', value: stats.sent, icon: Clock, color: 'text-blue-600' },
    { label: 'Signed', value: stats.signed, icon: CheckCircle, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage contracts and digital signatures</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value as ContractStatus })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Pending</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
          <TabsList>
            <TabsTrigger value="grid">
              <Grid3X3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={handleView}
              onSend={handleSend}
              onDownload={handleDownload}
            />
          ))}
          {contracts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No contracts found</h3>
              <p className="text-muted-foreground mb-4">Create your first contract to get started</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ContractTable
          contracts={contracts}
          onView={handleView}
          onSend={handleSend}
          onDownload={handleDownload}
          onCancel={handleCancel}
        />
      )}

      {/* Detail Sheet */}
      <ContractDetailSheet
        contract={selectedContract}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onSend={handleSend}
        onDownload={handleDownload}
        onCancel={handleCancel}
      />

      {/* Create Dialog */}
      <CreateContractDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        bookings={bookings}
        templates={templates}
        onFillTemplate={fillTemplate}
        onCreate={handleCreate}
      />
    </div>
  );
}
