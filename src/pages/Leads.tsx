import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLeads } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List,
  Filter
} from 'lucide-react';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';
import { LeadPipeline } from '@/components/leads/LeadPipeline';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadDetailSheet } from '@/components/leads/LeadDetailSheet';
import type { Lead } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    addLead(leadData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    updateLead(id, updates);
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id);
    setSelectedLead(null);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Lead Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px] bg-background border-border">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="walk-in">Walk-in</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={view === 'pipeline' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('pipeline')}
              className={view === 'pipeline' ? 'bg-primary' : ''}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('table')}
              className={view === 'table' ? 'bg-primary' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Lead Count */}
      <motion.div variants={itemVariants}>
        <p className="text-sm text-muted-foreground">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants}>
        {view === 'pipeline' ? (
          <LeadPipeline 
            leads={filteredLeads} 
            onLeadClick={setSelectedLead}
            onStatusChange={(id, status) => handleUpdateLead(id, { status })}
          />
        ) : (
          <LeadTable 
            leads={filteredLeads} 
            onLeadClick={setSelectedLead}
            onDelete={handleDeleteLead}
          />
        )}
      </motion.div>

      {/* Add Lead Dialog */}
      <AddLeadDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddLead}
      />

      {/* Lead Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        onUpdate={handleUpdateLead}
        onDelete={handleDeleteLead}
      />
    </motion.div>
  );
}
