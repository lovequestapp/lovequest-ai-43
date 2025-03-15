
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
import { MoreVertical, Edit, Trash2, Plus, Users, Activity, Settings, Gift, Shield, BookOpen, DollarSign, BarChart3, BarChart, Search, Heart } from 'lucide-react';
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }
  
  // Filtered users based on search query
  const filteredUsers = allUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
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
    profileViewsToday: 562 // Example data
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
      };
      
      updateUserData(updatedUser);
      toast.success('User updated successfully');
      setIsDrawerOpen(false);
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
  };

  const handleOpenDrawer = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setIsDrawerOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="users" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
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
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>
          
          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" />
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
                      <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
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

            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={user.email === 'hunainm.qureshi@gmail.com' ? 'bg-muted/30' : ''}>
                        <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
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
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            user.premiumStatus === 'basic' ? "bg-gray-100 text-gray-800" : "",
                            user.premiumStatus === 'premium' ? "bg-amber-100 text-amber-800" : "",
                            user.premiumStatus === 'vip' ? "bg-love-100 text-love-800" : "",
                          )}>
                            {user.premiumStatus}
                          </span>
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
                            <div className="h-3 w-3 rounded-full bg-love-500" />
                            <span className="text-sm">VIP</span>
                          </div>
                          <span className="text-sm font-medium">{analyticsData.premiumDistribution.vip}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div 
                            className="h-2 rounded-full bg-love-500" 
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
              </CardContent>
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
                    </TableBody>
                  </Table>
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
                      <TableRow>
                        <TableCell>RPT-1234</TableCell>
                        <TableCell>Profile</TableCell>
                        <TableCell>john.doe@example.com</TableCell>
                        <TableCell>Inappropriate photo</TableCell>
                        <TableCell>2023-06-15</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>RPT-1235</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>sarah.smith@example.com</TableCell>
                        <TableCell>Harassment</TableCell>
                        <TableCell>2023-06-14</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            Resolved
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>RPT-1236</TableCell>
                        <TableCell>Profile</TableCell>
                        <TableCell>mike.jones@example.com</TableCell>
                        <TableCell>Fake profile</TableCell>
                        <TableCell>2023-06-13</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                            Investigating
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button type="submit">Save changes</Button>
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
