
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  MoreVertical, Edit, Trash2, Plus, Users, Activity, Settings, Gift, Shield, 
  BookOpen, DollarSign, BarChart3, BarChart, Search, Heart, Download, Upload, 
  Calendar, Clock, Eye, Bell, Lock, Mail, Flag, UserX, Filter, RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const Admin = () => {
  const { isAuthenticated } = useProtectedRoute();
  const navigate = useNavigate();
  const { allUsers, addUser, deleteUser, updateUserData } = useUser();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAge, setNewUserAge] = useState('');
  const [selectedRole, setSelectedRole] = useState('subscriber');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [filters, setFilters] = useState({
    role: 'all',
    premium: 'all',
    gender: 'all',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanned, setShowBanned] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [userActivityLogs, setUserActivityLogs] = useState<any[]>([
    { userId: 'user-1', action: 'Login', timestamp: new Date().toISOString(), ip: '192.168.1.1' },
    { userId: 'user-2', action: 'Profile Update', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.2' },
    { userId: 'user-3', action: 'Message Sent', timestamp: new Date(Date.now() - 7200000).toISOString(), ip: '192.168.1.3' },
    { userId: 'user-1', action: 'Gift Sent', timestamp: new Date(Date.now() - 10800000).toISOString(), ip: '192.168.1.1' }
  ]);
  const [recentReports, setRecentReports] = useState<any[]>([
    { id: 'RPT-1234', type: 'Profile', reportedUser: 'john.doe@example.com', reason: 'Inappropriate photo', date: '2023-06-15', status: 'pending' },
    { id: 'RPT-1235', type: 'Message', reportedUser: 'sarah.smith@example.com', reason: 'Harassment', date: '2023-06-14', status: 'resolved' },
    { id: 'RPT-1236', type: 'Profile', reportedUser: 'mike.jones@example.com', reason: 'Fake profile', date: '2023-06-13', status: 'investigating' }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Start auto-refresh
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
      toast.success('Auto-refresh disabled');
      return;
    }
    
    const interval = window.setInterval(() => {
      toast.info('Refreshing dashboard data...');
      // This would normally fetch fresh data from the server
    }, 30000);
    
    setRefreshInterval(interval);
    toast.success('Auto-refresh enabled (30s)');
  };

  if (!isAuthenticated) {
    return null;
  }
  
  // Filtered users based on search query and filters
  const filteredUsers = allUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
    
    const matchesRoleFilter = filters.role === 'all' || user.role === filters.role;
    const matchesPremiumFilter = filters.premium === 'all' || user.premiumStatus === filters.premium;
    const matchesGenderFilter = filters.gender === 'all' || user.gender === filters.gender;
    
    return matchesSearch && matchesRoleFilter && matchesPremiumFilter && matchesGenderFilter;
  });

  // Analytics data
  const analyticsData = {
    totalUsers: allUsers.length,
    adminUsers: allUsers.filter(user => user.role === 'admin').length,
    subscriberUsers: allUsers.filter(user => user.role === 'subscriber').length,
    vipUsers: allUsers.filter(user => user.role === 'vip').length,
    trialUsers: allUsers.filter(user => user.role === 'trial').length,
    moderatorUsers: allUsers.filter(user => user.role === 'moderator').length,
    premiumDistribution: {
      basic: allUsers.filter(user => user.premiumStatus === 'basic').length,
      premium: allUsers.filter(user => user.premiumStatus === 'premium').length,
      vip: allUsers.filter(user => user.premiumStatus === 'vip').length,
    },
    genderDistribution: {
      male: allUsers.filter(user => user.gender === 'male').length,
      female: allUsers.filter(user => user.gender === 'female').length,
      nonBinary: allUsers.filter(user => user.gender === 'non-binary').length,
    },
    ageGroups: {
      under25: allUsers.filter(user => user.age && user.age < 25).length,
      age25to34: allUsers.filter(user => user.age && user.age >= 25 && user.age <= 34).length,
      age35to44: allUsers.filter(user => user.age && user.age >= 35 && user.age <= 44).length,
      age45plus: allUsers.filter(user => user.age && user.age >= 45).length,
    },
    messagesSent: 1243, // Example data
    matchesMade: 486,   // Example data
    activeProfiles: 234, // Example data
    profileViewsToday: 562, // Example data
    dailyActiveUsers: 342, // Example data
    monthlyActiveUsers: 1872, // Example data
    averageSessionTime: "18 minutes", // Example data
    newUsersToday: 42, // Example data
    conversionRate: "3.2%", // Example data
    retentionRate: "76%", // Example data
    payingUsers: allUsers.filter(user => user.premiumStatus !== 'basic').length,
    reportedUsers: 17, // Example data
    bannedUsers: 8, // Example data
  };

  const userFormSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    age: z.string().refine((value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0;
    }, {
      message: "Age must be a valid number.",
    }),
    role: z.enum(["admin", "moderator", "subscriber", "vip", "trial"]),
    premiumStatus: z.enum(["basic", "premium", "vip"]),
    bio: z.string().optional(),
    location: z.string().optional(),
    gender: z.enum(["male", "female", "non-binary"]),
    isBanned: z.boolean().optional(),
    verificationStatus: z.enum(["unverified", "pending", "verified"]).optional(),
    notes: z.string().optional(),
    terms: z.boolean({
      required_error: "You must accept the terms and conditions.",
    }),
  });
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      age: selectedUser?.age ? String(selectedUser.age) : "",
      role: selectedUser?.role || "subscriber",
      premiumStatus: selectedUser?.premiumStatus || "basic",
      bio: selectedUser?.bio || "",
      location: selectedUser?.location || "",
      gender: selectedUser?.gender || "male",
      isBanned: selectedUser?.isBanned || false,
      verificationStatus: selectedUser?.verificationStatus || "unverified",
      notes: selectedUser?.notes || "",
      terms: false,
    },
  });

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        age: selectedUser.age ? String(selectedUser.age) : "",
        role: selectedUser.role || "subscriber",
        premiumStatus: selectedUser.premiumStatus || "basic",
        bio: selectedUser.bio || "",
        location: selectedUser.location || "",
        gender: selectedUser.gender || "male",
        isBanned: selectedUser?.isBanned || false,
        verificationStatus: selectedUser?.verificationStatus || "unverified",
        notes: selectedUser?.notes || "",
        terms: true,
      });
    }
  }, [selectedUser, form]);

  const openUserDialog = () => {
    setIsUserDialogOpen(true);
  };

  const closeUserDialog = () => {
    setIsUserDialogOpen(false);
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      toast.success('User deleted successfully');
      handleCloseDeleteDialog();
    }
  };

  const handleSaveUser = (data: z.infer<typeof userFormSchema>) => {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        name: data.name,
        email: data.email,
        age: parseInt(data.age),
        role: data.role,
        premiumStatus: data.premiumStatus,
        bio: data.bio || "",
        location: data.location || "",
        gender: data.gender,
        isBanned: data.isBanned,
        verificationStatus: data.verificationStatus,
        notes: data.notes,
      };
      
      updateUserData(updatedUser);
      toast.success('User updated successfully');
      setIsDrawerOpen(false);
      
      // Log the activity
      const newLog = {
        userId: updatedUser.id,
        action: 'Profile Updated by Admin',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1' // Would be real IP in production
      };
      setUserActivityLogs(prev => [newLog, ...prev]);
    }
  };

  const addNewUser = () => {
    const newUser: any = {
      id: `user-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      age: parseInt(newUserAge) || 18,
      bio: '',
      location: '',
      interests: [],
      photos: [],
      gender: 'male',
      interestedIn: ['female'],
      popularityPoints: 0,
      premiumStatus: 'basic',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      isBanned: false,
      verificationStatus: "unverified",
      notes: "",
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      role: selectedRole as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
    };
    
    addUser(newUser);
    
    // Reset form fields
    setNewUserName('');
    setNewUserEmail('');
    setNewUserAge('');
    setSelectedRole('subscriber');
    
    // Close the dialog
    setIsUserDialogOpen(false);
    
    // Show success message
    toast.success('User added successfully');
    
    // Log the activity
    const newLog = {
      userId: newUser.id,
      action: 'User Created by Admin',
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1' // Would be real IP in production
    };
    setUserActivityLogs(prev => [newLog, ...prev]);
  };

  const handleOpenDrawer = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setIsDrawerOpen(false);
  };
  
  const exportUserData = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const dataStr = JSON.stringify(allUsers, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'users-export.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast.success('User data exported successfully');
      } catch (error) {
        toast.error('Error exporting user data');
        console.error('Export error:', error);
      } finally {
        setIsExporting(false);
      }
    }, 1000);
  };
  
  const handleImportUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedUsers = JSON.parse(content);
        
        if (Array.isArray(importedUsers)) {
          // In a real app, you would validate and process the imported users here
          importedUsers.forEach(user => {
            // Add logic to import each user
            if (!allUsers.some(u => u.id === user.id)) {
              addUser(user);
            }
          });
          
          toast.success(`${importedUsers.length} users imported successfully`);
        } else {
          toast.error('Invalid user data format');
        }
      } catch (error) {
        toast.error('Error importing user data');
        console.error('Import error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleBanUser = (user: any) => {
    const updatedUser = {
      ...user,
      isBanned: !user.isBanned
    };
    
    updateUserData(updatedUser);
    toast.success(updatedUser.isBanned ? 'User banned successfully' : 'User unbanned successfully');
    
    // Log the activity
    const newLog = {
      userId: user.id,
      action: updatedUser.isBanned ? 'User Banned' : 'User Unbanned',
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1' // Would be real IP in production
    };
    setUserActivityLogs(prev => [newLog, ...prev]);
  };
  
  const findUserById = (userId: string) => {
    return allUsers.find(user => user.id === userId);
  };
  
  const resetFilters = () => {
    setFilters({
      role: 'all',
      premium: 'all',
      gender: 'all',
    });
    setSearchQuery('');
    setShowBanned(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startAutoRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              {refreshInterval ? 'Disable Auto-refresh' : 'Auto-refresh'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportUserData}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Users'}
            </Button>
            
            <label htmlFor="import-users">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isLoading}
                className="flex items-center gap-1"
                asChild
              >
                <div>
                  <Upload className="h-4 w-4" />
                  {isLoading ? 'Importing...' : 'Import Users'}
                </div>
              </Button>
              <input 
                id="import-users" 
                type="file" 
                accept=".json" 
                className="hidden"
                onChange={handleImportUsers}
                disabled={isLoading}
              />
            </label>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.totalUsers}</div>
              <p className="text-[10px] text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">DAU</CardTitle>
              <Activity className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.dailyActiveUsers}</div>
              <p className="text-[10px] text-muted-foreground">+5% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Paying</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.payingUsers}</div>
              <p className="text-[10px] text-muted-foreground">{(analyticsData.payingUsers / analyticsData.totalUsers * 100).toFixed(1)}% of users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Matches</CardTitle>
              <Heart className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.matchesMade}</div>
              <p className="text-[10px] text-muted-foreground">+8% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">New Today</CardTitle>
              <UserX className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.newUsersToday}</div>
              <p className="text-[10px] text-muted-foreground">+12% conversion rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Reported</CardTitle>
              <Flag className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.reportedUsers}</div>
              <p className="text-[10px] text-muted-foreground">-2% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Banned</CardTitle>
              <Shield className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{analyticsData.bannedUsers}</div>
              <p className="text-[10px] text-muted-foreground">{(analyticsData.bannedUsers / analyticsData.totalUsers * 100).toFixed(1)}% of users</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Gifts</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      Filters
                      {(filters.role !== 'all' || filters.premium !== 'all' || filters.gender !== 'all' || showBanned) && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                          !
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Users</h4>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Role</h5>
                        <Select
                          value={filters.role}
                          onValueChange={(value) => setFilters({...filters, role: value})}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="subscriber">Subscriber</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Premium Status</h5>
                        <Select
                          value={filters.premium}
                          onValueChange={(value) => setFilters({...filters, premium: value})}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select premium status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Gender</h5>
                        <Select
                          value={filters.gender}
                          onValueChange={(value) => setFilters({...filters, gender: value})}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-Binary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="banned" 
                          checked={showBanned}
                          onCheckedChange={(checked) => setShowBanned(checked as boolean)}
                        />
                        <label
                          htmlFor="banned"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Only show banned users
                        </label>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full mt-2"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with roles and permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} type="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="age" className="text-right">
                          Age
                        </Label>
                        <Input id="age" value={newUserAge} onChange={(e) => setNewUserAge(e.target.value)} type="number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Role
                        </Label>
                        <Select onValueChange={setSelectedRole} value={selectedRole}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="subscriber">Subscriber</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={addNewUser}>Add User</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[100px]">Role</TableHead>
                    <TableHead className="w-[100px]">Premium</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={cn(
                        user.email === 'hunainm.qureshi@gmail.com' ? 'bg-muted/30' : '',
                        user.isBanned ? 'bg-red-50' : ''
                      )}>
                        <TableCell className="font-medium">{user.id.substring(0, 6)}...</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                            user.role === 'admin' ? "bg-red-100 text-red-800" : "",
                            user.role === 'moderator' ? "bg-blue-100 text-blue-800" : "",
                            user.role === 'vip' ? "bg-purple-100 text-purple-800" : "",
                            user.role === 'subscriber' ? "bg-green-100 text-green-800" : "",
                            user.role === 'trial' ? "bg-yellow-100 text-yellow-800" : "",
                          )}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                            user.premiumStatus === 'basic' ? "bg-gray-100 text-gray-800" : "",
                            user.premiumStatus === 'premium' ? "bg-amber-100 text-amber-800" : "",
                            user.premiumStatus === 'vip' ? "bg-purple-100 text-purple-800" : "",
                          )}>
                            {user.premiumStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive" className="text-xs">Banned</Badge>
                          ) : (
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              user.verificationStatus === 'verified' ? "border-green-500 text-green-700" : "",
                              user.verificationStatus === 'pending' ? "border-yellow-500 text-yellow-700" : "",
                              user.verificationStatus === 'unverified' ? "border-gray-500 text-gray-700" : "",
                            )}>
                              {user.verificationStatus || 'Unverified'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDrawer(user)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleBanUser(user)}>
                                <Shield className="mr-2 h-4 w-4" /> {user.isBanned ? 'Unban' : 'Ban'} User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user
                                        <strong> {user.name} </strong> 
                                        and remove their data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => confirmDeleteUser()}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +20% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages Sent
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.messagesSent}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
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
                  <div className="text-2xl font-bold">{analyticsData.matchesMade}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Profile Views Today
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.profileViewsToday}</div>
                  <p className="text-xs text-muted-foreground">
                    +34% from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>Distribution of user roles across the platform</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-sm">Admin</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.adminUsers}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-red-500" 
                            style={{ width: `${(analyticsData.adminUsers / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm">Moderator</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.moderatorUsers}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${(analyticsData.moderatorUsers / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-sm">Subscriber</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.subscriberUsers}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${(analyticsData.subscriberUsers / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500" />
                            <span className="text-sm">VIP</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.vipUsers}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{ width: `${(analyticsData.vipUsers / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span className="text-sm">Trial</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.trialUsers}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-yellow-500" 
                            style={{ width: `${(analyticsData.trialUsers / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Premium Subscriptions</CardTitle>
                  <CardDescription>Distribution of premium plans</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-gray-400" />
                            <span className="text-sm">Basic</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.premiumDistribution.basic}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-gray-400" 
                            style={{ width: `${(analyticsData.premiumDistribution.basic / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-sm">Premium</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.premiumDistribution.premium}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-amber-500" 
                            style={{ width: `${(analyticsData.premiumDistribution.premium / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500" />
                            <span className="text-sm">VIP</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.premiumDistribution.vip}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-purple-500" 
                            style={{ width: `${(analyticsData.premiumDistribution.vip / analyticsData.totalUsers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                  <CardDescription>Age and gender statistics</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Gender</h4>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-400" />
                                <span className="text-sm">Male</span>
                              </div>
                              <span className="text-sm font-medium">{analyticsData.genderDistribution.male}</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-muted">
                              <div 
                                className="h-2 rounded-full bg-blue-400" 
                                style={{ width: `${(analyticsData.genderDistribution.male / analyticsData.totalUsers) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-pink-400" />
                                <span className="text-sm">Female</span>
                              </div>
                              <span className="text-sm font-medium">{analyticsData.genderDistribution.female}</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-muted">
                              <div 
                                className="h-2 rounded-full bg-pink-400" 
                                style={{ width: `${(analyticsData.genderDistribution.female / analyticsData.totalUsers) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-purple-400" />
                                <span className="text-sm">Non-Binary</span>
                              </div>
                              <span className="text-sm font-medium">{analyticsData.genderDistribution.nonBinary}</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-muted">
                              <div 
                                className="h-2 rounded-full bg-purple-400" 
                                style={{ width: `${(analyticsData.genderDistribution.nonBinary / analyticsData.totalUsers) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                  <CardDescription>Important platform metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Daily Active Users</h4>
                      <p className="text-2xl font-bold">{analyticsData.dailyActiveUsers}</p>
                      <p className="text-xs text-muted-foreground">+8% from last week</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Monthly Active Users</h4>
                      <p className="text-2xl font-bold">{analyticsData.monthlyActiveUsers}</p>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Avg. Session Time</h4>
                      <p className="text-2xl font-bold">{analyticsData.averageSessionTime}</p>
                      <p className="text-xs text-muted-foreground">+2 min from last week</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Conversion Rate</h4>
                      <p className="text-2xl font-bold">{analyticsData.conversionRate}</p>
                      <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">New Users Today</h4>
                      <p className="text-2xl font-bold">{analyticsData.newUsersToday}</p>
                      <p className="text-xs text-muted-foreground">+5 from yesterday</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Retention Rate</h4>
                      <p className="text-2xl font-bold">{analyticsData.retentionRate}</p>
                      <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Paying Users</h4>
                      <p className="text-2xl font-bold">{analyticsData.payingUsers}</p>
                      <p className="text-xs text-muted-foreground">{(analyticsData.payingUsers / analyticsData.totalUsers * 100).toFixed(1)}% of users</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reported Content</h4>
                      <p className="text-2xl font-bold">{analyticsData.reportedUsers}</p>
                      <p className="text-xs text-muted-foreground">-2% from last week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Manage how your dating platform operates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">New User Approvals</div>
                    <div className="text-sm text-muted-foreground">Require admin approval for new user accounts</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Content Moderation</div>
                    <div className="text-sm text-muted-foreground">Auto-moderate images and messages</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Send email notifications for admin events</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Require 2FA for all admin accounts</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Auto-Moderation AI</div>
                    <div className="text-sm text-muted-foreground">Use AI to detect inappropriate content</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Activity Logging</div>
                    <div className="text-sm text-muted-foreground">Log all admin actions for audit purposes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">User IP Tracking</div>
                    <div className="text-sm text-muted-foreground">Track user IP addresses for security</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how notifications are sent to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">New Match Email</div>
                    <div className="text-sm text-muted-foreground">Send email when users match</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">New Message Email</div>
                    <div className="text-sm text-muted-foreground">Send email when users receive new messages</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Profile View Email</div>
                    <div className="text-sm text-muted-foreground">Send email when profile is viewed</div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Marketing Emails</div>
                    <div className="text-sm text-muted-foreground">Send marketing emails to users</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* GIFTS TAB */}
          <TabsContent value="gifts" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Gift Management</CardTitle>
                <CardDescription>Manage virtual gifts available in the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gift Name</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Price (Coins)</TableHead>
                        <TableHead>Popularity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Rose</TableCell>
                        <TableCell>🌹</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>High</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Heart</TableCell>
                        <TableCell>❤️</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>Very High</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Teddy Bear</TableCell>
                        <TableCell>🧸</TableCell>
                        <TableCell>200</TableCell>
                        <TableCell>Medium</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Diamond</TableCell>
                        <TableCell>💎</TableCell>
                        <TableCell>500</TableCell>
                        <TableCell>Low</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                            Coming Soon
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Champagne</TableCell>
                        <TableCell>🍾</TableCell>
                        <TableCell>350</TableCell>
                        <TableCell>Medium</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ring</TableCell>
                        <TableCell>💍</TableCell>
                        <TableCell>1000</TableCell>
                        <TableCell>Low</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Gift
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gift Analytics</CardTitle>
                <CardDescription>Gift purchase and usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Most Popular Gifts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">❤️</span>
                              <span className="text-sm">Heart</span>
                            </div>
                            <span className="text-sm font-medium">482 sent</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-love-500" style={{ width: '80%' }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🌹</span>
                              <span className="text-sm">Rose</span>
                            </div>
                            <span className="text-sm font-medium">356 sent</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-red-500" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🧸</span>
                              <span className="text-sm">Teddy Bear</span>
                            </div>
                            <span className="text-sm font-medium">212 sent</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-amber-500" style={{ width: '40%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Gift Revenue</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold">$3,251</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">$12,763</div>
                        <p className="text-xs text-muted-foreground">Year to date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                <CardDescription>Handle reported content and user violations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reported User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.id}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.reportedUser}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              report.status === 'pending' ? "bg-red-100 text-red-800" : "",
                              report.status === 'investigating' ? "bg-blue-100 text-blue-800" : "",
                              report.status === 'resolved' ? "bg-green-100 text-green-800" : "",
                            )}>
                              {report.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <h4 className="text-sm font-medium mt-6 mb-2">Report Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Pending Reports</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Under Investigation</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">28</div>
                        <p className="text-xs text-muted-foreground">Resolved This Week</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Activity Logs</CardTitle>
                <CardDescription>Monitor user and admin actions across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivityLogs.map((log, index) => {
                        const user = findUserById(log.userId) || { name: 'Unknown User' };
                        return (
                          <TableRow key={index}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.ip}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Load More
                    </Button>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="profile">Profile Updates</SelectItem>
                        <SelectItem value="message">Messages</SelectItem>
                        <SelectItem value="gift">Gifts</SelectItem>
                        <SelectItem value="admin">Admin Actions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor platform performance and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Server Status</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm">API Server</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm">Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm">Storage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-sm">Cache</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Response Time</h4>
                    <div className="text-2xl font-bold">128ms</div>
                    <p className="text-xs text-muted-foreground">Average over last hour</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Error Rate</h4>
                    <div className="text-2xl font-bold">0.03%</div>
                    <p className="text-xs text-muted-foreground">In last 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit User Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Edit User</DrawerTitle>
            <DrawerDescription>
              Update user details and permissions. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {selectedUser && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveUser)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
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
                                <SelectValue placeholder="Select a gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-Binary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="subscriber">Subscriber</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                              <SelectItem value="trial">Trial</SelectItem>
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
                                <SelectValue placeholder="Select a premium status" />
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
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    
                    <FormField
                      control={form.control}
                      name="verificationStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select verification status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unverified">Unverified</SelectItem>
                              <SelectItem value="pending">Pending Verification</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="User bio" 
                            className="resize-none" 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Add notes about this user (only visible to admins)" 
                            className="resize-none" 
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          These notes are only visible to administrators.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isBanned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ban this user
                          </FormLabel>
                          <FormDescription>
                            Banned users cannot log in or use the platform.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Accept terms and conditions
                          </FormLabel>
                          <FormDescription>
                            User has agreed to the terms and privacy policy.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {selectedUser?.joinDate && (
                    <div className="flex items-center justify-between rounded-md border p-4 text-sm">
                      <div>
                        <strong>Joined:</strong> {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </div>
                      {selectedUser?.lastActive && (
                        <div>
                          <strong>Last Active:</strong> {new Date(selectedUser.lastActive).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handleCloseDrawer}>Cancel</Button>
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Admin;
