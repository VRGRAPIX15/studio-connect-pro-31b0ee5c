import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Package, 
  IndianRupee,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SignatureCanvas } from '@/components/contracts/SignatureCanvas';
import { ContractPreview } from '@/components/contracts/ContractPreview';
import { Contract } from '@/types';
import { demoContracts } from '@/data/demoData';
import { format } from 'date-fns';
import { toast } from 'sonner';
import logoFull from '@/assets/logo-full.png';

export default function ContractSign() {
  const { contractId } = useParams<{ contractId: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Simulate fetching contract
    const found = demoContracts.find(c => c.id === contractId);
    if (found) {
      setContract(found);
      setSignerName(found.clientName);
    }
    setLoading(false);
  }, [contractId]);

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

  const handleSubmit = async () => {
    if (!signature) {
      toast.error('Please provide your signature');
      return;
    }
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    if (!signerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSigned(true);
    setSubmitting(false);
    toast.success('Contract signed successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading contract...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
            <p className="text-muted-foreground">
              This contract link may have expired or is invalid.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (contract.status === 'signed' || signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Contract Signed!</h2>
              <p className="text-muted-foreground mb-4">
                Thank you for signing the contract. You will receive a copy via email.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-left">
                <p><strong>Contract:</strong> {contract.contractNumber}</p>
                <p><strong>Event:</strong> {eventTypeLabels[contract.eventType]}</p>
                <p><strong>Date:</strong> {format(new Date(contract.eventDate), 'PPP')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (contract.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Expired</h2>
            <p className="text-muted-foreground">
              This contract has expired. Please contact Varnika Visuals for a new contract.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (contract.status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Cancelled</h2>
            <p className="text-muted-foreground">
              This contract has been cancelled and is no longer valid.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoFull} alt="Varnika Visuals" className="h-10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            Secure Signing
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contract Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <ContractPreview contract={contract} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Signing Panel */}
          <div className="space-y-4">
            {/* Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{eventTypeLabels[contract.eventType]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(contract.eventDate), 'PPP')}</span>
                </div>
                {contract.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{contract.venue}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{contract.packageName}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    <span>Total Amount</span>
                  </div>
                  <span>{formatCurrency(contract.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Signature Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sign Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Full Name</Label>
                  <Input
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Signature</Label>
                  <SignatureCanvas onSignatureChange={setSignature} />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    I have read and agree to the terms and conditions outlined in this contract
                  </label>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!signature || !acceptedTerms || !signerName.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Signing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sign Contract
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing, you agree to the legally binding terms of this contract.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-8">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Varnika Visuals & SD Event Avenue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
