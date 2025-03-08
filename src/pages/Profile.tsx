
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Edit2, Plus, X } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUserProfile } = useUser();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(currentUser);
  const [newInterest, setNewInterest] = useState('');
  
  if (!currentUser || !profile) {
    return null;
  }
  
  const handleSave = () => {
    if (profile) {
      updateUserProfile(profile);
      setEditing(false);
    }
  };
  
  const handleCancel = () => {
    setProfile(currentUser);
    setEditing(false);
  };
  
  const handleAddInterest = () => {
    if (newInterest.trim() && profile) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (index: number) => {
    if (profile) {
      const newInterests = [...profile.interests];
      newInterests.splice(index, 1);
      setProfile({
        ...profile,
        interests: newInterests
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">My Profile</h1>
          
          {!editing ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-love hover:opacity-90"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-love-100 flex items-center justify-center mb-4">
                    {profile.photos && profile.photos.length > 0 ? (
                      <img 
                        src={profile.photos[0]} 
                        alt={profile.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-love-500" />
                    )}
                  </div>
                  
                  {editing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="text-center font-semibold text-xl mb-1"
                    />
                  ) : (
                    <h2 className="font-semibold text-xl mb-1">{profile.name}</h2>
                  )}
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin size={16} className="mr-1" />
                    {editing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <span>{profile.location}</span>
                    )}
                  </div>
                  
                  {editing ? (
                    <Button variant="outline" className="w-full">
                      Upload New Photo
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">About Me</h3>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="mt-2"
                      rows={5}
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{profile.bio}</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <Label className="mb-2 block">Interests</Label>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-love-50 text-love-700 hover:bg-love-100 py-1.5 px-3"
                      >
                        {interest}
                        {editing && (
                          <button 
                            className="ml-2 text-love-500 hover:text-love-700"
                            onClick={() => handleRemoveInterest(index)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  
                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add new interest"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleAddInterest}
                        disabled={!newInterest.trim()}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="age">Age</Label>
                  {editing ? (
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || profile.age})}
                      className="mt-2 max-w-xs"
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{profile.age}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
