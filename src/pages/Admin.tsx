import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { allUsers, addUser, deleteUser, updateUserData, updateUserProfile } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
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
              premiumStatus: profile.premium_status || 'basic',
              role: profile.role || 'subscriber',
              isBanned: profile.is_banned || false,
              verificationStatus: profile.is_verified ? 'verified' : 'unverified',
              personalityTraits: profile.personality_traits || [],
              giftInventory: { rose: 0, heart: 0, teddy: 0 },
              receivedGifts: { rose: 0, heart: 0, teddy: 0 },
              compatibilityScore: 0,
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
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        setError(err.message);
        toast("Failed to load users. Please try again.", {
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (user: User) => {
    updateUserProfile(user.id, user);
    toast("User Updated", {
      description: `User ${user.name} has been updated.`
    });
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  const handleOpenEditDialog = (user: User) => {
    setEditUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditUser(null);
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (editUser) {
      setEditUser({ ...editUser, [field]: e.target.value });
    }
  };

  const handleRoleChange = (role: User['role']) => {
    if (editUser) {
      setEditUser({ ...editUser, role: role });
    }
  };

  const handleBanChange = (isBanned: boolean) => {
    if (editUser) {
      setEditUser({ ...editUser, isBanned: isBanned });
    }
  };

  const handleVerificationChange = (verificationStatus: User['verificationStatus']) => {
    if (editUser) {
      setEditUser({ ...editUser, verificationStatus: verificationStatus });
    }
  };

  const handleSave = () => {
    if (editUser) {
      handleUserUpdate(editUser);
      handleCloseEditDialog();
    }
  };

  const handleCancel = () => {
    handleCloseEditDialog();
  };

  const confirmDelete = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setUserIdToDelete(null);
    setIsDeleteDialogOpen(false);
    setConfirmed(false);
  };

  const handleDelete = (userId: string) => {
    setConfirmed(true);
    if (confirmed) {
      deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setIsDeleteDialogOpen(false);
      setConfirmed(false);
      toast("User Deleted", {
        description: "User has been successfully deleted."
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEditDialog(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={editUser.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={editUser.email}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  type="number"
                  id="age"
                  value={editUser.age}
                  onChange={(e) => handleInputChange(e, 'age')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={editUser.bio}
                  onChange={(e) => handleInputChange(e, 'bio')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  type="text"
                  id="location"
                  value={editUser.location}
                  onChange={(e) => handleInputChange(e, 'location')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={editUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
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
                <Label htmlFor="isBanned" className="text-right">
                  Banned
                </Label>
                <Switch
                  id="isBanned"
                  checked={editUser.isBanned}
                  onCheckedChange={handleBanChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verificationStatus" className="text-right">
                  Verification
                </Label>
                <Select value={editUser.verificationStatus} onValueChange={handleVerificationChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={() => handleDelete(userIdToDelete!)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
