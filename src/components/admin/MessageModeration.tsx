
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { Shield, Eye, MessageSquare, Check, Trash, XCircle, AlertTriangle } from 'lucide-react';

const MessageModeration = () => {
  const [flaggedMessages, setFlaggedMessages] = useState([
    { 
      id: "1", 
      senderId: "user-123", 
      receiverId: "user-456", 
      content: "This message contains inappropriate content that needs moderation.", 
      reason: "Inappropriate language",
      status: "pending", 
      createdAt: new Date() 
    },
    { 
      id: "2", 
      senderId: "user-789", 
      receiverId: "user-101", 
      content: "Another message that needs review by moderators.", 
      reason: "Suspicious content",
      status: "pending", 
      createdAt: new Date(Date.now() - 86400000) 
    }
  ]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
  };
  
  const handleApproveMessage = (messageId: string) => {
    setFlaggedMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, status: "approved" } : message
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    
    toast.success("Message has been approved");
  };
  
  const handleRemoveMessage = (messageId: string) => {
    setFlaggedMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, status: "removed" } : message
    ));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    
    toast.success("Message has been removed");
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
                  <TableHead>Receiver</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">
                      User {message.senderId.slice(-4)}
                    </TableCell>
                    <TableCell>
                      User {message.receiverId.slice(-4)}
                    </TableCell>
                    <TableCell>
                      {message.reason}
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {message.status === "pending" ? (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      ) : message.status === "approved" ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Removed
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
                              <Check className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleRemoveMessage(message.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {flaggedMessages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No flagged messages to moderate
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
                <h4 className="font-medium text-sm">Receiver</h4>
                <p>User ID: {selectedMessage.receiverId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Message Content</h4>
                <div className="p-3 bg-muted rounded-md mt-1">
                  <p>{selectedMessage.content}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Reason Flagged</h4>
                <p>{selectedMessage.reason}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Date Sent</h4>
                <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Status</h4>
                <p className="capitalize">{selectedMessage.status}</p>
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
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => handleRemoveMessage(selectedMessage.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
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
