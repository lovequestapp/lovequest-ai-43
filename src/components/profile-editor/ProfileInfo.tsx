
import React from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileInfoProps {
  profile?: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const { currentUser } = useUser();
  const userData = profile || currentUser;

  if (!userData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-24 w-24 border-2 border-love-100">
          <AvatarImage src={userData.photos?.[0] || ''} alt={userData.name} />
          <AvatarFallback className="text-2xl bg-love-100 text-love-800">
            {userData.name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            <Badge variant="outline" className="bg-love-50 text-love-700">
              {userData.premiumStatus?.charAt(0).toUpperCase() + userData.premiumStatus?.slice(1) || 'Basic'}
            </Badge>
            {userData.verificationStatus === 'verified' && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Verified
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600">{userData.email}</p>
          <p className="text-gray-600">{userData.location || 'No location set'}</p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <p className="text-gray-600">
          {userData.bio || 'No bio available. Add one by editing your profile!'}
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {userData.interests && userData.interests.length > 0 ? (
            userData.interests.map((interest: string, index: number) => (
              <Badge key={index} variant="secondary">
                {interest}
              </Badge>
            ))
          ) : (
            <p className="text-gray-600">No interests added yet</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Popularity</p>
              <p className="text-2xl font-semibold">{userData.popularityPoints || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Gifts Received</p>
              <p className="text-2xl font-semibold">
                {userData.receivedGifts ? Object.values(userData.receivedGifts).reduce((sum: number, value: number) => sum + value, 0) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Account Level</p>
              <p className="text-2xl font-semibold capitalize">{userData.premiumStatus || 'basic'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;
