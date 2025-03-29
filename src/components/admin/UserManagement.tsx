
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, UserPlus, Filter, Download, MoreVertical, Edit, Trash2, Ban, UserCheck, Key, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'subscriber',
    premiumStatus: 'basic',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Sorting
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortField, sortDirection, roleFilter, statusFilter]);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) || 
        user.email.toLowerCase().includes(lowerQuery) ||
        user.location?.toLowerCase().includes(lowerQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      if (statusFilter === 'verified') {
        query = query.eq('is_verified', true);
      } else if (statusFilter === 'unverified') {
        query = query.eq('is_verified', false);
      } else if (statusFilter === 'banned') {
        query = query.eq('is_banned', true);
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Map data to User objects
        const mappedUsers = data.map(profile => {
          let validGender: 'male' | 'female' | 'non-binary' = 'non-binary';
          if (profile.gender === 'male' || profile.gender === 'female' || profile.gender === 'non-binary') {
            validGender = profile.gender as 'male' | 'female' | 'non-binary';
          }
          
          const validInterestedIn: ('male' | 'female' | 'non-binary')[] = [];
          if (Array.isArray(profile.interested_in)) {
            profile.interested_in.forEach(interest => {
              if (interest === 'male' || interest === 'female' || interest === 'non-binary') {
                validInterestedIn.push(interest as 'male' | 'female' | 'non-binary');
              }
            });
          }
          
          return {
            id: profile.id,
            name: profile.name || 'N/A',
            email: profile.email || 'N/A',
            age: profile.age || 0,
            bio: profile.bio || '',
            location: profile.location || '',
            interests: profile.interests || [],
            photos: profile.photos || [],
            gender: validGender,
            interestedIn: validInterestedIn,
            popularityPoints: profile.popularity_points || 0,
            premiumStatus: (profile.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
            giftInventory: { rose: 0, heart: 0, teddy: 0 },
            receivedGifts: { rose: 0, heart: 0, teddy: 0 },
            compatibilityScore: 0,
            personalityTraits: profile.personality_traits || [],
            role: (profile.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
            isBanned: profile.is_banned || false,
            verificationStatus: profile.is_verified ? 'verified' : 'unverified',
            lastMessage: '',
            lastMessageTime: new Date(),
            status: 'offline',
            favoriteMusic: [],
            voiceIntro: '',
            bankDetails: {
              accountName: '',
              accountNumber: '',
              bankName: '',
              routingNumber: '',
              accountType: ''
            }
          } as User;
        });
        
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
        setTotalUsers(count || 0);
      }
    } catch (err: any) {
      toast("Failed to load users", { 
        description: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // 2. Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            premium_status: newUser.premiumStatus,
            created_at: new Date().toISOString()
          }]);

        if (profileError) throw profileError;

        toast("User created successfully");
        setIsAddUserDialogOpen(false);
        // Reset form
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'subscriber',
          premiumStatus: 'basic',
        });
        // Refresh user list
        fetchUsers();
      }
    } catch (error: any) {
      toast("Failed to create user", {
        description: error.message,
      });
    }
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          bio: selectedUser.bio,
          age: selectedUser.age,
          location: selectedUser.location,
          gender: selectedUser.gender,
          interested_in: selectedUser.interestedIn,
          role: selectedUser.role,
          premium_status: selectedUser.premiumStatus,
          is_banned: selectedUser.isBanned,
          is_verified: selectedUser.verificationStatus === 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast("User updated successfully");
      setIsEditUserDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast("Failed to update user", {
        description: error.message
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.id
      );

      if (authError) throw authError;

      toast("User deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast("Failed to delete user", {
        description: error.message
      });
    }
  };

  const toggleBanStatus = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !user.isBanned })
        .eq('id', user.id);

      if (error) throw error;

      toast(user.isBanned ? "User unbanned successfully" : "User banned successfully");
      fetchUsers();
    } catch (error: any) {
      toast("Failed to update ban status", {
        description: error.message
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast("Password reset email sent", {
        description: "The user will receive an email with instructions."
      });
    } catch (error: any) {
      toast("Failed to send reset email", {
        description: error.message
      });
    }
  };

  const exportUsers = () => {
    const data = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      location: user.location,
      gender: user.gender,
      premium_status: user.premiumStatus,
      role: user.role,
      is_banned: user.isBanned,
      verification_status: user.verificationStatus
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0] || {}).join(",") + "\n" +
      data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(",")
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: e.target.value });
    }
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewUser({ ...newUser, [field]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    if (selectedUser) {
      setSelectedUser({ 
        ...selectedUser, 
        role: value as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial' 
      });
    }
  };

  const handlePremiumStatusChange = (value: string) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        premiumStatus: value as 'basic' | 'premium' | 'vip'
      });
    }
  };

  const handleVerificationChange = (value: string) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        verificationStatus: value as 'verified' | 'unverified' | 'pending' | 'rejected'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by role" />
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={exportUsers}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button 
                className="w-full md:w-auto"
                onClick={() => setIsAddUserDialogOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => {
                          if (sortField === 'name') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('name');
                            setSortDirection('asc');
                          }
                        }}
                      >
                        Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              user.role === 'admin' ? 'destructive' :
                              user.role === 'moderator' ? 'secondary' :
                              user.role === 'vip' ? 'outline' : 'default'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.premiumStatus === 'vip' ? 'outline' :
                              user.premiumStatus === 'premium' ? 'secondary' : 'default'
                            }>
                              {user.premiumStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.isBanned ? (
                              <Badge variant="destructive">Banned</Badge>
                            ) : user.verificationStatus === 'verified' ? (
                              <Badge variant="success">Verified</Badge>
                            ) : (
                              <Badge variant="outline">Unverified</Badge>
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
                                <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => resetPassword(user.email)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleBanStatus(user)}>
                                  {user.isBanned ? (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Unban User
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="mr-2 h-4 w-4" />
                                      Ban User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {totalUsers} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {Math.ceil(totalUsers / itemsPerPage)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(Math.ceil(totalUsers / itemsPerPage), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(totalUsers / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specified permissions
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-name"
                value={newUser.name}
                onChange={(e) => handleNewUserInputChange(e, 'name')}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">
                Email
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => handleNewUserInputChange(e, 'email')}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => handleNewUserInputChange(e, 'password')}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-role" className="text-right">
                Role
              </Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="new-role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscriber">Subscriber</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subscription" className="text-right">
                Subscription
              </Label>
              <Select 
                value={newUser.premiumStatus} 
                onValueChange={(value) => setNewUser({...newUser, premiumStatus: value})}
              >
                <SelectTrigger id="new-subscription" className="col-span-3">
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    value={selectedUser.email}
                    className="col-span-3"
                    disabled
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={selectedUser.age || ''}
                    onChange={(e) => handleInputChange(e, 'age')}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="edit-location"
                    value={selectedUser.location || ''}
                    onChange={(e) => handleInputChange(e, 'location')}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-bio" className="text-right">
                    Bio
                  </Label>
                  <Textarea
                    id="edit-bio"
                    value={selectedUser.bio || ''}
                    onChange={(e) => handleInputChange(e, 'bio')}
                    className="col-span-3"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-gender" className="text-right">
                    Gender
                  </Label>
                  <Select value={selectedUser.gender} onValueChange={(value) => 
                    setSelectedUser({
                      ...selectedUser, 
                      gender: value as 'male' | 'female' | 'non-binary'
                    })
                  }>
                    <SelectTrigger id="edit-gender" className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Created
                  </Label>
                  <div className="col-span-3 text-sm">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Reset Password
                  </Label>
                  <div className="col-span-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => resetPassword(selectedUser.email)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Role
                  </Label>
                  <Select value={selectedUser.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="edit-role" className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscriber">Subscriber</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subscription" className="text-right">
                    Subscription
                  </Label>
                  <Select value={selectedUser.premiumStatus} onValueChange={handlePremiumStatusChange}>
                    <SelectTrigger id="edit-subscription" className="col-span-3">
                      <SelectValue placeholder="Select subscription" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-verification" className="text-right">
                    Verification
                  </Label>
                  <Select value={selectedUser.verificationStatus} onValueChange={handleVerificationChange}>
                    <SelectTrigger id="edit-verification" className="col-span-3">
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-ban" className="text-right">
                    Ban Status
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch 
                      id="edit-ban"
                      checked={selectedUser.isBanned}
                      onCheckedChange={(checked) => 
                        setSelectedUser({...selectedUser, isBanned: checked})
                      }
                    />
                    <Label htmlFor="edit-ban">
                      {selectedUser.isBanned ? 'Banned' : 'Active'}
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
