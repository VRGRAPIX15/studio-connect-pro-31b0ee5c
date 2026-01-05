import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  CreditCard, 
  MessageCircle, 
  Calendar, 
  Cloud,
  ExternalLink,
  CheckCircle,
  Circle,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: typeof Database;
  status: 'connected' | 'not_connected';
  color: string;
}

const integrations: Integration[] = [
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Sync data with Google Sheets as your backend database',
    icon: Database,
    status: 'not_connected',
    color: 'text-success',
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Store contracts, photos, and documents',
    icon: Cloud,
    status: 'not_connected',
    color: 'text-info',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Accept online payments from clients',
    icon: CreditCard,
    status: 'not_connected',
    color: 'text-primary',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Send notifications and reminders via WhatsApp',
    icon: MessageCircle,
    status: 'not_connected',
    color: 'text-success',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync bookings with your Google Calendar',
    icon: Calendar,
    status: 'not_connected',
    color: 'text-info',
  },
];

export default function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect your favorite tools and services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${integration.color}`}>
                      <integration.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      integration.status === 'connected'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {integration.status === 'connected' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Circle className="h-3 w-3 mr-1" />
                    )}
                    {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                  </Badge>
                  <Button
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Developer options for custom integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              API access will be available in a future update.
              <br />
              This will allow you to build custom integrations with your existing tools.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Export your data for backup or migration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Export Leads
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Export Clients
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Export Bookings
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Export Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
