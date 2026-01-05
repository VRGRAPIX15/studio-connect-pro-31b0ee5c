import { useState } from 'react';
import { Booking, Contract, ContractTemplate } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookings: Booking[];
  templates: ContractTemplate[];
  onFillTemplate: (templateId: string, data: {
    clientName: string;
    eventDate: Date;
    venue?: string;
    packageName: string;
    totalAmount: number;
  }) => { content: string; terms: string };
  onCreate: (contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt'>) => void;
}

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

export function CreateContractDialog({
  open,
  onOpenChange,
  bookings,
  templates,
  onFillTemplate,
  onCreate,
}: CreateContractDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [clientEmail, setClientEmail] = useState('');
  const [content, setContent] = useState('');
  const [terms, setTerms] = useState('');

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const defaultTemplate = templates.find(t => t.eventType === booking.eventType) || templates[0];
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
      }
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (selectedBooking) {
      const filled = onFillTemplate(templateId, {
        clientName: selectedBooking.clientName,
        eventDate: selectedBooking.eventDate,
        venue: selectedBooking.venue,
        packageName: selectedBooking.package || 'Standard Package',
        totalAmount: selectedBooking.totalAmount,
      });
      setContent(filled.content);
      setTerms(filled.terms);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedBookingId) {
      toast.error('Please select a booking');
      return;
    }
    if (step === 2) {
      if (!selectedTemplateId) {
        toast.error('Please select a template');
        return;
      }
      if (selectedBooking) {
        const filled = onFillTemplate(selectedTemplateId, {
          clientName: selectedBooking.clientName,
          eventDate: selectedBooking.eventDate,
          venue: selectedBooking.venue,
          packageName: selectedBooking.package || 'Standard Package',
          totalAmount: selectedBooking.totalAmount,
        });
        setContent(filled.content);
        setTerms(filled.terms);
      }
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    if (!selectedBooking || !selectedTemplateId) return;

    onCreate({
      bookingId: selectedBooking.id,
      clientId: selectedBooking.clientId,
      clientName: selectedBooking.clientName,
      clientEmail: clientEmail || undefined,
      templateId: selectedTemplateId,
      eventType: selectedBooking.eventType,
      eventDate: selectedBooking.eventDate,
      venue: selectedBooking.venue,
      packageName: selectedBooking.package || 'Standard Package',
      totalAmount: selectedBooking.totalAmount,
      content,
      terms,
      status: 'draft',
    });

    toast.success('Contract created successfully');
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedBookingId('');
    setSelectedTemplateId('');
    setClientEmail('');
    setContent('');
    setTerms('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create New Contract</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className="ml-2 text-sm hidden sm:inline">
                {s === 1 && 'Select Booking'}
                {s === 2 && 'Choose Template'}
                {s === 3 && 'Review & Create'}
              </span>
              {s < 3 && <div className="w-12 sm:w-24 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Booking */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Label>Select a Booking</Label>
              <ScrollArea className="h-[300px] border rounded-lg p-2">
                <div className="space-y-2">
                  {bookings
                    .filter(b => b.status === 'confirmed' || b.status === 'inquiry')
                    .map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => handleBookingSelect(booking.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedBookingId === booking.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{booking.clientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {eventTypeLabels[booking.eventType]} • {format(new Date(booking.eventDate), 'PPP')}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatCurrency(booking.totalAmount)}
                          </Badge>
                        </div>
                        {booking.venue && (
                          <p className="text-sm text-muted-foreground mt-1">{booking.venue}</p>
                        )}
                      </div>
                    ))}
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'inquiry').length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      No bookings available for contracts
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {/* Step 2: Choose Template */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Client Email (for sending contract)</Label>
                <Input
                  type="email"
                  placeholder="client@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Contract Template</Label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {template.name}
                          {template.isDefault && (
                            <Badge variant="secondary" className="ml-2">Default</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Template Preview</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {selectedTemplate.content.substring(0, 200)}...
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <ScrollArea className="h-[350px]">
                <div className="space-y-4 pr-4">
                  <div>
                    <Label>Contract Content</Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[150px] mt-2"
                    />
                  </div>
                  <div>
                    <Label>Terms & Conditions</Label>
                    <Textarea
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <FileText className="h-4 w-4 mr-2" />
              Create Contract
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
