import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Demo data
const stats = [
  {
    title: 'New Leads',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    title: 'Upcoming Bookings',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Calendar,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'This Month Revenue',
    value: '₹2,45,000',
    change: '+18%',
    trend: 'up',
    icon: IndianRupee,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Pending Payments',
    value: '₹85,000',
    change: '5 invoices',
    trend: 'neutral',
    icon: AlertCircle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

const upcomingEvents = [
  {
    id: '1',
    clientName: 'Priya & Rahul',
    eventType: 'Wedding',
    date: 'Jan 8, 2026',
    time: '10:00 AM',
    venue: 'Grand Palace, Chennai',
    status: 'confirmed',
  },
  {
    id: '2',
    clientName: 'Sneha Sharma',
    eventType: 'Baby Shower',
    date: 'Jan 10, 2026',
    time: '4:00 PM',
    venue: 'Varnika Studio',
    status: 'confirmed',
  },
  {
    id: '3',
    clientName: 'Arun Kumar',
    eventType: 'Birthday',
    date: 'Jan 12, 2026',
    time: '6:00 PM',
    venue: 'Client Residence',
    status: 'in_progress',
  },
];

const recentLeads = [
  {
    id: '1',
    name: 'Kavitha Rajan',
    phone: '+91 98765 43210',
    source: 'Instagram',
    eventType: 'Wedding',
    status: 'new',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    phone: '+91 98765 43211',
    source: 'WhatsApp',
    eventType: 'Engagement',
    status: 'contacted',
    createdAt: '5 hours ago',
  },
  {
    id: '3',
    name: 'Divya Krishnan',
    phone: '+91 98765 43212',
    source: 'Website',
    eventType: 'Baby Shower',
    status: 'quoted',
    createdAt: '1 day ago',
  },
];

const statusColors: Record<string, string> = {
  new: 'status-new',
  contacted: 'status-contacted',
  quoted: 'status-quoted',
  converted: 'status-converted',
  confirmed: 'bg-success/10 text-success border-success/20',
  in_progress: 'bg-info/10 text-info border-info/20',
};

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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
          <h1 className="text-2xl font-display font-semibold text-foreground">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at the studio today
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gold-gradient hover:opacity-90 text-white shadow-gold">
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn('p-2.5 rounded-xl', stat.bgColor)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      stat.trend === 'up' ? 'text-success' : 'text-destructive'
                    )}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-display">Upcoming Events</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-xs font-medium text-muted-foreground">
                      {event.date.split(' ')[0]}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {event.date.split(' ')[1].replace(',', '')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">{event.clientName}</p>
                      <Badge variant="outline" className={cn('text-xs', statusColors[event.status])}>
                        {event.status === 'confirmed' ? 'Confirmed' : 'In Progress'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.eventType}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Leads */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-display">Recent Leads</CardTitle>
                  <CardDescription>New enquiries</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-foreground truncate">{lead.name}</p>
                      <Badge variant="outline" className={cn('text-xs', statusColors[lead.status])}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.eventType} • {lead.source}</p>
                    <p className="text-xs text-muted-foreground mt-1">{lead.createdAt}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/30">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Add Lead', icon: Users },
                { label: 'New Booking', icon: Calendar },
                { label: 'Create Invoice', icon: TrendingUp },
                { label: 'Generate Contract', icon: CheckCircle2 },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 bg-background/80 hover:bg-background border-border/50"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
