
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EditProfile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" defaultValue="28" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="New York, NY" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                rows={4}
                defaultValue="I enjoy hiking, photography, and trying new restaurants."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profile Photos</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center">
                  <span className="text-slate-400">+ Add</span>
                </div>
                {/* Additional photo slots would go here */}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-love">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
