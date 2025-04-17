import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Wallet, Heart, Gift, Coins, ArrowUpRight, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateBankDetails, initiateWithdrawal } from '@/services/profileService';
interface MonetizationProps {
  userData?: any;
}
const bankDetailsSchema = z.object({
  accountName: z.string().min(2, 'Account name is required'),
  accountNumber: z.string().min(4, 'Valid account number is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  routingNumber: z.string().min(4, 'Valid routing number is required'),
  accountType: z.string().min(1, 'Account type is required')
});
const withdrawalSchema = z.object({
  amount: z.coerce.number().min(10, 'Minimum withdrawal amount is $10').max(5000, 'Maximum withdrawal amount is $5,000'),
  method: z.enum(['bank', 'paypal'])
});
const Monetization: React.FC<MonetizationProps> = ({
  userData
}) => {
  const {
    currentUser,
    setCurrentUser
  } = useUser();
  const user = userData || currentUser;
  const [activeTab, setActiveTab] = useState('gifts');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'paypal'>('bank');

  // Calculate a fake earnings amount for demo purposes
  const calculateEarnings = () => {
    if (!user) return 0;
    const receivedGifts = user.receivedGifts || {
      rose: 0,
      heart: 0,
      teddy: 0
    };
    // Assign monetary values to each gift type
    const giftValues = {
      rose: 0.50,
      heart: 1.00,
      teddy: 5.00
    };
    return receivedGifts.rose * giftValues.rose + receivedGifts.heart * giftValues.heart + receivedGifts.teddy * giftValues.teddy;
  };
  const earnings = calculateEarnings();
  const pendingWithdrawal = 0; // In a real app, this would come from the database
  const availableBalance = earnings - pendingWithdrawal;

  // Bank details form
  const bankForm = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountName: user?.bankDetails?.accountName || '',
      accountNumber: user?.bankDetails?.accountNumber || '',
      bankName: user?.bankDetails?.bankName || '',
      routingNumber: user?.bankDetails?.routingNumber || '',
      accountType: user?.bankDetails?.accountType || ''
    }
  });
  const withdrawalForm = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 10,
      method: 'bank' as 'bank' | 'paypal'
    }
  });
  useEffect(() => {
    if (user && user.bankDetails) {
      bankForm.reset({
        accountName: user.bankDetails.accountName || '',
        accountNumber: user.bankDetails.accountNumber || '',
        bankName: user.bankDetails.bankName || '',
        routingNumber: user.bankDetails.routingNumber || '',
        accountType: user.bankDetails.accountType || ''
      });
    }
  }, [user, bankForm]);
  const onSubmitBankDetails = async (data: any) => {
    if (!user || !user.id) {
      toast.error('User data not available');
      return;
    }
    const success = await updateBankDetails(user.id, data);
    if (success && setCurrentUser) {
      setCurrentUser(prev => {
        if (prev) {
          return {
            ...prev,
            bankDetails: data
          };
        }
        return prev;
      });
    }
  };
  const onSubmitWithdrawal = async (data: any) => {
    if (!user || !user.id) {
      toast.error('User data not available');
      return;
    }
    if (data.amount > availableBalance) {
      toast.error('Withdrawal amount exceeds available balance');
      return;
    }
    const success = await initiateWithdrawal(user.id, data.amount, data.method);
    if (success) {
      withdrawalForm.reset();
    }
  };
  return <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Your Gift Monetization</h3>
        <p className="text-muted-foreground">Manage your gift earnings and withdrawals</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${availableBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingWithdrawal.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={value => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="gifts" className="flex items-center gap-2">
            <Gift size={16} />
            <span>Received Gifts</span>
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <Wallet size={16} />
            <span>Withdraw</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Bank Details</span>
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="gifts" className="mt-0">
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Gifts Received</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardHeader>
                      <div className="mx-auto text-3xl">🌹</div>
                      <CardTitle className="font-normal">Roses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user?.receivedGifts?.rose || 0}</div>
                      <p className="text-sm text-muted-foreground mt-1">Value: ${((user?.receivedGifts?.rose || 0) * 0.5).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader>
                      <div className="mx-auto text-3xl">❤️</div>
                      <CardTitle className="font-normal">Hearts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user?.receivedGifts?.heart || 0}</div>
                      <p className="text-sm text-muted-foreground mt-1">Value: ${((user?.receivedGifts?.heart || 0) * 1).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader>
                      <div className="mx-auto text-3xl">🧸</div>
                      <CardTitle className="font-normal">Teddies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user?.receivedGifts?.teddy || 0}</div>
                      <p className="text-sm text-muted-foreground mt-1">Value: ${((user?.receivedGifts?.teddy || 0) * 5).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-4">
                  <h5 className="font-medium mb-2">How Gift Monetization Works</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Receive gifts from your admirers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Each gift has a monetary value (Rose: $0.50, Heart: $1.00, Teddy: $5.00)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Withdraw your earnings to your bank account or PayPal</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="withdraw" className="mt-0">
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Withdraw Your Earnings</h4>
                
                <Form {...withdrawalForm}>
                  <form onSubmit={withdrawalForm.handleSubmit(onSubmitWithdrawal)} className="space-y-4">
                    <FormField control={withdrawalForm.control} name="amount" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Withdrawal Amount (USD)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={10} max={5000} step={0.01} placeholder="Enter amount" />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Available balance: ${availableBalance.toFixed(2)} · 
                            Min: $10.00 · Max: $5,000.00
                          </p>
                        </FormItem>} />
                    
                    <FormField control={withdrawalForm.control} name="method" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Withdrawal Method</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Button type="button" variant={field.value === 'bank' ? 'default' : 'outline'} className={`h-auto py-3 flex flex-col items-center justify-center gap-1 ${field.value === 'bank' ? 'border-love-500' : ''}`} onClick={() => {
                        field.onChange('bank');
                        setWithdrawalMethod('bank');
                      }}>
                              <CreditCard size={20} />
                              <span className="text-sm">Bank Transfer</span>
                              <span className="text-xs text-muted-foreground">2-3 business days</span>
                            </Button>
                            
                            <Button type="button" variant={field.value === 'paypal' ? 'default' : 'outline'} className={`h-auto py-3 flex flex-col items-center justify-center gap-1 ${field.value === 'paypal' ? 'border-love-500' : ''}`} onClick={() => {
                        field.onChange('paypal');
                        setWithdrawalMethod('paypal');
                      }}>
                              <ArrowUpRight size={20} />
                              <span className="text-sm">PayPal</span>
                              <span className="text-xs text-muted-foreground">Instant</span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>} />
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h5 className="font-medium mb-2">Withdrawal Information</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Processing fee: 2.9% of withdrawal amount</span>
                        </li>
                        {withdrawalMethod === 'bank' ? <>
                            <li className="flex items-start">
                              <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                              <span>Standard transfer: 2-3 business days</span>
                            </li>
                            <li className="flex items-start">
                              <CreditCard className="h-4 w-4 mr-2 mt-0.5" />
                              <span>Requires valid bank details</span>
                            </li>
                          </> : <li className="flex items-start">
                            <ArrowUpRight className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Instant transfer to PayPal account</span>
                          </li>}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full bg-love-500 hover:bg-love-600" disabled={!availableBalance || availableBalance < 10}>
                        {withdrawalMethod === 'bank' ? 'Withdraw to Bank' : 'Withdraw to PayPal'}
                      </Button>
                      
                      {!availableBalance || availableBalance < 10 ? <p className="text-xs text-center text-muted-foreground mt-2">
                          You need at least $10.00 in available balance to withdraw.
                        </p> : null}
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            <TabsContent value="bank" className="mt-0">
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Bank Account Details</h4>
                <p className="text-sm text-muted-foreground">
                  Add your bank details for withdrawals. This information is encrypted and secure.
                </p>
                
                <Form {...bankForm}>
                  <form onSubmit={bankForm.handleSubmit(onSubmitBankDetails)} className="space-y-4">
                    <FormField control={bankForm.control} name="accountName" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={bankForm.control} name="bankName" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Bank of America" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField control={bankForm.control} name="accountNumber" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1234567890" type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={bankForm.control} name="routingNumber" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Routing Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123456789" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>
                    
                    <FormField control={bankForm.control} name="accountType" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <select {...field} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-love-500 focus:border-love-500 sm:text-sm rounded-md">
                              <option value="">Select account type</option>
                              <option value="checking">Checking</option>
                              <option value="savings">Savings</option>
                              <option value="business">Business</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <div className="pt-4">
                      <Button type="submit" className="bg-love-500 hover:bg-love-600">
                        Save Bank Details
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>For issues with withdrawals, please contact our support team.</p>
      </div>
    </div>;
};
export default Monetization;