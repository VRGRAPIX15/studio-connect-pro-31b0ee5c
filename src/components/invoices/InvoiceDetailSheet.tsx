import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Invoice, Payment, PaymentMethod, PaymentStatus } from '@/types';
import { format } from 'date-fns';
import { formatCurrency, downloadInvoicePDF } from '@/lib/invoicePdf';
import {
  Download,
  Printer,
  Mail,
  CreditCard,
  IndianRupee,
  Calendar,
  FileText,
  CheckCircle,
} from 'lucide-react';
import RecordPaymentDialog from './RecordPaymentDialog';

interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onRecordPayment: (invoiceId: string, payment: Omit<Payment, 'id' | 'invoiceId' | 'createdAt'>) => void;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  partial: { label: 'Partial', className: 'bg-info/10 text-info border-info/20' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success border-success/20' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-muted' },
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  razorpay: 'Razorpay',
  cheque: 'Cheque',
};

export default function InvoiceDetailSheet({
  invoice,
  open,
  onClose,
  onRecordPayment,
}: InvoiceDetailSheetProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!invoice) return null;

  const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue && invoice.status !== 'cancelled' ? statusConfig.overdue : statusConfig[invoice.status];

  const handleRecordPayment = (payment: Omit<Payment, 'id' | 'invoiceId' | 'createdAt'>) => {
    onRecordPayment(invoice.id, payment);
    setIsPaymentOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="font-display">{invoice.invoiceNumber}</SheetTitle>
              <Badge variant="outline" className={displayStatus.className}>
                {displayStatus.label}
              </Badge>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Client Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Bill To</p>
              <p className="font-semibold text-lg">{invoice.clientName}</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Invoice Date</p>
                  <p className="font-medium">{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                    {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div>
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-2">
                {invoice.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-success">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Balance Due</span>
                <span className={invoice.balanceDue > 0 ? 'text-destructive' : 'text-success'}>
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>
            </div>

            {/* Payment History */}
            {invoice.payments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Payment History</h3>
                  <div className="space-y-2">
                    {invoice.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between items-center py-2 px-3 bg-success/5 rounded-lg border border-success/20"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <div>
                            <p className="font-medium text-sm">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {paymentMethodLabels[payment.method]} • {payment.reference || 'No ref'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.createdAt), 'dd MMM yyyy')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {invoice.balanceDue > 0 && (
                <Button onClick={() => setIsPaymentOpen(true)} className="w-full gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Record Payment
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => downloadInvoicePDF(invoice)} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => downloadInvoicePDF(invoice)} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <RecordPaymentDialog
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSave={handleRecordPayment}
        balanceDue={invoice.balanceDue}
      />
    </>
  );
}
