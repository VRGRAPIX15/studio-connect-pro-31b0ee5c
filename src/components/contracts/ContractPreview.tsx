import { Contract } from '@/types';
import { format } from 'date-fns';

interface ContractPreviewProps {
  contract: Contract;
}

export function ContractPreview({ contract }: ContractPreviewProps) {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const eventTypeLabels: Record<string, string> = {
    wedding: 'Wedding Photography',
    baby_shower: 'Baby Shower Photography',
    birthday: 'Birthday Photography',
    engagement: 'Engagement Photography',
    corporate: 'Corporate Event Photography',
    passport_photo: 'Passport Photography',
    portfolio: 'Portfolio Photography',
    product_shoot: 'Product Photography',
    other: 'Photography Services',
  };

  return (
    <div className="bg-white text-foreground p-8 max-w-3xl mx-auto font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-6 mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wider">VARNIKA VISUALS</h1>
        <p className="text-muted-foreground mt-1">SD Event Avenue</p>
        <p className="text-sm text-muted-foreground mt-4 font-mono">{contract.contractNumber}</p>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Service Provider
          </h3>
          <p className="font-medium">Varnika Visuals & SD Event Avenue</p>
          <p className="text-sm text-muted-foreground">Hyderabad, Telangana</p>
          <p className="text-sm text-muted-foreground">contact@varnikavisuals.com</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Client
          </h3>
          <p className="font-medium">{contract.clientName}</p>
          {contract.clientEmail && (
            <p className="text-sm text-muted-foreground">{contract.clientEmail}</p>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Event Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Service:</span>
            <span className="ml-2 font-medium">{eventTypeLabels[contract.eventType]}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Event Date:</span>
            <span className="ml-2 font-medium">{format(new Date(contract.eventDate), 'PPP')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Package:</span>
            <span className="ml-2 font-medium">{contract.packageName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="ml-2 font-medium">{formatCurrency(contract.totalAmount)}</span>
          </div>
          {contract.venue && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Venue:</span>
              <span className="ml-2 font-medium">{contract.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {contract.content}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-muted/20 rounded-lg p-6 mb-8">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
          Terms & Conditions
        </h3>
        <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
          {contract.terms}
        </div>
      </div>

      {/* Signatures */}
      <div className="border-t pt-8 mt-8">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">
          Signatures
        </h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="h-16 border-b border-foreground/30 mb-2 flex items-end justify-center">
              <span className="text-muted-foreground italic">Varnika Visuals</span>
            </div>
            <p className="text-sm text-muted-foreground">Service Provider</p>
          </div>
          <div className="text-center">
            <div className="h-16 border-b border-foreground/30 mb-2 flex items-end justify-center">
              {contract.signatureUrl ? (
                <img 
                  src={contract.signatureUrl} 
                  alt="Client Signature" 
                  className="max-h-14"
                />
              ) : (
                <span className="text-muted-foreground italic">Awaiting signature</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {contract.signerName || contract.clientName}
            </p>
            {contract.signedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Signed on {format(new Date(contract.signedAt), 'PPP')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
        <p>This contract was generated by Varnika Visuals Studio CRM</p>
        <p>Generated on {format(new Date(), 'PPP')}</p>
      </div>
    </div>
  );
}
