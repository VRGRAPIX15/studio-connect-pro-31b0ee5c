import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  SortAsc
} from 'lucide-react';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientDetailSheet } from '@/components/clients/ClientDetailSheet';
import type { Client } from '@/types';

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

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'bookings':
          return b.totalBookings - a.totalBookings;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });

  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalBookings' | 'totalSpent'>) => {
    addClient(clientData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateClient = (id: string, updates: Partial<Client>) => {
    updateClient(id, updates);
    if (selectedClient?.id === id) {
      setSelectedClient({ ...selectedClient, ...updates });
    }
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    setSelectedClient(null);
  };

  // Calculate stats
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgBookings = clients.length > 0 
    ? Math.round(clients.reduce((sum, c) => sum + c.totalBookings, 0) / clients.length * 10) / 10
    : 0;

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
            Client Database
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="text-2xl font-bold text-foreground">{totalClients}</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <p className="text-sm text-muted-foreground">Avg. Bookings</p>
          <p className="text-2xl font-bold text-foreground">{avgBookings}</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-background border-border">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="bookings">Most Bookings</SelectItem>
              <SelectItem value="spent">Highest Spent</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'bg-primary' : ''}
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

      {/* Client Count */}
      <motion.div variants={itemVariants}>
        <p className="text-sm text-muted-foreground">
          Showing {filteredClients.length} of {clients.length} clients
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants}>
        {view === 'table' ? (
          <ClientTable 
            clients={filteredClients} 
            onClientClick={setSelectedClient}
            onDelete={handleDeleteClient}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id}
                client={client}
                onClick={() => setSelectedClient(client)}
              />
            ))}
            {filteredClients.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No clients found matching your search
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Add Client Dialog */}
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddClient}
      />

      {/* Client Detail Sheet */}
      <ClientDetailSheet
        client={selectedClient}
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
        onUpdate={handleUpdateClient}
        onDelete={handleDeleteClient}
      />
    </motion.div>
  );
}
