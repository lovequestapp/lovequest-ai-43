
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
import { Activity, Crown, Shield } from 'lucide-react';

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
    
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    // Listen for tab change events from the AdminMobileContainer
    const handleTabChange = (event: any) => {
      if (event.detail) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener('setAdminTab', handleTabChange);
    return () => {
      window.removeEventListener('setAdminTab', handleTabChange);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminMobileContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-love text-transparent bg-clip-text">Admin Dashboard</h1>
              <div className="bg-love-50 p-1 rounded-full">
                <Crown className="h-5 w-5 text-love-600" />
              </div>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage users, subscriptions, and application settings
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-love-100 to-love-200 rounded-full px-4 py-1.5 text-sm font-medium flex items-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-love-500 animate-pulse mr-2"></div>
              <span className="text-love-800">{currentUser?.role === 'admin' ? 'Admin Access' : 'Limited Access'}</span>
              <Shield className="h-3.5 w-3.5 ml-2 text-love-500" />
            </div>
            
            <div className="bg-gradient-to-r from-love-50 to-passion-50 rounded-full px-4 py-1.5 text-sm shadow-sm">
              <span className="text-love-700 font-medium flex items-center">
                <Activity className="h-3.5 w-3.5 mr-1.5" /> 
                Live
              </span>
            </div>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6 p-1 bg-gradient-to-r from-muted/80 to-muted/30 backdrop-blur-sm">
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-white data-[state=active]:text-love-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="subscriptions"
                className="data-[state=active]:bg-white data-[state=active]:text-love-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-white data-[state=active]:text-love-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="moderation"
                className="data-[state=active]:bg-white data-[state=active]:text-love-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                Moderation
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-white data-[state=active]:text-love-700 data-[state=active]:shadow-md transition-all duration-200"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="animate-fade-in">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="h-12 w-12 rounded-full border-4 border-love-200 border-t-love-500 animate-spin"></div>
              </div>
            ) : (
              <>
                <TabsContent value="users" className="focus-visible:outline-none focus-visible:ring-0">
                  <UserManagement />
                </TabsContent>
                
                <TabsContent value="subscriptions" className="focus-visible:outline-none focus-visible:ring-0">
                  <SubscriptionPlans />
                </TabsContent>
                
                <TabsContent value="analytics" className="focus-visible:outline-none focus-visible:ring-0">
                  <Analytics />
                </TabsContent>
                
                <TabsContent value="moderation" className="focus-visible:outline-none focus-visible:ring-0">
                  <ContentModeration />
                </TabsContent>
                
                <TabsContent value="settings" className="focus-visible:outline-none focus-visible:ring-0">
                  <AppSettings />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </AdminMobileContainer>
  );
};

export default Admin;
