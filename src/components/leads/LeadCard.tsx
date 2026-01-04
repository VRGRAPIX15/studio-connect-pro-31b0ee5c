import { Lead, LeadStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, MoreVertical, Instagram, Globe, MessageCircle, Users, User } from 'lucide-react';
import { format } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}

const sourceIcons = {
  instagram: Instagram,
  website: Globe,
  whatsapp: MessageCircle,
  referral: Users,
  walkin: User,
  other: User,
};

const eventTypeLabels: Record<string, string> = {
  wedding: 'Wedding',
  baby_shower: 'Baby Shower',
  birthday: 'Birthday',
  engagement: 'Engagement',
  corporate: 'Corporate',
  passport_photo: 'Passport Photo',
  portfolio: 'Portfolio',
  product_shoot: 'Product Shoot',
  other: 'Other',
};

export function LeadCard({ lead, onClick, onStatusChange }: LeadCardProps) {
  const SourceIcon = sourceIcons[lead.source] || User;

  const formatBudget = (budget?: number) => {
    if (!budget) return null;
    if (budget >= 100000) return `₹${(budget / 100000).toFixed(1)}L`;
    return `₹${(budget / 1000).toFixed(0)}K`;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <SourceIcon className="h-3 w-3 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm line-clamp-1">{lead.name}</h4>
              <p className="text-xs text-muted-foreground">{lead.phone}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'new'); }}>
                Mark as New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'contacted'); }}>
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'quoted'); }}>
                Mark as Quoted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'converted'); }}>
                Mark as Converted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'lost'); }}>
                Mark as Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Event Type & Date */}
        {lead.eventType && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {eventTypeLabels[lead.eventType] || lead.eventType}
            </Badge>
            {lead.eventDate && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(lead.eventDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        )}

        {/* Budget */}
        {lead.budget && (
          <div className="text-xs font-medium text-primary">
            Budget: {formatBudget(lead.budget)}
          </div>
        )}

        {/* Follow-up */}
        {lead.followUpDate && (
          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            Follow-up: {format(new Date(lead.followUpDate), 'MMM d')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
