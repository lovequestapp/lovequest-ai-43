
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { UserIcon, Eye, Ban, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileModeration = () => {
  const [profiles, setProfiles] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", age: 28, bio: "I love hiking and outdoor activities", photos: [], verificationStatus: "pending", isFlagged: true },
    { id: "2", name: "Jane Smith", email: "jane@example.com", age: 24, bio: "Looking for meaningful connections", photos: [], verificationStatus: "pending", isFlagged: false }
  ]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);
  };
  
  const handleVerifyProfile = (profileId: string) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, verificationStatus: "verified", isFlagged: false } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => prev ? { ...prev, verificationStatus: "verified", isFlagged: false } : null);
    }
    
    toast("Profile verified successfully");
  };
  
  const handleRejectProfile = (profileId: string) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, verificationStatus: "rejected" } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => prev ? { ...prev, verificationStatus: "rejected" } : null);
    }
    
    toast("Profile rejected");
  };
  
  const handleBanProfile = (profileId: string) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, isBanned: true } : profile
    ));
    
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(prev => prev ? { ...prev, isBanned: true } : null);
    }
    
    toast("Profile banned successfully");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-love-500" />
            Profile Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{profile.name}</div>
                          <div className="text-xs text-muted-foreground">{profile.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.age}
                    </TableCell>
                    <TableCell>
                      {profile.photos?.length || 0}
                    </TableCell>
                    <TableCell>
                      {profile.verificationStatus === "pending" ? (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      ) : profile.verificationStatus === "verified" ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.isFlagged ? (
                        <Badge variant="destructive" className="text-xs">
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
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
                        
                        {profile.verificationStatus === "pending" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleVerifyProfile(profile.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-amber-600"
                              onClick={() => handleRejectProfile(profile.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleBanProfile(profile.id)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {profiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No profiles to moderate
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
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">{selectedProfile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Name</h4>
                <p>{selectedProfile.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Email</h4>
                <p>{selectedProfile.email}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Age</h4>
                <p>{selectedProfile.age}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Bio</h4>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedProfile.bio}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Status</h4>
                <p className="capitalize">{selectedProfile.verificationStatus}</p>
                {selectedProfile.isFlagged && (
                  <Badge variant="destructive" className="mt-1">Flagged for review</Badge>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {selectedProfile?.verificationStatus === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  className="text-green-600"
                  onClick={() => handleVerifyProfile(selectedProfile.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify
                </Button>
                
                <Button 
                  variant="outline"
                  className="text-amber-600"
                  onClick={() => handleRejectProfile(selectedProfile.id)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            
            <Button 
              variant="outline"
              className="text-red-600"
              onClick={() => handleBanProfile(selectedProfile.id)}
            >
              <Ban className="h-4 w-4 mr-2" />
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileModeration;
