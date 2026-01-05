import { Contract } from '@/types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Send, 
  Download, 
  XCircle,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface ContractTableProps {
  contracts: Contract[];
  onView: (contract: Contract) => void;
  onSend: (contract: Contract) => void;
  onDownload: (contract: Contract) => void;
  onCancel: (contract: Contract) => void;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: 'Draft', variant: 'secondary', icon: <FileText className="h-3 w-3" /> },
  sent: { label: 'Pending', variant: 'default', icon: <Clock className="h-3 w-3" /> },
  signed: { label: 'Signed', variant: 'outline', icon: <CheckCircle className="h-3 w-3" /> },
  expired: { label: 'Expired', variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
};

const eventTypeLabels: Record<string, string> = {
  wedding: 'Wedding',
  baby_shower: 'Baby Shower',
  birthday: 'Birthday',
  engagement: 'Engagement',
  corporate: 'Corporate',
  passport_photo: 'Passport',
  portfolio: 'Portfolio',
  product_shoot: 'Product',
  other: 'Other',
};

export function ContractTable({ contracts, onView, onSend, onDownload, onCancel }: ContractTableProps) {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract, index) => {
            const status = statusConfig[contract.status];
            return (
              <motion.tr
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group hover:bg-muted/50 cursor-pointer"
                onClick={() => onView(contract)}
              >
                <TableCell className="font-mono text-sm">
                  {contract.contractNumber}
                </TableCell>
                <TableCell className="font-medium">{contract.clientName}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {eventTypeLabels[contract.eventType]}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(contract.eventDate), 'PP')}</TableCell>
                <TableCell>{formatCurrency(contract.totalAmount)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={status.variant}
                    className={`gap-1 ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : ''}`}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(contract); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {contract.status === 'draft' && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSend(contract); }}>
                          <Send className="h-4 w-4 mr-2" />
                          Send for Signature
                        </DropdownMenuItem>
                      )}
                      {contract.status === 'signed' && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(contract); }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                      )}
                      {(contract.status === 'draft' || contract.status === 'sent') && (
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); onCancel(contract); }}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Contract
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            );
          })}
          {contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No contracts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
