import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Invoice, PaymentStatus } from '@/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/invoicePdf';
import { Calendar, User, FileText } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: () => void;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  partial: { label: 'Partial', className: 'bg-info/10 text-info border-info/20' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success border-success/20' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-muted' },
};

export default function InvoiceCard({ invoice, onClick }: InvoiceCardProps) {
  const status = statusConfig[invoice.status];
  const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue && invoice.status !== 'cancelled' ? statusConfig.overdue : status;

  return (
    <Card
      className="card-hover cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-sm text-muted-foreground">
              {invoice.invoiceNumber}
            </p>
            <h3 className="font-semibold mt-0.5">{invoice.clientName}</h3>
          </div>
          <Badge variant="outline" className={displayStatus.className}>
            {displayStatus.label}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-semibold text-lg">{formatCurrency(invoice.totalAmount)}</p>
            </div>
            {invoice.balanceDue > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Balance Due</p>
                <p className="font-semibold text-lg text-destructive">
                  {formatCurrency(invoice.balanceDue)}
                </p>
              </div>
            )}
          </div>
          {invoice.paidAmount > 0 && invoice.balanceDue > 0 && (
            <div className="mt-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all"
                  style={{ width: `${(invoice.paidAmount / invoice.totalAmount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((invoice.paidAmount / invoice.totalAmount) * 100)}% paid
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
