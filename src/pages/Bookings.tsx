import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  List, 
  Filter,
  LayoutGrid
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookings } from '@/hooks/useBookings';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import { BookingCard } from '@/components/bookings/BookingCard';
import { BookingTable } from '@/components/bookings/BookingTable';
import { AddBookingDialog } from '@/components/bookings/AddBookingDialog';
import { BookingDetailSheet } from '@/components/bookings/BookingDetailSheet';
import { Booking, BookingStatus, EventType } from '@/types';
import { toast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const statusOptions: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const eventTypeOptions: { value: EventType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'baby_shower', label: 'Baby Shower' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'passport_photo', label: 'Passport Photo' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'product_shoot', label: 'Product Shoot' },
];

export default function Bookings() {
  const [view, setView] = useState<'calendar' | 'list' | 'cards'>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const { 
    bookings, 
    addBooking, 
    updateBooking, 
    getBookingsByDate,
    stats 
  } = useBookings();

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.clientName.toLowerCase().includes(query) ||
        b.venue?.toLowerCase().includes(query) ||
        b.eventType.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Event type filter
    if (eventTypeFilter !== 'all') {
      result = result.filter(b => b.eventType === eventTypeFilter);
    }

    // Date filter (for calendar view)
    if (selectedDate && view === 'calendar') {
      result = result.filter(b => isSameDay(new Date(b.eventDate), selectedDate));
    }

    // Sort by date
    result.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    return result;
  }, [bookings, searchQuery, statusFilter, eventTypeFilter, selectedDate, view]);

  const handleAddBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    addBooking(booking);
    toast({
      title: 'Booking Created',
      description: `New booking for ${booking.clientName} has been added.`,
    });
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailSheetOpen(true);
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    updateBooking(id, { status });
    toast({
      title: 'Status Updated',
      description: `Booking status changed to ${status}.`,
    });
  };

  const selectedDateBookings = selectedDate ? getBookingsByDate(selectedDate) : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Bookings & Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your events and schedule
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inquiry}</p>
                <p className="text-sm text-muted-foreground">Inquiries</p>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Revenue
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(stats.pendingPayments / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                Due
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters & View Toggle */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={eventTypeFilter} onValueChange={(v) => setEventTypeFilter(v as EventType | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={view === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('calendar')}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          <Button
            variant={view === 'cards' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('cards')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants}>
        {view === 'calendar' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BookingCalendar
                bookings={bookings}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
            <div className="space-y-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-display">
                    {selectedDate 
                      ? format(selectedDate, 'MMMM d, yyyy')
                      : 'Select a Date'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Click on a date to view bookings
                    </p>
                  ) : selectedDateBookings.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        No bookings on this date
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setAddDialogOpen(true)}
                      >
                        Add Booking
                      </Button>
                    </div>
                  ) : (
                    selectedDateBookings.map(booking => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onClick={() => handleBookingClick(booking)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {view === 'cards' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No bookings found
              </div>
            ) : (
              filteredBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={() => handleBookingClick(booking)}
                />
              ))
            )}
          </div>
        )}

        {view === 'list' && (
          <BookingTable
            bookings={filteredBookings}
            onBookingClick={handleBookingClick}
          />
        )}
      </motion.div>

      {/* Dialogs */}
      <AddBookingDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddBooking}
      />

      <BookingDetailSheet
        booking={selectedBooking}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
}
