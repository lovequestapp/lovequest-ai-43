
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { Shield, Eye, Flag, Check, Trash, XCircle } from 'lucide-react';

const ReportModeration = () => {
  const [reports, setReports] = useState([
    { id: "1", userId: "user-123", reportedUserId: "user-456", reason: "Inappropriate content", status: "pending", createdAt: new Date() },
    { id: "2", userId: "user-789", reportedUserId: "user-101", reason: "Harassment", status: "pending", createdAt: new Date(Date.now() - 86400000) }
  ]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
  };
  
  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: "resolved" } : report
    ));
    
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
    
    toast.success("Report has been resolved");
  };
  
  const handleDismissReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: "dismissed" } : report
    ));
    
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
    
    toast.success("Report has been dismissed");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5 text-love-500" />
            User Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      User {report.userId.slice(-4)}
                    </TableCell>
                    <TableCell>
                      User {report.reportedUserId.slice(-4)}
                    </TableCell>
                    <TableCell>
                      {report.reason}
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {report.status === "pending" ? (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      ) : report.status === "resolved" ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Dismissed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {report.status === "pending" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleResolveReport(report.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-amber-600"
                              onClick={() => handleDismissReport(report.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No reports to moderate
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Report details dialog */}
      <Dialog open={selectedReport !== null} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Reporter</h4>
                <p>User ID: {selectedReport.userId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Reported User</h4>
                <p>User ID: {selectedReport.reportedUserId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Reason</h4>
                <p>{selectedReport.reason}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Date Reported</h4>
                <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Status</h4>
                <p className="capitalize">{selectedReport.status}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {selectedReport?.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  className="text-green-600"
                  onClick={() => handleResolveReport(selectedReport.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
                
                <Button 
                  variant="outline"
                  className="text-amber-600"
                  onClick={() => handleDismissReport(selectedReport.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportModeration;
