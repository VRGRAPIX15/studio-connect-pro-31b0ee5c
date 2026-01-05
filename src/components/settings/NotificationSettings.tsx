import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'new_lead',
    title: 'New Lead',
    description: 'When a new lead comes in from any source',
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'booking_confirmed',
    title: 'Booking Confirmed',
    description: 'When a booking is confirmed',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'payment_received',
    title: 'Payment Received',
    description: 'When a payment is recorded',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'task_assigned',
    title: 'Task Assigned',
    description: 'When a task is assigned to you',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'event_reminder',
    title: 'Event Reminder',
    description: 'Reminders before scheduled events',
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'contract_signed',
    title: 'Contract Signed',
    description: 'When a client signs a contract',
    email: true,
    sms: false,
    push: true,
  },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);

  const updateSetting = (
    id: string,
    channel: 'email' | 'sms' | 'push',
    value: boolean
  ) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: value } : s))
    );
  };

  const handleSave = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Header */}
            <div className="grid grid-cols-[1fr,80px,80px,80px] gap-4 items-center pb-2 border-b">
              <div></div>
              <div className="flex flex-col items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Email</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">SMS</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Push</span>
              </div>
            </div>

            {/* Settings */}
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="grid grid-cols-[1fr,80px,80px,80px] gap-4 items-center py-2"
              >
                <div>
                  <p className="font-medium">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={(v) => updateSetting(setting.id, 'email', v)}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={(v) => updateSetting(setting.id, 'sms', v)}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={(v) => updateSetting(setting.id, 'push', v)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Client Notifications</CardTitle>
          <CardDescription>
            Automated messages sent to clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Booking Confirmation</p>
              <p className="text-sm text-muted-foreground">
                Send confirmation message when booking is confirmed
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Event Reminder (3 days before)</p>
              <p className="text-sm text-muted-foreground">
                Remind clients 3 days before their event
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Payment Reminder</p>
              <p className="text-sm text-muted-foreground">
                Send reminder when payment is due
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Review Request</p>
              <p className="text-sm text-muted-foreground">
                Request feedback after event completion
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
