
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Flag,
  ShieldAlert,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  User,
  MessageSquare,
  Image as ImageIcon,
  AlertTriangle,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface Report {
  id: string;
  reportType: 'profile' | 'message' | 'photo';
  reportedItemId: string;
  reportedUserId: string;
  reporterUserId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  reportedContent?: string;
  reportedUserName?: string;
  reporterUserName?: string;
}

interface ReportedItem {
  id: string;
  content: string;
  contentType: 'profile' | 'message' | 'photo';
  userId: string;
  userName: string;
  reportCount: number;
  lastReportDate: string;
  status: 'flagged' | 'reviewing' | 'approved' | 'removed';
}

interface BlockedWord {
  id: string;
  word: string;
  category: 'profanity' | 'harassment' | 'discrimination' | 'other';
  severity: 'low' | 'medium' | 'high';
  action: 'flag' | 'block' | 'remove';
  createdAt: string;
}

const ContentModeration = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([]);
  const [blockedWords, setBlockedWords] = useState<BlockedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isBlockedWordDialogOpen, setIsBlockedWordDialogOpen] = useState(false);
  const [newBlockedWord, setNewBlockedWord] = useState<Partial<BlockedWord>>({
    word: '',
    category: 'profanity',
    severity: 'medium',
    action: 'flag'
  });
  const [moderationStats, setModerationStats] = useState({
    pendingReports: 0,
    recentlyResolved: 0,
    flaggedContent: 0,
    blockedUsers: 0
  });

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = () => {
    // For demo purposes, we'll create mock data
    setLoading(true);
    
    // Generate mock reports
    const mockReports: Report[] = [
      {
        id: '1',
        reportType: 'profile',
        reportedItemId: 'profile-123',
        reportedUserId: 'user-123',
        reporterUserId: 'user-456',
        reason: 'Inappropriate content',
        details: 'Profile contains offensive language and misleading information',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        reportedUserName: 'JohnDoe',
        reporterUserName: 'AliceSmith',
        reportedContent: 'User profile with potentially inappropriate content'
      },
      {
        id: '2',
        reportType: 'message',
        reportedItemId: 'message-456',
        reportedUserId: 'user-789',
        reporterUserId: 'user-101',
        reason: 'Harassment',
        details: 'User is sending threatening messages',
        status: 'reviewing',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
        reportedUserName: 'SamWilson',
        reporterUserName: 'JaneDoe',
        reportedContent: 'Hey, I know where you live and I\'m going to find you.'
      },
      {
        id: '3',
        reportType: 'photo',
        reportedItemId: 'photo-789',
        reportedUserId: 'user-202',
        reporterUserId: 'user-303',
        reason: 'Explicit content',
        details: 'Photo contains explicit content not appropriate for the platform',
        status: 'resolved',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        reportedUserName: 'MarkJohnson',
        reporterUserName: 'EmmaWatson',
        reportedContent: '[Photo content not displayed for moderation reasons]'
      },
      {
        id: '4',
        reportType: 'profile',
        reportedItemId: 'profile-505',
        reportedUserId: 'user-505',
        reporterUserId: 'user-606',
        reason: 'Fake profile',
        details: 'This appears to be a fake profile using celebrity images',
        status: 'pending',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        reportedUserName: 'CelebFake',
        reporterUserName: 'RealUser',
        reportedContent: 'Profile claiming to be a celebrity with stolen photos'
      },
      {
        id: '5',
        reportType: 'message',
        reportedItemId: 'message-707',
        reportedUserId: 'user-707',
        reporterUserId: 'user-808',
        reason: 'Spam',
        details: 'User is spamming promotional content',
        status: 'dismissed',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        reportedUserName: 'SpamBot',
        reporterUserName: 'RegularUser',
        reportedContent: 'Check out my new business! Link: hxxp://suspicious-link.com. Click now for special offers!'
      }
    ];
    
    // Generate reported items
    const mockReportedItems: ReportedItem[] = [
      {
        id: 'item-1',
        content: 'Profile with inappropriate language and potentially misleading information',
        contentType: 'profile',
        userId: 'user-123',
        userName: 'JohnDoe',
        reportCount: 3,
        lastReportDate: new Date(Date.now() - 3600000).toISOString(),
        status: 'flagged'
      },
      {
        id: 'item-2',
        content: 'Hey, I know where you live and I\'m going to find you.',
        contentType: 'message',
        userId: 'user-789',
        userName: 'SamWilson',
        reportCount: 1,
        lastReportDate: new Date(Date.now() - 86400000).toISOString(),
        status: 'reviewing'
      },
      {
        id: 'item-3',
        content: '[Photo content not displayed for moderation reasons]',
        contentType: 'photo',
        userId: 'user-202',
        userName: 'MarkJohnson',
        reportCount: 5,
        lastReportDate: new Date(Date.now() - 172800000).toISOString(),
        status: 'removed'
      },
      {
        id: 'item-4',
        content: 'Profile claiming to be a celebrity with stolen photos',
        contentType: 'profile',
        userId: 'user-505',
        userName: 'CelebFake',
        reportCount: 7,
        lastReportDate: new Date(Date.now() - 7200000).toISOString(),
        status: 'flagged'
      },
      {
        id: 'item-5',
        content: 'Check out my new business! Link: hxxp://suspicious-link.com. Click now for special offers!',
        contentType: 'message',
        userId: 'user-707',
        userName: 'SpamBot',
        reportCount: 2,
        lastReportDate: new Date(Date.now() - 259200000).toISOString(),
        status: 'approved'
      }
    ];
    
    // Generate blocked words
    const mockBlockedWords: BlockedWord[] = [
      {
        id: 'word-1',
        word: 'badword1',
        category: 'profanity',
        severity: 'high',
        action: 'block',
        createdAt: new Date(Date.now() - 2592000000).toISOString()
      },
      {
        id: 'word-2',
        word: 'slur1',
        category: 'discrimination',
        severity: 'high',
        action: 'remove',
        createdAt: new Date(Date.now() - 1728000000).toISOString()
      },
      {
        id: 'word-3',
        word: 'threat1',
        category: 'harassment',
        severity: 'medium',
        action: 'flag',
        createdAt: new Date(Date.now() - 864000000).toISOString()
      },
      {
        id: 'word-4',
        word: 'badword2',
        category: 'profanity',
        severity: 'low',
        action: 'flag',
        createdAt: new Date(Date.now() - 432000000).toISOString()
      },
      {
        id: 'word-5',
        word: 'scam',
        category: 'other',
        severity: 'medium',
        action: 'block',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    
    // Set moderation stats
    setModerationStats({
      pendingReports: mockReports.filter(r => r.status === 'pending').length,
      recentlyResolved: mockReports.filter(r => r.status === 'resolved').length,
      flaggedContent: mockReportedItems.filter(i => i.status === 'flagged').length,
      blockedUsers: 12 // Mock number
    });
    
    setReports(mockReports);
    setReportedItems(mockReportedItems);
    setBlockedWords(mockBlockedWords);
    setLoading(false);
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="outline">Reviewing</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="default">Dismissed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'reviewing':
        return <Badge variant="outline">Reviewing</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'removed':
        return <Badge variant="default">Removed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return <User className="h-4 w-4 text-muted-foreground" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      case 'photo':
        return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const updateReportStatus = (reportId: string, newStatus: Report['status']) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return { ...report, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return report;
    });
    
    setReports(updatedReports);
    
    // If we're updating the currently selected report, update it too
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus, updatedAt: new Date().toISOString() });
    }
    
    toast(`Report status updated to ${newStatus}`);
  };

  const addBlockedWord = () => {
    if (!newBlockedWord.word?.trim()) {
      toast("Please enter a word to block");
      return;
    }
    
    const newWord: BlockedWord = {
      id: `word-${Date.now()}`,
      word: newBlockedWord.word.trim().toLowerCase(),
      category: newBlockedWord.category as 'profanity' | 'harassment' | 'discrimination' | 'other',
      severity: newBlockedWord.severity as 'low' | 'medium' | 'high',
      action: newBlockedWord.action as 'flag' | 'block' | 'remove',
      createdAt: new Date().toISOString()
    };
    
    setBlockedWords([...blockedWords, newWord]);
    setIsBlockedWordDialogOpen(false);
    setNewBlockedWord({
      word: '',
      category: 'profanity',
      severity: 'medium',
      action: 'flag'
    });
    
    toast("Word added to blocklist");
  };

  const removeBlockedWord = (wordId: string) => {
    setBlockedWords(blockedWords.filter(word => word.id !== wordId));
    toast("Word removed from blocklist");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      searchQuery === '' || 
      report.reportedUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reports">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="content">Flagged Content</TabsTrigger>
          <TabsTrigger value="filters">Content Filters</TabsTrigger>
        </TabsList>
        
        {/* User Reports Tab */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reports
                </CardTitle>
                <Flag className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moderationStats.pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recently Resolved
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moderationStats.recentlyResolved}</div>
                <p className="text-xs text-muted-foreground">
                  In the last 7 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Flagged Content
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moderationStats.flaggedContent}</div>
                <p className="text-xs text-muted-foreground">
                  Items needing review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blocked Users
                </CardTitle>
                <Users className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moderationStats.blockedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  For policy violations
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>
                Review and respond to content reported by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="flex h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Reported User</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Reported</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                              No reports found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getContentTypeIcon(report.reportType)}
                                  <span className="capitalize">{report.reportType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{report.reportedUserName?.[0]}</AvatarFallback>
                                  </Avatar>
                                  {report.reportedUserName}
                                </div>
                              </TableCell>
                              <TableCell>{report.reason}</TableCell>
                              <TableCell>{getTimeAgo(report.createdAt)}</TableCell>
                              <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsReportDialogOpen(true);
                                    }}
                                  >
                                    View
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem 
                                        onClick={() => updateReportStatus(report.id, 'reviewing')}
                                        disabled={report.status === 'reviewing'}
                                      >
                                        Mark as Reviewing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => updateReportStatus(report.id, 'resolved')}
                                        disabled={report.status === 'resolved'}
                                      >
                                        Resolve Report
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                                        disabled={report.status === 'dismissed'}
                                      >
                                        Dismiss Report
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredReports.length} of {reports.length} reports
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Flagged Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content</CardTitle>
              <CardDescription>
                Content that has been automatically or manually flagged for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Reports</TableHead>
                        <TableHead>Last Reported</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getContentTypeIcon(item.contentType)}
                              <span className="capitalize">{item.contentType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{item.userName[0]}</AvatarFallback>
                              </Avatar>
                              {item.userName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {item.content}
                            </div>
                          </TableCell>
                          <TableCell>{item.reportCount}</TableCell>
                          <TableCell>{getTimeAgo(item.lastReportDate)}</TableCell>
                          <TableCell>{getItemStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>View User Profile</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Approve Content</DropdownMenuItem>
                                <DropdownMenuItem>Remove Content</DropdownMenuItem>
                                <DropdownMenuItem>Ban User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Filters Tab */}
        <TabsContent value="filters" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blocked Words & Phrases</CardTitle>
                <CardDescription>
                  Manage the list of words that are flagged or blocked
                </CardDescription>
              </div>
              <Button onClick={() => setIsBlockedWordDialogOpen(true)}>
                Add Blocked Word
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Word/Phrase</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blockedWords.map((word) => (
                        <TableRow key={word.id}>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded">{word.word}</code>
                          </TableCell>
                          <TableCell className="capitalize">{word.category}</TableCell>
                          <TableCell>
                            <Badge variant={
                              word.severity === 'high' ? 'destructive' :
                              word.severity === 'medium' ? 'default' : 'outline'
                            }>
                              {word.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{word.action}</TableCell>
                          <TableCell>{getTimeAgo(word.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlockedWord(word.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Content containing these words will be automatically processed according to the action specified.
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation Settings</CardTitle>
              <CardDescription>
                Configure how the system handles content moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Automatic Content Filtering Level</Label>
                  <select className="flex h-10 w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="low">Low - Flag only high severity content</option>
                    <option value="medium" selected>Medium - Balance between flagging and user freedom</option>
                    <option value="high">High - Strict filtering of potentially inappropriate content</option>
                  </select>
                </div>
                
                <div className="grid gap-3">
                  <Label>AI Moderation</Label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="bg-green-50">
                      Enable AI Moderation
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      AI-powered content screening is active and will automatically process content
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label>Report Thresholds</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm" htmlFor="auto-flag">Content is automatically flagged after</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input id="auto-flag" type="number" defaultValue="3" className="w-20" />
                        <span className="text-sm">reports</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="auto-remove">Content is automatically removed after</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input id="auto-remove" type="number" defaultValue="10" className="w-20" />
                        <span className="text-sm">reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Report Details Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about the reported content
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <div className="flex items-center space-x-2">
                  {getReportStatusBadge(selectedReport.status)}
                  <span className="text-sm text-muted-foreground">
                    Last updated: {formatDate(selectedReport.updatedAt)}
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Reported User</h3>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{selectedReport.reportedUserName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedReport.reportedUserName}</div>
                      <div className="text-sm text-muted-foreground">ID: {selectedReport.reportedUserId}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Reported By</h3>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{selectedReport.reporterUserName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedReport.reporterUserName}</div>
                      <div className="text-sm text-muted-foreground">ID: {selectedReport.reporterUserId}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Report Reason</h3>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">{selectedReport.reason}</p>
                  <p className="mt-1 text-muted-foreground">{selectedReport.details}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Reported Content ({selectedReport.reportType})</h3>
                <div className="border p-4 rounded-md">
                  {selectedReport.reportType === 'photo' ? (
                    <div className="bg-muted aspect-square flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="ml-2">Photo content (hidden)</span>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{selectedReport.reportedContent}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">Moderator Notes</h3>
                <Textarea placeholder="Add notes about this report here..." className="h-24" />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              {selectedReport && selectedReport.status !== 'resolved' && (
                <Button
                  variant="default"
                  onClick={() => {
                    updateReportStatus(selectedReport.id, 'resolved');
                    setIsReportDialogOpen(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve
                </Button>
              )}
              
              {selectedReport && selectedReport.status !== 'dismissed' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    updateReportStatus(selectedReport.id, 'dismissed');
                    setIsReportDialogOpen(false);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Dismiss
                </Button>
              )}
            </div>
            
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Blocked Word Dialog */}
      <Dialog open={isBlockedWordDialogOpen} onOpenChange={setIsBlockedWordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Blocked Word</DialogTitle>
            <DialogDescription>
              Add a new word or phrase to the blocklist
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="blocked-word">Word or Phrase</Label>
              <Input
                id="blocked-word"
                value={newBlockedWord.word}
                onChange={(e) => setNewBlockedWord({...newBlockedWord, word: e.target.value})}
                placeholder="Enter word or phrase to block"
              />
            </div>
            
            <div className="grid items-center gap-2">
              <Label htmlFor="blocked-category">Category</Label>
              <select
                id="blocked-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newBlockedWord.category}
                onChange={(e) => setNewBlockedWord({
                  ...newBlockedWord, 
                  category: e.target.value as 'profanity' | 'harassment' | 'discrimination' | 'other'
                })}
              >
                <option value="profanity">Profanity</option>
                <option value="harassment">Harassment</option>
                <option value="discrimination">Discrimination</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="grid items-center gap-2">
              <Label htmlFor="blocked-severity">Severity</Label>
              <select
                id="blocked-severity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newBlockedWord.severity}
                onChange={(e) => setNewBlockedWord({
                  ...newBlockedWord, 
                  severity: e.target.value as 'low' | 'medium' | 'high'
                })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="grid items-center gap-2">
              <Label htmlFor="blocked-action">Action</Label>
              <select
                id="blocked-action"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newBlockedWord.action}
                onChange={(e) => setNewBlockedWord({
                  ...newBlockedWord, 
                  action: e.target.value as 'flag' | 'block' | 'remove'
                })}
              >
                <option value="flag">Flag for review</option>
                <option value="block">Block submission</option>
                <option value="remove">Auto-remove content</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockedWordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addBlockedWord}>
              Add Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModeration;
