import { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/useClients';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientCard } from '@/components/clients/ClientCard';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { ClientDetailSheet } from '@/components/clients/ClientDetailSheet';
import { Client } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Clients() {
  const { clients, isLoading, addClient, updateClient, deleteClient, getClientStats } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const stats = getClientStats();

  // Filter clients
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.phone.includes(searchQuery) ||
      client.email?.toLowerCase().includes(query)
    );
  });

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setDetailSheetOpen(true);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Client Database</h1>
          <p className="text-muted-foreground">
            {stats.totalClients} clients • {stats.totalBookings} bookings • {formatCurrency(stats.totalRevenue)} revenue
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalClients}</p>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/50">
          <p className="text-sm text-muted-foreground">Avg. Spend</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.averageSpend)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClientTable
              clients={filteredClients}
              onClientClick={handleClientClick}
              onDelete={deleteClient}
            />
          )}
        </TabsContent>

        <TabsContent value="cards">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Users className="h-12 w-12 mb-4 opacity-50" />
              <p>No clients found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onClick={() => handleClientClick(client)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Client Dialog */}
      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addClient}
      />

      {/* Client Detail Sheet */}
      <ClientDetailSheet
        client={selectedClient}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onUpdate={updateClient}
        onDelete={deleteClient}
      />
    </div>
  );
}
