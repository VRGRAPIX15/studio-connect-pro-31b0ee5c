import { useState, useMemo } from 'react';
import { Search, UserPlus, User, Phone, Mail, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PassportCustomer } from '@/types/passportBusiness';

interface CustomerSelectorProps {
  customers: PassportCustomer[];
  selectedCustomer: PassportCustomer | null;
  onSelect: (customer: PassportCustomer) => void;
  onAddCustomer: (customer: Omit<PassportCustomer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export function CustomerSelector({
  customers,
  selectedCustomer,
  onSelect,
  onAddCustomer,
  isLoading
}: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Name and phone are required');
      return;
    }

    try {
      await onAddCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        notes: newCustomer.notes,
        totalOrders: 0,
        totalSpent: 0
      });
      setNewCustomer({ name: '', phone: '', email: '', notes: '' });
      setIsAddDialogOpen(false);
      toast.success('Customer added successfully!');
    } catch (error) {
      toast.error('Failed to add customer');
    }
  };

  return (
    <div className="space-y-3">
      {/* Search and Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
              <Button onClick={handleAddCustomer} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer List */}
      <ScrollArea className="h-[200px] pr-2">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading customers...
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => onSelect(customer)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedCustomer?.id === customer.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {customer.name}
                      {selectedCustomer?.id === customer.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </span>
                      {customer.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{customer.totalOrders} orders</div>
                    <div>₹{customer.totalSpent.toLocaleString()}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No customers found</p>
            <p className="text-xs">Add a new customer to get started</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
