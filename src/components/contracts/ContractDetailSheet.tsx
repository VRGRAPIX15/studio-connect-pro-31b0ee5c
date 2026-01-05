import { Contract } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Send, 
  Download, 
  XCircle,
  CheckCircle,
  Clock,
  User,
  Package,
  IndianRupee,
  Copy,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ContractDetailSheetProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (contract: Contract) => void;
  onDownload: (contract: Contract) => void;
  onCancel: (contract: Contract) => void;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; color: string }> = {
  draft: { label: 'Draft', variant: 'secondary', icon: <FileText className="h-4 w-4" />, color: 'text-muted-foreground' },
  sent: { label: 'Awaiting Signature', variant: 'default', icon: <Clock className="h-4 w-4" />, color: 'text-blue-600' },
  signed: { label: 'Signed', variant: 'outline', icon: <CheckCircle className="h-4 w-4" />, color: 'text-emerald-600' },
  expired: { label: 'Expired', variant: 'destructive', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-destructive' },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: <XCircle className="h-4 w-4" />, color: 'text-destructive' },
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

export function ContractDetailSheet({ 
  contract, 
  open, 
  onOpenChange, 
  onSend, 
  onDownload, 
  onCancel 
}: ContractDetailSheetProps) {
  if (!contract) return null;

  const status = statusConfig[contract.status];
  const signLink = `${window.location.origin}/sign/${contract.id}`;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const copySignLink = () => {
    navigator.clipboard.writeText(signLink);
    toast.success('Signing link copied to clipboard');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-mono">{contract.contractNumber}</p>
              <SheetTitle className="text-xl font-display">{contract.clientName}</SheetTitle>
            </div>
            <Badge 
              variant={status.variant}
              className={`gap-1 ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : ''}`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Event Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Event Details
              </h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Type</p>
                    <p className="font-medium">{eventTypeLabels[contract.eventType]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-medium">{format(new Date(contract.eventDate), 'PPP')}</p>
                  </div>
                </div>
                {contract.venue && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{contract.venue}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Package</p>
                    <p className="font-medium">{contract.packageName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IndianRupee className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">{formatCurrency(contract.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Client Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Client Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{contract.clientName}</p>
                  {contract.clientEmail && (
                    <p className="text-sm text-muted-foreground">{contract.clientEmail}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(contract.createdAt), 'PPp')}</span>
                </div>
                {contract.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sent</span>
                    <span>{format(new Date(contract.sentAt), 'PPp')}</span>
                  </div>
                )}
                {contract.signedAt && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Signed</span>
                    <span>{format(new Date(contract.signedAt), 'PPp')}</span>
                  </div>
                )}
                {contract.expiresAt && contract.status === 'sent' && (
                  <div className="flex justify-between text-amber-600">
                    <span>Expires</span>
                    <span>{format(new Date(contract.expiresAt), 'PPp')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Signature */}
            {contract.signatureUrl && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Signature
                  </h3>
                  <div className="bg-white border rounded-lg p-4">
                    <img 
                      src={contract.signatureUrl} 
                      alt="Client Signature" 
                      className="max-h-20 mx-auto"
                    />
                    {contract.signerName && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Signed by {contract.signerName}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Signing Link */}
            {contract.status === 'sent' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Signing Link
                  </h3>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                      {signLink}
                    </code>
                    <Button variant="outline" size="icon" onClick={copySignLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={signLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Contract Content Preview */}
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Contract Preview
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {contract.content}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t mt-4">
          {contract.status === 'draft' && (
            <Button className="flex-1" onClick={() => onSend(contract)}>
              <Send className="h-4 w-4 mr-2" />
              Send for Signature
            </Button>
          )}
          {contract.status === 'signed' && (
            <Button variant="outline" className="flex-1" onClick={() => onDownload(contract)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
          {(contract.status === 'draft' || contract.status === 'sent') && (
            <Button 
              variant="outline" 
              className="text-destructive hover:bg-destructive/10"
              onClick={() => onCancel(contract)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
