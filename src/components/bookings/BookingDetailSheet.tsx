import { format } from 'date-fns';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  FileText, 
  IndianRupee,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking, BookingStatus, EventType } from '@/types';
import { teamMembers, demoClients } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface BookingDetailSheetProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: BookingStatus) => void;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  inquiry: { label: 'Inquiry', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  confirmed: { label: 'Confirmed', className: 'bg-success/10 text-success border-success/20' },
  in_progress: { label: 'In Progress', className: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completed', className: 'bg-primary/10 text-primary border-primary/20' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const eventTypeLabels: Record<EventType, string> = {
  wedding: 'Wedding',
  engagement: 'Engagement',
  baby_shower: 'Baby Shower',
  birthday: 'Birthday',
  corporate: 'Corporate',
  passport_photo: 'Passport Photo',
  portfolio: 'Portfolio',
  product_shoot: 'Product Shoot',
  other: 'Other',
};

export function BookingDetailSheet({ booking, open, onOpenChange, onStatusChange }: BookingDetailSheetProps) {
  if (!booking) return null;

  const status = statusConfig[booking.status];
  const client = demoClients.find(c => c.id === booking.clientId);
  const assignedMembers = teamMembers.filter(m => booking.assignedTeam.includes(m.id));
  const paymentProgress = (booking.advancePaid / booking.totalAmount) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl">{booking.clientName}</SheetTitle>
            <Badge variant="outline" className={cn(status.className)}>
              {status.label}
            </Badge>
          </div>
          <p className="text-primary font-medium">
            {eventTypeLabels[booking.eventType]}
          </p>
        </SheetHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Event Details
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{format(new Date(booking.eventDate), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              {booking.eventTime && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{booking.eventTime}</span>
                </div>
              )}
              {booking.venue && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{booking.venue}</span>
                </div>
              )}
              {booking.package && (
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{booking.package}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Client Contact */}
          {client && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Client Contact
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{client.phone}</span>
                    <Button variant="outline" size="sm" className="ml-auto h-7 text-xs">
                      Call
                    </Button>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{client.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Payment Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Payment Summary
            </h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Advance Paid</span>
                <span className="text-success font-medium">₹{booking.advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance Due</span>
                <span className={cn(
                  'font-semibold',
                  booking.balanceDue > 0 ? 'text-warning' : 'text-success'
                )}>
                  ₹{booking.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="text-muted-foreground">{paymentProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      paymentProgress >= 100 ? 'bg-success' : 'bg-primary'
                    )}
                    style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assigned Team */}
          {assignedMembers.length > 0 && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Assigned Team
                </h4>
                <div className="space-y-2">
                  {assignedMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Notes */}
          {booking.notes && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Notes
                </h4>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {booking.status === 'inquiry' && onStatusChange && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => onStatusChange(booking.id, 'confirmed')}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm
                </Button>
              )}
              {booking.status === 'confirmed' && onStatusChange && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => onStatusChange(booking.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
