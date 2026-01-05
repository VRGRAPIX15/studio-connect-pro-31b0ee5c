import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invoice, PaymentStatus } from '@/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/invoicePdf';
import { Eye, Download, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadInvoicePDF } from '@/lib/invoicePdf';

interface InvoiceTableProps {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  partial: { label: 'Partial', className: 'bg-info/10 text-info border-info/20' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success border-success/20' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-muted' },
};

export default function InvoiceTable({ invoices, onSelect }: InvoiceTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();
            const status = isOverdue && invoice.status !== 'cancelled' 
              ? statusConfig.overdue 
              : statusConfig[invoice.status];

            return (
              <TableRow
                key={invoice.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSelect(invoice)}
              >
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.totalAmount)}
                </TableCell>
                <TableCell className={`text-right font-medium ${invoice.balanceDue > 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(invoice.balanceDue)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(invoice); }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadInvoicePDF(invoice); }}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
