import { useState, useMemo, useCallback, useEffect } from 'react';
import { Booking, BookingStatus, EventType } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

interface UseBookingsOptions {
  statusFilter?: BookingStatus | 'all';
  eventTypeFilter?: EventType | 'all';
  dateRange?: { start: Date; end: Date };
}

export function useBookings(options: UseBookingsOptions = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getBookings`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const bookingsWithDates = data.map((b: any) => ({
          id: b.Id,
          clientId: b.ClientId,
          clientName: b.ClientName,
          eventType: b.EventType as EventType,
          eventDate: new Date(b.EventDate),
          eventTime: b.EventTime || '',
          venue: b.Venue || '',
          status: b.Status as BookingStatus,
          package: b.Package || '',
          totalAmount: Number(b.TotalAmount) || 0,
          advancePaid: Number(b.AdvancePaid) || 0,
          balanceDue: Number(b.BalanceDue) || 0,
          assignedTeam: b.AssignedTeam ? JSON.parse(b.AssignedTeam) : [],
          notes: b.Notes || '',
          contractId: b.ContractId || undefined,
          createdAt: new Date(b.CreatedAt),
          updatedAt: new Date(b.UpdatedAt),
        }));
        setBookings(bookingsWithDates);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (options.statusFilter && options.statusFilter !== 'all') {
      result = result.filter(b => b.status === options.statusFilter);
    }

    if (options.eventTypeFilter && options.eventTypeFilter !== 'all') {
      result = result.filter(b => b.eventType === options.eventTypeFilter);
    }

    if (options.dateRange) {
      result = result.filter(b => {
        const eventDate = new Date(b.eventDate);
        return eventDate >= options.dateRange!.start && eventDate <= options.dateRange!.end;
      });
    }

    return result;
  }, [bookings, options.statusFilter, options.eventTypeFilter, options.dateRange]);

  const addBooking = useCallback(async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addBooking',
          booking: {
            ClientId: booking.clientId,
            ClientName: booking.clientName,
            EventType: booking.eventType,
            EventDate: booking.eventDate.toISOString(),
            EventTime: booking.eventTime,
            Venue: booking.venue,
            Status: booking.status,
            Package: booking.package,
            TotalAmount: booking.totalAmount,
            AdvancePaid: booking.advancePaid,
            AssignedTeam: booking.assignedTeam,
            Notes: booking.notes,
            ContractId: booking.contractId,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Booking created successfully');
        fetchBookings();
        return result.booking;
      } else {
        toast.error(result.error || 'Failed to create booking');
        return null;
      }
    } catch (error) {
      console.error('Error adding booking:', error);
      toast.error('Failed to create booking');
      return null;
    }
  }, [fetchBookings]);

  const updateBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateBooking',
          id,
          booking: {
            ClientName: updates.clientName,
            EventType: updates.eventType,
            EventDate: updates.eventDate?.toISOString(),
            EventTime: updates.eventTime,
            Venue: updates.venue,
            Status: updates.status,
            Package: updates.package,
            TotalAmount: updates.totalAmount,
            AdvancePaid: updates.advancePaid,
            Notes: updates.notes,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Booking updated successfully');
        fetchBookings();
      } else {
        toast.error(result.error || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  }, [fetchBookings]);

  const deleteBooking = useCallback(async (id: string) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteBooking', id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Booking deleted successfully');
        fetchBookings();
      } else {
        toast.error(result.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  }, [fetchBookings]);

  const getBookingsByDate = useCallback((date: Date) => {
    return bookings.filter(b => {
      const eventDate = new Date(b.eventDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }, [bookings]);

  const getUpcomingBookings = useCallback((limit: number = 10) => {
    const now = new Date();
    return bookings
      .filter(b => new Date(b.eventDate) >= now && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, limit);
  }, [bookings]);

  const hasConflict = useCallback((date: Date, excludeId?: string) => {
    return bookings.some(b => {
      if (excludeId && b.id === excludeId) return false;
      if (b.status === 'cancelled') return false;
      const eventDate = new Date(b.eventDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  }, [bookings]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const inquiry = bookings.filter(b => b.status === 'inquiry').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingPayments = bookings
      .filter(b => b.balanceDue > 0)
      .reduce((sum, b) => sum + b.balanceDue, 0);

    return { confirmed, completed, inquiry, totalRevenue, pendingPayments };
  }, [bookings]);

  return {
    bookings,
    filteredBookings,
    isLoading,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsByDate,
    getUpcomingBookings,
    hasConflict,
    stats,
    refetch: fetchBookings,
  };
}
