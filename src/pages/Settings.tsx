import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Users,
  Building,
  Bell,
  Link2,
  Shield,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSettings from '@/components/settings/ProfileSettings';
import TeamManagement from '@/components/settings/TeamManagement';
import BusinessSettings from '@/components/settings/BusinessSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';

const tabItems = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'team', label: 'Team', icon: Users },
  { value: 'business', label: 'Business', icon: Building },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'integrations', label: 'Integrations', icon: Link2 },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, team, and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="profile" className="mt-0">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="team" className="mt-0">
            <TeamManagement />
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <IntegrationSettings />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
