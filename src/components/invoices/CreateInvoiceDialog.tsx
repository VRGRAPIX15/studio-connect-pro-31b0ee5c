import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Invoice, InvoiceItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { demoBookings, demoClients } from '@/data/demoData';
import { formatCurrency } from '@/lib/invoicePdf';
import { toast } from 'sonner';

interface CreateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'payments'>) => void;
  generateInvoiceNumber: () => string;
}

export default function CreateInvoiceDialog({
  open,
  onClose,
  onSave,
  generateInvoiceNumber,
}: CreateInvoiceDialogProps) {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedBooking, setSelectedBooking] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [includeGST, setIncludeGST] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index][field] = Number(value);
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    } else {
      (newItems[index] as any)[field] = value;
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = includeGST ? subtotal * 0.18 : 0;
  const totalAmount = subtotal + taxAmount - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const client = demoClients.find((c) => c.id === selectedClient);
    if (!client || !dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    if (items.some((item) => !item.description || item.amount <= 0)) {
      toast.error('Please add valid line items');
      return;
    }

    const invoice: Omit<Invoice, 'id' | 'createdAt' | 'payments'> = {
      invoiceNumber: generateInvoiceNumber(),
      bookingId: selectedBooking || '',
      clientId: client.id,
      clientName: client.name,
      items: items.map((item, index) => ({ ...item, id: `item-${index}` })),
      subtotal,
      taxAmount,
      discount,
      totalAmount,
      paidAmount: 0,
      balanceDue: totalAmount,
      status: 'pending',
      dueDate: new Date(dueDate),
    };

    onSave(invoice);
    toast.success('Invoice created successfully');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedBooking('');
    setDueDate('');
    setIncludeGST(false);
    setDiscount(0);
    setItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client & Booking */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {demoClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Link to Booking (Optional)</Label>
              <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {demoBookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.clientName} - {booking.eventType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-20"
                    min={1}
                  />
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    className="w-28"
                    min={0}
                  />
                  <div className="w-28 py-2 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* GST & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="gst"
                checked={includeGST}
                onCheckedChange={setIncludeGST}
              />
              <Label htmlFor="gst">Include GST (18%)</Label>
            </div>
            <div className="space-y-2">
              <Label>Discount (₹)</Label>
              <Input
                type="number"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {includeGST && (
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
