import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MapPin, Clock, Phone, Users, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking, BookingStatus, EventType } from '@/types';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
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

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const status = statusConfig[booking.status];
  const paymentProgress = (booking.advancePaid / booking.totalAmount) * 100;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{booking.clientName}</h3>
                <Badge variant="outline" className={cn('text-[10px] shrink-0', status.className)}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-primary font-medium">
                {eventTypeLabels[booking.eventType]}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-medium text-foreground">
                {format(new Date(booking.eventDate), 'MMM d')}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(booking.eventDate), 'yyyy')}
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {booking.eventTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{booking.eventTime}</span>
              </div>
            )}
            {booking.venue && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{booking.venue}</span>
              </div>
            )}
            {booking.assignedTeam.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{booking.assignedTeam.length} team member{booking.assignedTeam.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Payment Progress */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5" />
                Payment
              </span>
              <span className="font-medium text-foreground">
                ₹{(booking.advancePaid / 1000).toFixed(0)}K / ₹{(booking.totalAmount / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  paymentProgress >= 100 ? 'bg-success' : paymentProgress > 0 ? 'bg-primary' : 'bg-muted-foreground'
                )}
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              />
            </div>
            {booking.balanceDue > 0 && (
              <p className="text-xs text-warning mt-1">
                Balance due: ₹{booking.balanceDue.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
