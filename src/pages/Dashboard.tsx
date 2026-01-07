import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { useClients } from '@/hooks/useClients';
import { useBookings } from '@/hooks/useBookings';
import { useInvoices } from '@/hooks/useInvoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  IndianRupee, 
  Plus,
  ArrowUpRight,
  Clock,
  UserPlus,
  FileText,
  Loader2
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads, isLoading: leadsLoading } = useLeads();
  const { clients, isLoading: clientsLoading } = useClients();
  const { bookings, isLoading: bookingsLoading, stats: bookingStats } = useBookings();
  const { stats: invoiceStats, isLoading: invoicesLoading } = useInvoices();

  const isLoading = leadsLoading || clientsLoading || bookingsLoading || invoicesLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const todayBookings = bookings.filter(b => 
      isToday(new Date(b.eventDate)) && b.status === 'confirmed'
    ).length;

    const newLeadsThisWeek = leads.filter(l => 
      isThisWeek(new Date(l.createdAt)) && l.status === 'new'
    ).length;

    return { 
      todayBookings, 
      newLeadsThisWeek, 
      pendingPayments: invoiceStats.pending || bookingStats.pendingPayments,
      monthlyRevenue: invoiceStats.total || bookingStats.totalRevenue
    };
  }, [leads, bookings, bookingStats, invoiceStats]);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed' && new Date(b.eventDate) >= new Date())
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);
  }, [bookings]);

  // Recent leads
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [leads]);

  const getEventDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      quoted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      converted: 'bg-green-500/10 text-green-500 border-green-500/20',
      lost: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

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
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate('/leads')}>
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Lead</span>
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => navigate('/bookings')}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Booking</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.todayBookings}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Today's Bookings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                {leads.length} total
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.newLeadsThisWeek}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">New Leads This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <IndianRupee className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ₹{(stats.pendingPayments / 1000).toFixed(0)}K
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pending Payments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ₹{(stats.monthlyRevenue / 100000).toFixed(1)}L
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/bookings')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming events</p>
              ) : (
                upcomingEvents.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs text-primary font-medium">
                          {format(new Date(event.eventDate), 'MMM')}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {format(new Date(event.eventDate), 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{event.clientName}</p>
                        <p className="text-sm text-muted-foreground">{event.eventType}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={isToday(new Date(event.eventDate)) 
                        ? 'bg-primary/10 text-primary border-primary/30' 
                        : 'bg-muted text-muted-foreground'
                      }
                    >
                      {getEventDateLabel(new Date(event.eventDate))}
                    </Badge>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Leads */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Leads
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/leads')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLeads.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No leads yet</p>
              ) : (
                recentLeads.map((lead, idx) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {lead.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.eventType || 'General Inquiry'}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(lead.status)}
                    >
                      {lead.status}
                    </Badge>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/50"
                onClick={() => navigate('/leads')}
              >
                <UserPlus className="h-5 w-5 text-primary" />
                <span className="text-sm">Add Lead</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/50"
                onClick={() => navigate('/bookings')}
              >
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">New Booking</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/50"
                onClick={() => navigate('/invoices')}
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm">Create Invoice</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/50"
                onClick={() => navigate('/clients')}
              >
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">View Clients</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
