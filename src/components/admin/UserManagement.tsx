import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, Check, Download, Edit, Upload, UserPlus, X, Shield, Trash } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useTestMode } from "@/context/TestModeContext";

const UserManagement = () => {
  const { allUsers, addUser, deleteUser, updateUserData } = useUser();
  const { isTestMode, demoProfiles } = useTestMode();
  const [activeTab, setActiveTab] = useState("all-users");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    age: 18,
    gender: "female",
    role: "subscriber",
    isBanned: false,
    verificationStatus: "unverified",
  });
  
  const displayUsers = isTestMode ? [...demoProfiles, ...allUsers] : allUsers;
  
  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all-users") return matchesSearch;
    if (activeTab === "admins") return matchesSearch && user.role === "admin";
    if (activeTab === "moderators") return matchesSearch && user.role === "moderator";
    if (activeTab === "subscribers") return matchesSearch && user.role === "subscriber";
    if (activeTab === "banned") return matchesSearch && user.isBanned;
    
    return false;
  });
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      age: newUser.age || 25,
      bio: "",
      location: "",
      interests: [],
      photos: [],
      gender: newUser.gender as "male" | "female" | "non-binary",
      interestedIn: ["male", "female"],
      popularityPoints: 0,
      premiumStatus: "basic",
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: [],
      role: newUser.role as "admin" | "moderator" | "subscriber" | "vip" | "trial",
      isBanned: newUser.isBanned || false,
      verificationStatus: newUser.verificationStatus as "verified" | "unverified" | "pending" | "rejected",
      lastMessage: "",
      lastMessageTime: new Date(),
      status: "offline",
      favoriteMusic: [],
      voiceIntro: "",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "",
        accountType: ""
      }
    };
    
    addUser(user);
    setShowAddUser(false);
    setNewUser({
      name: "",
      email: "",
      age: 18,
      gender: "female",
      role: "subscriber",
      isBanned: false,
      verificationStatus: "unverified",
    });
    
    toast.success("User added successfully");
  };
  
  const handleDeleteUser = (userId: string) => {
    if (isTestMode && demoProfiles.some(user => user.id === userId)) {
      toast.error("Cannot delete demo users", {
        description: "Demo users are read-only in test mode."
      });
      return;
    }
    
    deleteUser(userId);
    toast.success("User deleted successfully");
  };
  
  const handleBanUser = (userId: string, isBanned: boolean) => {
    if (isTestMode && demoProfiles.some(user => user.id === userId)) {
      toast.error("Cannot modify demo users", {
        description: "Demo users are read-only in test mode."
      });
      return;
    }
    
    updateUserData(userId, { isBanned });
    toast.success(isBanned ? "User banned successfully" : "User unbanned successfully");
  };
  
  const handleVerifyUser = (userId: string, status: "verified" | "unverified" | "pending" | "rejected") => {
    if (isTestMode && demoProfiles.some(user => user.id === userId)) {
      toast.error("Cannot modify demo users", {
        description: "Demo users are read-only in test mode."
      });
      return;
    }
    
    updateUserData(userId, { verificationStatus: status });
    toast.success(`User verification status updated to ${status}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-love-800">User Management</h2>
          <p className="text-love-600">Manage users and permissions {isTestMode && <Badge className="ml-1 bg-love-500">Test Mode</Badge>}</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-love-500" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddUser(true)} className="bg-love-600 hover:bg-love-700">
            <UserPlus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>
      
      {showAddUser && (
        <Card className="luxury-card add-user-form">
          <CardHeader className="pb-2">
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="form-grid">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={newUser.age || ""} 
                  onChange={(e) => setNewUser({...newUser, age: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={newUser.gender || "female"} 
                  onValueChange={(value) => setNewUser({...newUser, gender: value as "male" | "female" | "non-binary"})}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role || "subscriber"} 
                  onValueChange={(value) => setNewUser({...newUser, role: value as "admin" | "moderator" | "subscriber" | "vip" | "trial"})}
                >
                  <SelectTrigger id="role">
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
              
              <div className="space-y-2">
                <Label htmlFor="verification">Verification Status</Label>
                <Select 
                  value={newUser.verificationStatus || "unverified"} 
                  onValueChange={(value) => setNewUser({...newUser, verificationStatus: value as "verified" | "unverified" | "pending" | "rejected"})}
                >
                  <SelectTrigger id="verification">
                    <SelectValue placeholder="Select verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Switch 
                  id="is-banned" 
                  checked={newUser.isBanned || false}
                  onCheckedChange={(checked) => setNewUser({...newUser, isBanned: checked})}
                />
                <Label htmlFor="is-banned">Banned User</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button className="bg-love-600 hover:bg-love-700" onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="overflow-x-auto admin-table-container">
            <table className="w-full luxury-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-love-600">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} data-user-id={user.id} className={user.isDemo ? "bg-love-50/50" : ""}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.photos && user.photos.length > 0 ? user.photos[0] : undefined} />
                            <AvatarFallback className="bg-love-200 text-love-700">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center">
                              {user.name} 
                              {user.isDemo && (
                                <Badge variant="outline" className="ml-2 border-love-300 text-love-600 text-xs">Demo</Badge>
                              )}
                            </div>
                            <div className="text-sm text-love-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge 
                          className={
                            user.role === "admin" ? "bg-love-600" :
                            user.role === "moderator" ? "bg-amber-500" :
                            user.role === "vip" ? "bg-emerald-500" :
                            user.role === "trial" ? "bg-blue-500" :
                            "bg-slate-400"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div 
                            className={`w-2 h-2 rounded-full mr-2 ${
                              user.status === "online" ? "bg-green-500" :
                              user.status === "away" ? "bg-amber-500" :
                              "bg-slate-300"
                            }`}
                          />
                          <span className="capitalize">{user.status}</span>
                          {user.isBanned && (
                            <Badge variant="destructive" className="ml-2">Banned</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge 
                          className={
                            user.verificationStatus === "verified" ? "bg-green-500" :
                            user.verificationStatus === "pending" ? "bg-amber-500" :
                            user.verificationStatus === "rejected" ? "bg-red-500" :
                            "bg-slate-400"
                          }
                        >
                          {user.verificationStatus}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`${user.isBanned ? "text-red-500" : "text-love-600"}`}
                            onClick={() => handleBanUser(user.id, !user.isBanned)}
                            disabled={user.isDemo}
                          >
                            {user.isBanned ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" /> 
                                Unban
                              </>
                            ) : (
                              <>
                                <Ban className="h-3.5 w-3.5 mr-1" /> 
                                Ban
                              </>
                            )}
                          </Button>
                          
                          {user.verificationStatus !== "verified" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600"
                              onClick={() => handleVerifyUser(user.id, "verified")}
                              disabled={user.isDemo}
                            >
                              <Shield className="h-3.5 w-3.5 mr-1" /> Verify
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.isDemo}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredUsers.length}</span> users 
              {isTestMode && <span className="text-love-600"> (including demo users)</span>}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Download className="h-4 w-4 mr-2" /> Export Users
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Upload className="h-4 w-4 mr-2" /> Import Users
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
