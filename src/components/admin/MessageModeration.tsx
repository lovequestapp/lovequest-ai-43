
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { MessageSquare, Eye, Ban, CheckCircle, MessageCircle } from 'lucide-react';

const MessageModeration = () => {
  const [messages, setMessages] = useState([
    { id: "1", senderId: "user-123", receiverId: "user-456", content: "Hello there! How are you?", timestamp: new Date(), isFlagged: true, status: "pending" },
    { id: "2", senderId: "user-789", receiverId: "user-123", content: "I'd like to know more about your interests", timestamp: new Date(Date.now() - 86400000), isFlagged: true, status: "pending" }
  ]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
  };
  
  const handleApproveMessage = (messageId: string) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, status: "approved", isFlagged: false } : message
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    
    toast("Message approved");
  };
  
  const handleRejectMessage = (messageId: string) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, status: "rejected" } : message
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    
    toast("Message rejected and hidden from recipient");
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
                      User {message.senderId.slice(-4)}
                    </TableCell>
                    <TableCell>
                      User {message.receiverId.slice(-4)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.content}
                    </TableCell>
                    <TableCell>
                      {new Date(message.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {message.status === "pending" ? (
                        <Badge variant="outline" className="text-xs">
                          Pending Review
                        </Badge>
                      ) : message.status === "approved" ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
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
                {messages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No flagged messages to review
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
                <p>User ID: {selectedMessage.senderId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Recipient</h4>
                <p>User ID: {selectedMessage.receiverId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Message Content</h4>
                <p className="p-3 bg-muted rounded-md mt-1">{selectedMessage.content}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Sent At</h4>
                <p>{new Date(selectedMessage.timestamp).toLocaleString()}</p>
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
