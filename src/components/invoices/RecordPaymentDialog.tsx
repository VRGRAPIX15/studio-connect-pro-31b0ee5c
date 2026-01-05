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
import { Payment, PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/invoicePdf';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payment: Omit<Payment, 'id' | 'invoiceId' | 'createdAt'>) => void;
  balanceDue: number;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'razorpay', label: 'Razorpay' },
];

export default function RecordPaymentDialog({
  open,
  onClose,
  onSave,
  balanceDue,
}: RecordPaymentDialogProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(balanceDue);
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > balanceDue) {
      toast.error('Amount cannot exceed balance due');
      return;
    }

    onSave({
      amount,
      method,
      reference,
      notes,
      receivedBy: user?.id || 'user-1',
    });

    toast.success('Payment recorded successfully');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setAmount(balanceDue);
    setMethod('upi');
    setReference('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Record Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Balance Due</p>
            <p className="text-2xl font-semibold text-destructive">
              {formatCurrency(balanceDue)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Amount Received *</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={balanceDue}
              min={1}
              required
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(balanceDue)}
              >
                Full Amount
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(Math.round(balanceDue / 2))}
              >
                50%
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    {pm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reference / Transaction ID</Label>
            <Input
              placeholder="e.g., UPI-123456789"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
