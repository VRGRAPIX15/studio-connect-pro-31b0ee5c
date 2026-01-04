import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{client.name}</h4>
            <p className="text-sm text-muted-foreground">
              Client since {format(new Date(client.createdAt), 'MMM yyyy')}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs capitalize">
            {client.source}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{client.address}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{client.totalBookings}</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{formatCurrency(client.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Spent</p>
          </div>
          <div className="text-center">
            {client.lastEventDate ? (
              <>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(client.lastEventDate), 'MMM d')}
                </p>
                <p className="text-xs text-muted-foreground">Last Event</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">-</p>
                <p className="text-xs text-muted-foreground">Last Event</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
