import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamPerformanceProps {
  data: { name: string; bookings: number; revenue: number; leads: number }[];
}

export function TeamPerformance({ data }: TeamPerformanceProps) {
  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}K`;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getPerformanceLevel = (bookings: number) => {
    if (bookings >= 15) return { label: 'Top Performer', variant: 'default' as const };
    if (bookings >= 10) return { label: 'Good', variant: 'secondary' as const };
    return { label: 'Growing', variant: 'outline' as const };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead>Team Member</TableHead>
            <TableHead className="text-center">Bookings</TableHead>
            <TableHead className="text-center">Leads Handled</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-center">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((member, index) => {
            const performance = getPerformanceLevel(member.bookings);
            return (
              <TableRow key={index} className="border-border/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{member.bookings}</TableCell>
                <TableCell className="text-center">{member.leads}</TableCell>
                <TableCell className="text-right font-medium text-primary">
                  {formatCurrency(member.revenue)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={performance.variant}>{performance.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-xl font-bold text-foreground">
            {data.reduce((sum, m) => sum + m.bookings, 0)}
          </p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="text-xl font-bold text-foreground">
            {data.reduce((sum, m) => sum + m.leads, 0)}
          </p>
        </div>
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(data.reduce((sum, m) => sum + m.revenue, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
