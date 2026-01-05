import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Booking, EventType } from '@/types';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  bookings: Booking[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const eventTypeColors: Record<EventType, string> = {
  wedding: 'bg-gold',
  engagement: 'bg-purple-500',
  baby_shower: 'bg-pink-500',
  birthday: 'bg-blue-500',
  corporate: 'bg-slate-500',
  passport_photo: 'bg-green-500',
  portfolio: 'bg-orange-500',
  product_shoot: 'bg-cyan-500',
  other: 'bg-muted-foreground',
};

export function BookingCalendar({ bookings, onDateSelect, selectedDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => isSameDay(new Date(b.eventDate), date));
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-display font-semibold ml-2">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const dayBookings = getBookingsForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateSelect(day)}
              className={cn(
                'relative min-h-[80px] p-2 rounded-lg border transition-colors text-left',
                isCurrentMonth ? 'bg-background' : 'bg-muted/30',
                isSelected && 'border-primary ring-2 ring-primary/20',
                !isSelected && 'border-border/50 hover:border-border',
                isTodayDate && 'bg-primary/5'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium',
                  !isCurrentMonth && 'text-muted-foreground',
                  isTodayDate && 'text-primary font-bold'
                )}
              >
                {format(day, 'd')}
              </span>
              
              {/* Booking Indicators */}
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className={cn(
                      'text-[10px] truncate rounded px-1 py-0.5 text-white',
                      eventTypeColors[booking.eventType]
                    )}
                    title={`${booking.clientName} - ${booking.eventType}`}
                  >
                    {booking.clientName}
                  </div>
                ))}
                {dayBookings.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{dayBookings.length - 3} more
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Event Types:</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(eventTypeColors).slice(0, 6).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded-full', color)} />
              <span className="text-xs capitalize text-muted-foreground">
                {type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
