
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import ContentModeration from '@/components/admin/ContentModeration';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import SettingsPanel from '@/components/admin/SettingsPanel';
import { CalendarDays, UserCog, Flag, Activity, Settings } from 'lucide-react';
import { toast } from 'sonner';

const AdminPage = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    totalUsers: 0,
    newUsers: 0,
    premiumUsers: 0,
    flaggedContent: 0
  });
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        toast.error("You need to be logged in to access the admin panel");
        navigate('/login');
        return;
      }
      
      if (currentUser.role !== 'admin') {
        toast.error("You don't have permission to access the admin panel");
        navigate('/');
        return;
      }
      
      // Admin confirmed, load data
      fetchAdminData();
    };
    
    checkAdminStatus();
  }, [currentUser, navigate]);
  
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Get users count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get flagged messages count
      const { count: flaggedCount, error: flaggedError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_flagged', true);
      
      // We won't query the matches since it doesn't exist in our schema yet
      // Instead let's just use a fixed number for demo purposes
      const matchesCount = 0;
      
      if (userError) throw userError;
      if (flaggedError) throw flaggedError;
      
      setUserData({
        totalUsers: userCount || 0,
        newUsers: Math.floor(Math.random() * 20), // Demo data
        premiumUsers: Math.floor((userCount || 0) * 0.2), // Demo: assume 20% are premium
        flaggedContent: flaggedCount || 0
      });
      
    } catch (error: any) {
      console.error('Error fetching admin data:', error.message);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading admin panel...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-1">
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard data={userData} />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="moderation">
          <ContentModeration />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsPanel />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
