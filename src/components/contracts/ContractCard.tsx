import { Contract } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Send, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface ContractCardProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  onSend: (contract: Contract) => void;
  onDownload: (contract: Contract) => void;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: 'Draft', variant: 'secondary', icon: <FileText className="h-3 w-3" /> },
  sent: { label: 'Pending Signature', variant: 'default', icon: <Clock className="h-3 w-3" /> },
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
  passport_photo: 'Passport Photo',
  portfolio: 'Portfolio',
  product_shoot: 'Product Shoot',
  other: 'Other',
};

export function ContractCard({ contract, onView, onSend, onDownload }: ContractCardProps) {
  const status = statusConfig[contract.status];
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-mono">
                {contract.contractNumber}
              </p>
              <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {contract.clientName}
              </h3>
            </div>
            <Badge 
              variant={status.variant}
              className={`gap-1 ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : ''}`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{eventTypeLabels[contract.eventType]} - {contract.packageName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(contract.eventDate), 'PPP')}</span>
            </div>
            {contract.venue && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{contract.venue}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-semibold">{formatCurrency(contract.totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(contract)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {contract.status === 'draft' && (
              <Button size="sm" className="flex-1" onClick={() => onSend(contract)}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            )}
            {contract.status === 'signed' && (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onDownload(contract)}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
