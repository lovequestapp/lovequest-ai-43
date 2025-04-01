
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { User } from '@/types/user';
import { Shield, Eye, Flag, Check, Ban, UserCheck, XCircle, Lock, Unlock } from 'lucide-react';

const ProfileModeration = () => {
  const { allUsers } = useUser();
  const [flaggedProfiles, setFlaggedProfiles] = useState([
    { 
      id: "user-123", 
      name: "John Doe", 
      reportCount: 3,
      reason: "Inappropriate photos",
      status: "flagged", 
      isBanned: false,
      createdAt: new Date() 
    },
    { 
      id: "user-456", 
      name: "Jane Smith", 
      reportCount: 5,
      reason: "Harassment",
      status: "flagged", 
      isBanned: false,
      createdAt: new Date(Date.now() - 86400000 * 3) 
    },
    { 
      id: "user-789", 
      name: "Alex Johnson", 
      reportCount: 2,
      reason: "Impersonation",
      status: "flagged", 
      isBanned: true,
      createdAt: new Date(Date.now() - 86400000 * 5)
    }
  ]);
  
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);
  };
  
  const handleVerifyProfile = (profileId: string) => {
    setFlaggedProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, status: "verified" } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => ({ ...prev, status: "verified" }));
    }
    
    toast.success("Profile has been verified");
  };
  
  const handleBanProfile = (profileId: string) => {
    setFlaggedProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, isBanned: true } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => ({ ...prev, isBanned: true }));
    }
    
    toast.success("User has been banned");
  };
  
  const handleUnbanProfile = (profileId: string) => {
    setFlaggedProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, isBanned: false } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => ({ ...prev, isBanned: false }));
    }
    
    toast.success("User has been unbanned");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5 text-love-500" />
            Flagged Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Report Count</TableHead>
                  <TableHead>Main Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Account Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.name}
                    </TableCell>
                    <TableCell>
                      {profile.reportCount}
                    </TableCell>
                    <TableCell>
                      {profile.reason}
                    </TableCell>
                    <TableCell>
                      {profile.isBanned ? (
                        <Badge variant="destructive" className="text-xs">
                          <Ban className="h-3 w-3 mr-1" />
                          Banned
                        </Badge>
                      ) : profile.status === "verified" ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewProfile(profile)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {!profile.isBanned && profile.status !== "verified" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleVerifyProfile(profile.id)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {!profile.isBanned ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleBanProfile(profile.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-amber-600"
                            onClick={() => handleUnbanProfile(profile.id)}
                          >
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {flaggedProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No flagged profiles to moderate
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile details dialog */}
      <Dialog open={selectedProfile !== null} onOpenChange={(open) => !open && setSelectedProfile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">User Name</h4>
                <p>{selectedProfile.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">User ID</h4>
                <p>{selectedProfile.id}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Reports Received</h4>
                <p>{selectedProfile.reportCount} reports</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Main Reason</h4>
                <p>{selectedProfile.reason}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Account Status</h4>
                <p className="capitalize">
                  {selectedProfile.isBanned ? "Banned" : selectedProfile.status}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Account Created</h4>
                <p>{new Date(selectedProfile.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {selectedProfile && !selectedProfile.isBanned && selectedProfile.status !== "verified" && (
              <Button 
                variant="outline" 
                className="text-green-600"
                onClick={() => handleVerifyProfile(selectedProfile.id)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Verify
              </Button>
            )}
            
            {selectedProfile && !selectedProfile.isBanned ? (
              <Button 
                variant="destructive"
                onClick={() => handleBanProfile(selectedProfile.id)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Ban User
              </Button>
            ) : selectedProfile && (
              <Button 
                variant="outline"
                className="text-amber-600"
                onClick={() => handleUnbanProfile(selectedProfile.id)}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unban User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileModeration;
