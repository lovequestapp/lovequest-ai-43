
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Save, 
  Database, 
  Server, 
  Bell, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Key, 
  Upload, 
  CreditCard,
  Upload as UploadIcon, 
  Smartphone,
  FileCode 
} from 'lucide-react';

interface AppSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
  lastUsed: string | null;
}

const AppSettings = () => {
  const [settings, setSettings] = useState<Record<string, Record<string, AppSetting>>>({});
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    fetchSettings();
    fetchApiKeys();
  }, []);
  
  const fetchSettings = () => {
    // For demo purposes, we'll create mock settings
    setLoading(true);
    
    // Mock settings organized by category
    const mockSettings: Record<string, Record<string, AppSetting>> = {
      general: {
        app_name: {
          id: '1',
          category: 'general',
          key: 'app_name',
          value: 'LoveQuest AI',
          description: 'The name of the application',
          dataType: 'string'
        },
        app_description: {
          id: '2',
          category: 'general',
          key: 'app_description',
          value: 'An AI-powered dating platform that helps people find meaningful connections',
          description: 'Short description of the application',
          dataType: 'string'
        },
        maintenance_mode: {
          id: '3',
          category: 'general',
          key: 'maintenance_mode',
          value: 'false',
          description: 'Enable maintenance mode to prevent users from accessing the app',
          dataType: 'boolean'
        },
        app_version: {
          id: '4',
          category: 'general',
          key: 'app_version',
          value: '1.2.0',
          description: 'Current application version',
          dataType: 'string'
        }
      },
      notifications: {
        push_notifications: {
          id: '5',
          category: 'notifications',
          key: 'push_notifications',
          value: 'true',
          description: 'Enable push notifications',
          dataType: 'boolean'
        },
        email_notifications: {
          id: '6',
          category: 'notifications',
          key: 'email_notifications',
          value: 'true',
          description: 'Enable email notifications',
          dataType: 'boolean'
        },
        new_match_notification: {
          id: '7',
          category: 'notifications',
          key: 'new_match_notification',
          value: 'true',
          description: 'Send notifications for new matches',
          dataType: 'boolean'
        },
        message_notification: {
          id: '8',
          category: 'notifications',
          key: 'message_notification',
          value: 'true',
          description: 'Send notifications for new messages',
          dataType: 'boolean'
        }
      },
      email: {
        smtp_host: {
          id: '9',
          category: 'email',
          key: 'smtp_host',
          value: 'smtp.example.com',
          description: 'SMTP server host',
          dataType: 'string'
        },
        smtp_port: {
          id: '10',
          category: 'email',
          key: 'smtp_port',
          value: '587',
          description: 'SMTP server port',
          dataType: 'number'
        },
        smtp_username: {
          id: '11',
          category: 'email',
          key: 'smtp_username',
          value: 'noreply@example.com',
          description: 'SMTP username',
          dataType: 'string'
        },
        sender_email: {
          id: '12',
          category: 'email',
          key: 'sender_email',
          value: 'noreply@lovequest.ai',
          description: 'Email address to send from',
          dataType: 'string'
        }
      },
      security: {
        min_password_length: {
          id: '13',
          category: 'security',
          key: 'min_password_length',
          value: '8',
          description: 'Minimum password length',
          dataType: 'number'
        },
        require_special_chars: {
          id: '14',
          category: 'security',
          key: 'require_special_chars',
          value: 'true',
          description: 'Require special characters in passwords',
          dataType: 'boolean'
        },
        max_login_attempts: {
          id: '15',
          category: 'security',
          key: 'max_login_attempts',
          value: '5',
          description: 'Maximum login attempts before account lockout',
          dataType: 'number'
        },
        two_factor_auth: {
          id: '16',
          category: 'security',
          key: 'two_factor_auth',
          value: 'false',
          description: 'Enable two-factor authentication',
          dataType: 'boolean'
        }
      },
      mobile: {
        enable_location: {
          id: '17',
          category: 'mobile',
          key: 'enable_location',
          value: 'true',
          description: 'Enable location services for mobile app',
          dataType: 'boolean'
        },
        default_search_radius: {
          id: '18',
          category: 'mobile',
          key: 'default_search_radius',
          value: '50',
          description: 'Default search radius in miles',
          dataType: 'number'
        },
        show_online_status: {
          id: '19',
          category: 'mobile',
          key: 'show_online_status',
          value: 'true',
          description: 'Show online status to other users',
          dataType: 'boolean'
        },
        enable_video_calls: {
          id: '20',
          category: 'mobile',
          key: 'enable_video_calls',
          value: 'true',
          description: 'Enable video calls in the mobile app',
          dataType: 'boolean'
        }
      },
      payment: {
        stripe_public_key: {
          id: '21',
          category: 'payment',
          key: 'stripe_public_key',
          value: 'pk_test_...',
          description: 'Stripe public API key',
          dataType: 'string'
        },
        currency: {
          id: '22',
          category: 'payment',
          key: 'currency',
          value: 'USD',
          description: 'Default currency for payments',
          dataType: 'string'
        },
        tax_rate: {
          id: '23',
          category: 'payment',
          key: 'tax_rate',
          value: '7.5',
          description: 'Default tax rate percentage',
          dataType: 'number'
        },
        trial_period_days: {
          id: '24',
          category: 'payment',
          key: 'trial_period_days',
          value: '7',
          description: 'Free trial period in days',
          dataType: 'number'
        }
      }
    };
    
    setSettings(mockSettings);
    setLoading(false);
  };

  const fetchApiKeys = () => {
    // For demo purposes, we'll create mock API keys
    const mockApiKeys: APIKey[] = [
      {
        id: 'key1',
        name: 'Mobile App API Key',
        key: 'mbl_' + randomString(24),
        scopes: ['read:users', 'write:messages', 'read:matches'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'key2',
        name: 'Analytics Service',
        key: 'anl_' + randomString(24),
        scopes: ['read:analytics', 'read:users'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: null,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'key3',
        name: 'Integration Testing',
        key: 'tst_' + randomString(24),
        scopes: ['read:users', 'write:users', 'read:messages', 'write:messages'],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: null
      }
    ];
    
    setApiKeys(mockApiKeys);
  };

  const randomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const updateSetting = (category: string, key: string, value: string) => {
    const newSettings = { ...settings };
    if (newSettings[category] && newSettings[category][key]) {
      newSettings[category][key] = {
        ...newSettings[category][key],
        value: value
      };
      setSettings(newSettings);
      setHasChanges(true);
    }
  };

  const saveSettings = () => {
    // In a real app, we would save to the database here
    toast("Settings saved successfully");
    setHasChanges(false);
  };

  const generateNewApiKey = () => {
    const newKey: APIKey = {
      id: 'key' + (apiKeys.length + 1),
      name: 'New API Key',
      key: 'api_' + randomString(32),
      scopes: ['read:users'],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: null
    };
    
    setApiKeys([...apiKeys, newKey]);
    toast("New API key generated");
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast("API key deleted");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const renderSettingInput = (setting: AppSetting) => {
    switch (setting.dataType) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.id}
              checked={setting.value === 'true'}
              onCheckedChange={(checked) => 
                updateSetting(setting.category, setting.key, checked ? 'true' : 'false')
              }
            />
            <Label htmlFor={setting.id}>{setting.value === 'true' ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );
      case 'number':
        return (
          <Input 
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
          />
        );
      case 'json':
        return (
          <Textarea 
            value={setting.value}
            onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
            className="font-mono text-xs"
            rows={4}
          />
        );
      default:
        return (
          <Input 
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(setting.category, setting.key, e.target.value)}
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <Globe className="h-4 w-4" />;
      case 'notifications':
        return <Bell className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'security':
        return <ShieldCheck className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">App Settings</h2>
          <p className="text-muted-foreground">
            Configure application settings and API integrations
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="mobile">Mobile App</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {Object.keys(settings).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <CardTitle className="capitalize">{category} Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Configure {category} settings for your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.values(settings[category]).map((setting) => (
                        <div key={setting.id} className="grid gap-2">
                          <Label htmlFor={setting.id} className="font-medium">
                            {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Label>
                          {renderSettingInput(setting)}
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {category === 'security' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <CardTitle>API Keys</CardTitle>
                        </div>
                        <Button size="sm" onClick={generateNewApiKey}>
                          Generate New Key
                        </Button>
                      </div>
                      <CardDescription>
                        Manage API keys for external integrations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="bg-muted px-4 py-2 border-b">
                          <div className="grid grid-cols-5 text-xs font-medium">
                            <div>Name</div>
                            <div>Key</div>
                            <div>Created</div>
                            <div>Last Used</div>
                            <div className="text-right">Actions</div>
                          </div>
                        </div>
                        <div className="divide-y">
                          {apiKeys.map((apiKey) => (
                            <div key={apiKey.id} className="px-4 py-3 grid grid-cols-5 items-center">
                              <div>
                                <p className="font-medium">{apiKey.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {apiKey.scopes.join(', ')}
                                </p>
                              </div>
                              <div>
                                <code className="bg-muted text-xs p-1 rounded">
                                  {apiKey.key.substring(0, 10)}...
                                </code>
                              </div>
                              <div className="text-sm">
                                {formatDate(apiKey.createdAt)}
                              </div>
                              <div className="text-sm">
                                {formatDate(apiKey.lastUsed)}
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
                                  <Upload className="h-4 w-4" />
                                  <span className="sr-only">Copy</span>
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteApiKey(apiKey.id)}
                                >
                                  <span className="sr-only">Delete</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {category === 'general' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <CardTitle>Database & Storage</CardTitle>
                      </div>
                      <CardDescription>
                        Manage database and file storage settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">Database Information</h3>
                              <p className="text-sm text-muted-foreground">
                                Connected to Supabase PostgreSQL database
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline">Run Migrations</Button>
                              <Button variant="outline">Backup Database</Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/50">
                            <div>
                              <p className="text-sm font-medium">Database Size</p>
                              <p className="text-xl font-bold">256 MB</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Storage Used</p>
                              <p className="text-xl font-bold">1.2 GB</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Total Tables</p>
                              <p className="text-xl font-bold">24</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Total Files</p>
                              <p className="text-xl font-bold">8,750</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">File Storage</h3>
                              <p className="text-sm text-muted-foreground">
                                Configure file storage settings
                              </p>
                            </div>
                            <Button variant="outline">
                              <UploadIcon className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                          </div>
                          
                          <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                              <Label>Maximum file size (MB)</Label>
                              <Input type="number" defaultValue="10" className="w-24" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label>Allowed file types</Label>
                              <Input defaultValue="jpg, png, gif, webp" className="w-64" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label>Auto-compress images</Label>
                              <div className="flex items-center space-x-2">
                                <Switch id="compress-images" defaultChecked />
                                <Label htmlFor="compress-images">Enabled</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {category === 'mobile' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <FileCode className="h-4 w-4" />
                        <CardTitle>Mobile App Configuration</CardTitle>
                      </div>
                      <CardDescription>
                        Configure mobile application build settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">App Store Information</h3>
                              <p className="text-sm text-muted-foreground">
                                Configure app store listings and release settings
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline">Generate Build</Button>
                              <Button>Publish Update</Button>
                            </div>
                          </div>
                          
                          <div className="grid gap-3">
                            <div className="grid gap-2">
                              <Label>Current iOS Version</Label>
                              <div className="flex gap-2">
                                <Input defaultValue="1.2.0" className="w-32" />
                                <Input defaultValue="15" placeholder="Build number" className="w-24" />
                              </div>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label>Current Android Version</Label>
                              <div className="flex gap-2">
                                <Input defaultValue="1.2.0" className="w-32" />
                                <Input defaultValue="18" placeholder="Build number" className="w-24" />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <Label>Force Update</Label>
                              <div className="flex items-center space-x-2">
                                <Switch id="force-update" />
                                <Label htmlFor="force-update">Disabled</Label>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label>Maintenance Mode</Label>
                              <div className="flex items-center space-x-2">
                                <Switch id="app-maintenance" />
                                <Label htmlFor="app-maintenance">Disabled</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-3">
                          <h3 className="font-medium">Feature Flags</h3>
                          <p className="text-sm text-muted-foreground">
                            Toggle features on or off for mobile applications
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div>
                                <p className="font-medium">Video Chat</p>
                                <p className="text-xs text-muted-foreground">Enable video chat functionality</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div>
                                <p className="font-medium">Voice Messages</p>
                                <p className="text-xs text-muted-foreground">Allow sending voice messages</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div>
                                <p className="font-medium">Location Sharing</p>
                                <p className="text-xs text-muted-foreground">Enable location sharing features</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div>
                                <p className="font-medium">New AI Matching (Beta)</p>
                                <p className="text-xs text-muted-foreground">Experimental AI matching algorithm</p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default AppSettings;
