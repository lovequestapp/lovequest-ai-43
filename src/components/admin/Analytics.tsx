
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, PieChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell } from 'recharts';
import { Download, Calendar, Filter, TrendingUp, Users, Heart, MessagesSquare, UserCheck } from 'lucide-react';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    activityMetrics: [],
    engagementRate: [],
    userDistribution: [],
    matchesData: [],
    conversionRates: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // This would normally fetch from an analytics API or database
      // For demo purposes, we'll generate some mock data
      generateMockData();
    } catch (error: any) {
      toast("Failed to load analytics data", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock data based on the selected timeframe
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    
    // User growth data
    const userGrowth = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        newUsers: Math.floor(Math.random() * 50) + 10,
        totalUsers: 1000 + (i * 20) + Math.floor(Math.random() * 30)
      };
    });
    
    // Activity metrics
    const activityMetrics = [
      { name: 'Messages Sent', value: Math.floor(Math.random() * 10000) + 5000 },
      { name: 'Profiles Viewed', value: Math.floor(Math.random() * 50000) + 20000 },
      { name: 'Matches Made', value: Math.floor(Math.random() * 3000) + 1000 },
      { name: 'Dates Arranged', value: Math.floor(Math.random() * 1000) + 200 }
    ];
    
    // Engagement rate over time
    const engagementRate = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        dailyActiveUsers: Math.floor(Math.random() * 400) + 200,
        percentageActive: Math.floor(Math.random() * 30) + 20
      };
    });
    
    // User distribution data
    const userDistribution = [
      { name: 'Male', value: Math.floor(Math.random() * 3000) + 3000 },
      { name: 'Female', value: Math.floor(Math.random() * 3000) + 3000 },
      { name: 'Non-binary', value: Math.floor(Math.random() * 1000) + 500 }
    ];
    
    // Matches data over time
    const matchesData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        matches: Math.floor(Math.random() * 150) + 50,
        successfulConversations: Math.floor(Math.random() * 100) + 25
      };
    });
    
    // Conversion rates
    const conversionRates = [
      { name: 'Free to Premium', rate: Math.floor(Math.random() * 10) + 5 },
      { name: 'Premium to VIP', rate: Math.floor(Math.random() * 5) + 2 },
      { name: 'Trial to Paid', rate: Math.floor(Math.random() * 15) + 10 },
      { name: 'Profile Completion', rate: Math.floor(Math.random() * 20) + 70 }
    ];
    
    setAnalyticsData({
      userGrowth,
      activityMetrics,
      engagementRate,
      userDistribution,
      matchesData,
      conversionRates
    });
  };

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            View detailed metrics about app usage and user engagement
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.userGrowth.length > 0 
                      ? analyticsData.userGrowth.reduce((sum, item) => sum + item.newUsers, 0)
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 20) + 5}% from last period
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Matches Made
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.matchesData.length > 0 
                      ? analyticsData.matchesData.reduce((sum, item) => sum + item.matches, 0)
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 15) + 10}% from last period
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages Sent
                  </CardTitle>
                  <MessagesSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.activityMetrics.find(m => m.name === 'Messages Sent')?.value.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 25) + 15}% from last period
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Engagement Rate
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.engagementRate.length > 0 
                      ? Math.round(analyticsData.engagementRate.reduce((sum, item) => sum + item.percentageActive, 0) / analyticsData.engagementRate.length)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 8) + 2}% from last period
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  New registrations and total users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.userGrowth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        name="New Users"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Activity and User Distribution */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Metrics</CardTitle>
                  <CardDescription>
                    Key activity metrics across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.activityMetrics}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value.toLocaleString(), ""]} />
                        <Bar dataKey="value" name="Count" fill="#8884d8">
                          {analyticsData.activityMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of users by gender identity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.userDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.userDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value.toLocaleString(), "Users"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>
                  Detailed breakdown of user demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Detailed user demographics chart would go here</p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Data based on user profiles that have provided demographic information.
                </p>
              </CardFooter>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Retention</CardTitle>
                  <CardDescription>
                    Weekly retention rates for new users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">User retention chart would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Acquisition Channels</CardTitle>
                  <CardDescription>
                    How users are finding your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Acquisition channels chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6">
            {/* Match activity */}
            <Card>
              <CardHeader>
                <CardTitle>Match Activity</CardTitle>
                <CardDescription>
                  Matches made and successful conversations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.matchesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="matches" name="Matches Made" fill="#8884d8" />
                      <Bar dataKey="successfulConversations" name="Successful Conversations" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Active Users */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>
                  Number of users actively using the app each day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.engagementRate}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="dailyActiveUsers"
                        name="Daily Active Users"
                        stroke="#8884d8"
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentageActive"
                        name="% Active Users"
                        stroke="#82ca9d"
                        yAxisId={1}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>
                    Most frequently used app features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Feature usage chart would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Session Data</CardTitle>
                  <CardDescription>
                    Average session length and frequency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Session data chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Tracking</CardTitle>
                <CardDescription>
                  Tracking various conversion rates in the app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.conversionRates}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                      <Legend />
                      <Bar dataKey="rate" name="Conversion Rate (%)" fill="#8884d8">
                        {analyticsData.conversionRates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>
                    Revenue by subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Revenue breakdown chart would go here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Projected Growth</CardTitle>
                  <CardDescription>
                    Revenue and subscriber projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-muted-foreground">Projected growth chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Analytics;
