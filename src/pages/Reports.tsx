import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  UserCheck,
  BarChart3
} from 'lucide-react';
import { RevenueChart } from '@/components/reports/RevenueChart';
import { LeadSourceChart } from '@/components/reports/LeadSourceChart';
import { ConversionFunnel } from '@/components/reports/ConversionFunnel';
import { ServiceRevenueChart } from '@/components/reports/ServiceRevenueChart';
import { TeamPerformance } from '@/components/reports/TeamPerformance';
import { useLeads } from '@/hooks/useLeads';
import { teamMembers, demoBookings } from '@/data/demoData';

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

// Demo data for charts
const revenueData = [
  { month: 'Aug', revenue: 180000 },
  { month: 'Sep', revenue: 220000 },
  { month: 'Oct', revenue: 195000 },
  { month: 'Nov', revenue: 280000 },
  { month: 'Dec', revenue: 320000 },
  { month: 'Jan', revenue: 245000 },
];

const serviceRevenueData = [
  { service: 'Wedding', revenue: 850000 },
  { service: 'Engagement', revenue: 180000 },
  { service: 'Birthday', revenue: 120000 },
  { service: 'Corporate', revenue: 200000 },
  { service: 'Portfolio', revenue: 90000 },
];

const leadSourceData = [
  { name: 'Instagram', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'WhatsApp', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Website', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Referral', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Walk-in', value: 5, color: 'hsl(var(--chart-5))' },
];

const conversionFunnelData = [
  { stage: 'New Leads', count: 156, percentage: 100 },
  { stage: 'Contacted', count: 98, percentage: 63 },
  { stage: 'Quoted', count: 62, percentage: 40 },
  { stage: 'Converted', count: 50, percentage: 32 },
];

const teamPerformanceData = [
  { name: 'Rajesh Kumar', bookings: 18, revenue: 420000, leads: 35 },
  { name: 'Priya Sharma', bookings: 15, revenue: 350000, leads: 42 },
  { name: 'Amit Patel', bookings: 12, revenue: 280000, leads: 38 },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your business performance and insights
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-muted/50">
            <TabsTrigger value="revenue" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={revenueData} />
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Revenue by Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ServiceRevenueChart data={serviceRevenueData} />
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹24.5L</p>
                  <p className="text-xs text-green-500 mt-1">+18% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹85K</p>
                  <p className="text-xs text-green-500 mt-1">+5% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold text-foreground mt-1">₹3.2L</p>
                  <p className="text-xs text-red-500 mt-1">8 pending invoices</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Collection Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">87%</p>
                  <p className="text-xs text-green-500 mt-1">+3% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Lead Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeadSourceChart data={leadSourceData} />
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ConversionFunnel data={conversionFunnelData} />
                </CardContent>
              </Card>
            </div>

            {/* Lead Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground mt-1">156</p>
                  <p className="text-xs text-green-500 mt-1">+24 this month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">32%</p>
                  <p className="text-xs text-green-500 mt-1">+4% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-foreground mt-1">2.4h</p>
                  <p className="text-xs text-green-500 mt-1">-30min improvement</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                  <p className="text-2xl font-bold text-foreground mt-1">18</p>
                  <p className="text-xs text-primary mt-1">Needs follow-up</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Team Performance
                </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamPerformance data={teamPerformanceData} />
                </CardContent>
              </Card>

            {/* Team Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-foreground mt-1">8</p>
                  <p className="text-xs text-muted-foreground mt-1">Active staff</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Avg. Bookings/Member</p>
                  <p className="text-2xl font-bold text-foreground mt-1">12</p>
                  <p className="text-xs text-green-500 mt-1">+2 from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-2xl font-bold text-foreground mt-1">Rahul</p>
                  <p className="text-xs text-primary mt-1">₹4.2L revenue</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold text-foreground mt-1">89%</p>
                  <p className="text-xs text-green-500 mt-1">On-time delivery</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
