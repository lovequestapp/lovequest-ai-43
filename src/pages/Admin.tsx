
import React, { useState, useEffect } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  BarChart3,
  PieChart, 
  Search, 
  Edit, 
  Trash2,
  Database,
  CircleCheck,
  MessageSquare,
  Heart,
  Calendar,
  User,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserType } from '@/context/UserContext';

// Define user roles
enum UserRole {
  ADMIN = 'admin',
  SUBSCRIBER = 'subscriber',
  TRIAL = 'trial',
  MODERATOR = 'moderator',
  VIP = 'vip',
}

// Define user form schema with zod
const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  age: z.coerce.number().min(18, { message: 'User must be at least 18 years old.' }),
  gender: z.enum(['male', 'female', 'non-binary']),
  role: z.nativeEnum(UserRole),
  location: z.string().min(2, { message: 'Location is required.' }),
  bio: z.string().optional(),
  premiumStatus: z.enum(['basic', 'premium', 'vip']),
});

// Interface for metrics data
interface Metric {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

// Interface for chart data
interface ChartData {
  name: string;
  value: number;
}

// Admin Dashboard Component
const Admin = () => {
  // Protected route hook to check if user is admin
  const { isAuthenticated } = useProtectedRoute({ requireAuth: true });
  const { currentUser, allUsers, updateUserData, deleteUser, addUser } = useUser();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  
  // Setup form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
      gender: 'male',
      role: UserRole.SUBSCRIBER,
      location: '',
      bio: '',
      premiumStatus: 'basic',
    },
  });
  
  // Mock metrics data
  const metrics: Metric[] = [
    { 
      label: 'Total Users', 
      value: allUsers.length, 
      change: 12.5, 
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    { 
      label: 'Active Users', 
      value: Math.floor(allUsers.length * 0.68), 
      change: 8.2, 
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
    { 
      label: 'Premium Users', 
      value: allUsers.filter(user => user.premiumStatus === 'premium' || user.premiumStatus === 'vip').length, 
      change: 24.5, 
      icon: <BadgeCheck className="h-5 w-5 text-amber-500" />
    },
    { 
      label: 'New Registrations', 
      value: Math.floor(allUsers.length * 0.23), 
      change: -3.8, 
      icon: <UserPlus className="h-5 w-5 text-blue-500" />
    },
  ];
  
  // Mock gender distribution data for charts
  const genderData: ChartData[] = [
    { name: 'Male', value: allUsers.filter(user => user.gender === 'male').length },
    { name: 'Female', value: allUsers.filter(user => user.gender === 'female').length },
    { name: 'Non-Binary', value: allUsers.filter(user => user.gender === 'non-binary').length },
  ];
  
  // Mock premium status distribution data for charts
  const premiumData: ChartData[] = [
    { name: 'Basic', value: allUsers.filter(user => user.premiumStatus === 'basic').length },
    { name: 'Premium', value: allUsers.filter(user => user.premiumStatus === 'premium').length },
    { name: 'VIP', value: allUsers.filter(user => user.premiumStatus === 'vip').length },
  ];
  
  // Mock activity metrics
  const activityMetrics = [
    { name: 'Messages', value: 2549, icon: <MessageSquare className="h-4 w-4 text-blue-500" /> },
    { name: 'Matches', value: 1823, icon: <Heart className="h-4 w-4 text-red-500" /> },
    { name: 'Dates', value: 421, icon: <Calendar className="h-4 w-4 text-purple-500" /> },
    { name: 'Active Profiles', value: 3279, icon: <User className="h-4 w-4 text-green-500" /> },
  ];
  
  // Filter users based on search term
  useEffect(() => {
    if (allUsers) {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);
  
  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== UserRole.ADMIN) {
      toast.error("You don't have permission to access the admin dashboard");
      window.location.href = '/';
    }
  }, [currentUser]);
  
  // Handle edit user
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email || '',
      age: user.age || 18,
      gender: user.gender || 'male',
      role: (user.role as UserRole) || UserRole.SUBSCRIBER,
      location: user.location || '',
      bio: user.bio || '',
      premiumStatus: user.premiumStatus || 'basic',
    });
    setIsEditModalOpen(true);
  };
  
  // Handle delete user
  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Handle add new user
  const handleAddUser = () => {
    form.reset({
      name: '',
      email: '',
      age: 18,
      gender: 'male',
      role: UserRole.SUBSCRIBER,
      location: '',
      bio: '',
      premiumStatus: 'basic',
    });
    setIsAddModalOpen(true);
  };
  
  // Submit handler for user form
  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    if (isEditModalOpen && selectedUser) {
      // Update existing user
      updateUserData({
        ...selectedUser,
        ...data,
      });
      toast.success(`User ${data.name} updated successfully`);
      setIsEditModalOpen(false);
    } else if (isAddModalOpen) {
      // Add new user
      const newUser = {
        id: `user-${Date.now()}`,
        ...data,
        photos: [],
        interests: [],
        interestedIn: [],
        popularityPoints: 0,
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
      };
      
      addUser(newUser);
      toast.success(`User ${data.name} added successfully`);
      setIsAddModalOpen(false);
    }
  };
  
  // Confirm delete user
  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      toast.success(`User ${selectedUser.name} deleted successfully`);
      setIsDeleteModalOpen(false);
    }
  };
  
  if (!isAuthenticated || !currentUser) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Dashboard Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="mr-2 h-6 w-6 text-purple-500" />
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Users Management Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddUser} className="flex-shrink-0">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>
            
            {/* Users Table */}
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'vip' ? 'bg-amber-100 text-amber-800' :
                              user.role === 'subscriber' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role || 'user'}
                            </span>
                          </TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.premiumStatus === 'vip' ? 'bg-amber-100 text-amber-800' :
                              user.premiumStatus === 'premium' ? 'bg-violet-100 text-violet-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.premiumStatus}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditUser(user)}
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Edit</span>
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteUser(user)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50 py-3">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {allUsers.length} users
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <Select defaultValue="lastMonth">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="lastWeek">Last Week</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{metric.value.toLocaleString()}</h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {metric.icon}
                      </div>
                    </div>
                    <div className={`mt-3 flex items-center text-sm ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%</span>
                      <span className="text-gray-500 ml-2">vs. last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Charts and Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Gender Distribution</CardTitle>
                  <CardDescription>Breakdown of users by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a PieChart component in a real implementation */}
                    <div className="flex h-full items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                        {genderData.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`h-32 w-32 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-blue-100' : 
                              index === 1 ? 'bg-pink-100' : 'bg-purple-100'
                            }`}>
                              <span className="text-2xl font-bold">{item.value}</span>
                            </div>
                            <span className="mt-2 text-sm font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Premium Status Distribution</CardTitle>
                  <CardDescription>Breakdown of users by premium status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* This would be a BarChart component in a real implementation */}
                    <div className="flex h-full items-end justify-around p-4">
                      {premiumData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className={`w-24 ${
                              index === 0 ? 'bg-gray-200' : 
                              index === 1 ? 'bg-violet-300' : 'bg-amber-300'
                            } rounded-t-md flex items-center justify-center`}
                            style={{ 
                              height: `${(item.value / Math.max(...premiumData.map(d => d.value))) * 200}px` 
                            }}
                          >
                            <span className="font-bold text-gray-800">{item.value}</span>
                          </div>
                          <span className="mt-2 text-sm font-medium">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Overview</CardTitle>
                <CardDescription>Platform activity at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activityMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {metric.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                        <h4 className="text-lg font-bold">{metric.value.toLocaleString()}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">System Status</h2>
              <Button variant="outline" size="sm">
                <CircleCheck className="mr-2 h-4 w-4" />
                All Systems Operational
              </Button>
            </div>
            
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Server Status</CardTitle>
                  <CardDescription>Current server resource usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Disk Usage</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Network Usage</span>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Status</CardTitle>
                  <CardDescription>Database performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Records</p>
                        <h4 className="text-lg font-bold">{(allUsers.length * 125).toLocaleString()}</h4>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Average Query Time</p>
                        <h4 className="text-lg font-bold">12ms</h4>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Query Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Authentication</span>
                          <span className="text-xs font-medium">8ms</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs">User Data</span>
                          <span className="text-xs font-medium">14ms</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Messaging</span>
                          <span className="text-xs font-medium">22ms</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Analytics</span>
                          <span className="text-xs font-medium">38ms</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={18} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                          <SelectItem value={UserRole.SUBSCRIBER}>Subscriber</SelectItem>
                          <SelectItem value={UserRole.VIP}>VIP</SelectItem>
                          <SelectItem value={UserRole.TRIAL}>Trial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premiumStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={18} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                          <SelectItem value={UserRole.SUBSCRIBER}>Subscriber</SelectItem>
                          <SelectItem value={UserRole.VIP}>VIP</SelectItem>
                          <SelectItem value={UserRole.TRIAL}>Trial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premiumStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border rounded-md p-4 bg-red-50">
            <h4 className="font-medium">{selectedUser?.name}</h4>
            <p className="text-sm text-gray-500">{selectedUser?.email}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
