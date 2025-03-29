
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMobileContainer from '@/components/AdminMobileContainer';
import UserManagement from '@/components/admin/UserManagement';
import SubscriptionPlans from '@/components/admin/SubscriptionPlans';
import Analytics from '@/components/admin/Analytics';
import AppSettings from '@/components/admin/AppSettings';
import ContentModeration from '@/components/admin/ContentModeration';
import { Activity, ArrowLeft, Crown, Shield, User as UserIcon, Users, BarChart2, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
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

  const exitAdminDashboard = () => {
    navigate('/discover');
    toast.success("Exited admin mode");
  };

  return (
    <AdminMobileContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-love text-transparent bg-clip-text">Admin Dashboard</h1>
            <div className="bg-love-50 p-1 rounded-full">
              <Crown className="h-5 w-5 text-love-600" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 bg-white border-love-200 text-love-700 shadow-sm hover:bg-love-50"
              onClick={exitAdminDashboard}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Exit Admin
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-love-100 to-love-200 rounded-full px-3 py-1 text-sm font-medium flex items-center shadow-sm">
              <div className="w-2 h-2 rounded-full bg-love-500 animate-pulse mr-2"></div>
              <span className="text-love-800">{currentUser?.role === 'admin' ? 'Admin Access' : 'Limited Access'}</span>
              <Shield className="h-3.5 w-3.5 ml-2 text-love-500" />
            </div>
            
            <div className="bg-gradient-to-r from-love-50 to-passion-50 rounded-full px-3 py-1 text-sm shadow-sm">
              <span className="text-love-700 font-medium flex items-center">
                <Activity className="h-3.5 w-3.5 mr-1.5" /> 
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Stats row - improved layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatCard 
            icon={<Users className="h-6 w-6 text-love-500" />} 
            title="Active Users" 
            value="1,245" 
            trend="+5.2%"
            trendUp={true}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'users' }));
            }}
          />
          <StatCard 
            icon={<Activity className="h-6 w-6 text-love-500" />} 
            title="Matches" 
            value="843"
            trend="+12.8%"
            trendUp={true}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'analytics' }));
            }}
          />
          <StatCard 
            icon={<FileText className="h-6 w-6 text-love-500" />} 
            title="Messages" 
            value="15.3k"
            trend="+8.7%"
            trendUp={true}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'moderation' }));
            }}
          />
          <StatCard 
            icon={<UserIcon className="h-6 w-6 text-love-500" />} 
            title="New Signups" 
            value="127"
            trend="+3.2%"
            trendUp={true}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'users' }));
            }}
          />
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-5 p-1 bg-gradient-to-r from-muted/80 to-muted/30 backdrop-blur-sm">
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

// Improved stat card with better layout and styling
const StatCard = ({ icon, title, value, trend, trendUp = true, onClick }) => (
  <div 
    className="luxury-card p-3 flex items-center gap-3 cursor-pointer hover:translate-y-[-2px] transition-all duration-300"
    onClick={onClick}
  >
    <div className="p-2 rounded-full bg-love-50 text-love-700">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-love-700 truncate-text">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-bold text-love-900 truncate-text">{value}</p>
        {trend && (
          <div className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-600"} flex items-center`}>
            <span>{trend}</span>
            <span className={trendUp ? "rotate-0 ml-0.5" : "rotate-180 ml-0.5"}>↑</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Admin;
