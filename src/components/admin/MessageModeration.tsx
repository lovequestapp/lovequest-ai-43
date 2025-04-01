
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { MessageSquare, Eye, Ban, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

// Define the Message type to match what we get from the database
interface Message {
  id: string;
  sender_id: string | null;
  receiver_id: string | null;
  content: string | null;
  timestamp: string | null;
  is_flagged: boolean | null;
  status: string | null;
  is_read: boolean | null;
}

const MessageModeration = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFlaggedMessages();
  }, []);
  
  const fetchFlaggedMessages = async () => {
    try {
      setLoading(true);
      // Use type assertion to tell TypeScript this is valid
      const { data, error } = await (supabase
        .from('messages') as any)
        .select('*')
        .eq('is_flagged', true)
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setMessages(data as Message[]);
      }
    } catch (error) {
      console.error('Error fetching flagged messages:', error);
      toast.error('Failed to load flagged messages');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
  };
  
  const handleApproveMessage = async (messageId: string) => {
    try {
      // Use type assertion to tell TypeScript this is valid
      const { error } = await (supabase
        .from('messages') as any)
        .update({ 
          status: 'approved', 
          is_flagged: false 
        })
        .eq('id', messageId);
        
      if (error) {
        throw error;
      }
      
      setMessages(prev => prev.map(message => 
        message.id === messageId ? { ...message, status: 'approved', is_flagged: false } : message
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success("Message approved");
    } catch (error) {
      console.error('Error approving message:', error);
      toast.error('Failed to approve message');
    }
  };
  
  const handleRejectMessage = async (messageId: string) => {
    try {
      // Use type assertion to tell TypeScript this is valid
      const { error } = await (supabase
        .from('messages') as any)
        .update({ 
          status: 'rejected' 
        })
        .eq('id', messageId);
        
      if (error) {
        throw error;
      }
      
      setMessages(prev => prev.map(message => 
        message.id === messageId ? { ...message, status: 'rejected' } : message
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success("Message rejected and hidden from recipient");
    } catch (error) {
      console.error('Error rejecting message:', error);
      toast.error('Failed to reject message');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-love-500" />
            Flagged Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">
                      User {message.sender_id ? message.sender_id.slice(-4) : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      User {message.receiver_id ? message.receiver_id.slice(-4) : 'Unknown'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.content || ''}
                    </TableCell>
                    <TableCell>
                      {message.timestamp ? new Date(message.timestamp).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {message.status === "pending" ? (
                        <Badge variant="outline" className="text-xs">
                          Pending Review
                        </Badge>
                      ) : message.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {message.status === "pending" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApproveMessage(message.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleRejectMessage(message.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {messages.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No flagged messages to review
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Loading messages...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Message details dialog */}
      <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Sender</h4>
                <p>User ID: {selectedMessage.sender_id || 'Unknown'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Recipient</h4>
                <p>User ID: {selectedMessage.receiver_id || 'Unknown'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Message Content</h4>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedMessage.content || ''}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Sent At</h4>
                <p>{selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleString() : 'Unknown'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-sm">Moderation Status</h4>
                <p>{selectedMessage.status === 'pending' 
                  ? 'Pending Review' 
                  : selectedMessage.status === 'approved' 
                    ? 'Approved' 
                    : 'Rejected'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {selectedMessage?.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  className="text-green-600"
                  onClick={() => handleApproveMessage(selectedMessage.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                
                <Button 
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleRejectMessage(selectedMessage.id)}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageModeration;
