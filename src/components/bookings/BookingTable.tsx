import { format } from 'date-fns';
import { MapPin, Phone, Eye } from 'lucide-react';
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
import { Booking, BookingStatus, EventType } from '@/types';
import { cn } from '@/lib/utils';

interface BookingTableProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
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

export function BookingTable({ bookings, onBookingClick }: BookingTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Event</TableHead>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Venue</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onBookingClick(booking)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{booking.clientName}</p>
                      <p className="text-xs text-muted-foreground">{booking.package}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                      {eventTypeLabels[booking.eventType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{format(new Date(booking.eventDate), 'MMM d, yyyy')}</p>
                      {booking.eventTime && (
                        <p className="text-xs text-muted-foreground">{booking.eventTime}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {booking.venue ? (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground max-w-[200px]">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{booking.venue}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{(booking.totalAmount / 1000).toFixed(0)}K</p>
                      {booking.balanceDue > 0 && (
                        <p className="text-xs text-warning">Due: ₹{(booking.balanceDue / 1000).toFixed(0)}K</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(status.className)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
