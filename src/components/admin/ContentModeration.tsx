import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Shield, MessageSquare, AlertTriangle, Flag, FileText } from 'lucide-react';
import BlogModeration from './BlogModeration';
import ReportModeration from './ReportModeration';
import MessageModeration from './MessageModeration';
import ProfileModeration from './ProfileModeration';

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState('reports');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Shield className="mr-2 h-5 w-5 text-love-500" />
        <h2 className="text-xl font-semibold">Content Moderation</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-1">
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports">
          <ReportModeration />
        </TabsContent>
        
        <TabsContent value="messages">
          <MessageModeration />
        </TabsContent>
        
        <TabsContent value="profiles">
          <ProfileModeration />
        </TabsContent>
        
        <TabsContent value="blog">
          <BlogModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentModeration;
