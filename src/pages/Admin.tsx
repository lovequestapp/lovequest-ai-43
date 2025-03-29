
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMobileContainer from '@/components/AdminMobileContainer';
import UserManagement from '@/components/admin/UserManagement';
import SubscriptionPlans from '@/components/admin/SubscriptionPlans';
import Analytics from '@/components/admin/Analytics';
import AppSettings from '@/components/admin/AppSettings';
import ContentModeration from '@/components/admin/ContentModeration';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    // Check if user has admin access
    if (currentUser && currentUser.role !== 'admin') {
      toast("Access Denied", {
        description: "You don't have admin privileges to access this page."
      });
      // We could redirect here, but we'll let the ProtectedRoute handle it
    }
  }, [currentUser]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminMobileContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, subscriptions, and application settings
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              {currentUser?.role === 'admin' ? 'Admin Access' : 'Limited Access'}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <SubscriptionPlans />
          </TabsContent>
          
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
          
          <TabsContent value="moderation">
            <ContentModeration />
          </TabsContent>
          
          <TabsContent value="settings">
            <AppSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminMobileContainer>
  );
};

export default Admin;
