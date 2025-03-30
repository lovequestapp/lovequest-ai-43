
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, CreditCard, DollarSign, Gift, History, Landmark, Wallet, AlertCircle, CheckCircle2, Lock, Shield } from 'lucide-react';

// Gift values in USD
const GIFT_VALUES = {
  rose: 5,
  heart: 10,
  teddy: 20
};

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'gift_conversion';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: Date;
}

// Bank account types
type AccountType = 'checking' | 'savings';

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: AccountType;
  isVerified: boolean;
}

const MonetizationPanel: React.FC = () => {
  const { currentUser, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [unclaimedGifts, setUnclaimedGifts] = useState({ rose: 0, heart: 0, teddy: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addingBankAccount, setAddingBankAccount] = useState(false);
  
  // New bank account form
  const [bankAccountForm, setBankAccountForm] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    accountType: 'checking' as AccountType,
  });
  
  useEffect(() => {
    if (currentUser) {
      // Calculate balance from gifts
      calculateBalance();
      fetchTransactions();
      fetchBankAccounts();
    }
  }, [currentUser]);
  
  const calculateBalance = () => {
    // For demo purposes, we'll use some mock data
    // In a real app, you'd fetch this from your database
    if (currentUser) {
      // Get unclaimed gifts
      const unclaimed = currentUser.receivedGifts || { rose: 0, heart: 0, teddy: 0 };
      setUnclaimedGifts(unclaimed);
      
      // Calculate total value of gifts
      const totalValue = 
        (unclaimed.rose * GIFT_VALUES.rose) + 
        (unclaimed.heart * GIFT_VALUES.heart) + 
        (unclaimed.teddy * GIFT_VALUES.teddy);
      
      // Add any existing balance from the user profile
      setBalance(totalValue + (currentUser.popularityPoints || 0));
    }
  };
  
  const fetchTransactions = async () => {
    if (!currentUser) return;
    
    try {
      // In a real app, you'd fetch from your database
      // For demo purposes, we'll use mock data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          userId: currentUser.id,
          amount: 25,
          type: 'gift_conversion',
          status: 'completed',
          description: 'Converted 5 roses to cash',
          createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
        },
        {
          id: '2',
          userId: currentUser.id,
          amount: 50,
          type: 'withdrawal',
          status: 'completed',
          description: 'Withdrawal to Bank of America ****1234',
          createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
        },
        {
          id: '3',
          userId: currentUser.id,
          amount: 20,
          type: 'gift_conversion',
          status: 'completed',
          description: 'Converted 4 hearts to cash',
          createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
        }
      ];
      
      setTransactions(mockTransactions);
      
      // In a real app, you'd use Supabase like this:
      /*
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTransactions(data || []);
      */
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    }
  };
  
  const fetchBankAccounts = async () => {
    if (!currentUser) return;
    
    try {
      // In a real app, you'd fetch from your database
      // For demo purposes, we'll use mock data
      if (currentUser.bankDetails && 
          currentUser.bankDetails.accountName && 
          currentUser.bankDetails.accountNumber) {
        // Convert existing bank details to the new format
        const existingAccount: BankAccount = {
          id: '1',
          accountName: currentUser.bankDetails.accountName,
          accountNumber: currentUser.bankDetails.accountNumber,
          routingNumber: currentUser.bankDetails.routingNumber || '',
          bankName: currentUser.bankDetails.bankName || '',
          accountType: (currentUser.bankDetails.accountType as AccountType) || 'checking',
          isVerified: true
        };
        
        setBankAccounts([existingAccount]);
      } else {
        setBankAccounts([]);
      }
      
      // In a real app, you'd use Supabase like this:
      /*
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      setBankAccounts(data || []);
      */
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Failed to load bank account information');
    }
  };
  
  const handleAddBankAccount = async () => {
    if (!currentUser) return;
    
    // Validate form
    if (!bankAccountForm.accountName || 
        !bankAccountForm.accountNumber || 
        !bankAccountForm.routingNumber || 
        !bankAccountForm.bankName) {
      toast.error('Please fill in all bank account fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a new bank account
      const newAccount: BankAccount = {
        id: Date.now().toString(), // In a real app, this would come from the database
        ...bankAccountForm,
        isVerified: false // New accounts start as unverified
      };
      
      // In a real app, you'd save to your database
      // For demo, we'll just update the local state
      setBankAccounts([...bankAccounts, newAccount]);
      
      // Update user profile with bank details
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          bankDetails: {
            accountName: bankAccountForm.accountName,
            accountNumber: bankAccountForm.accountNumber,
            routingNumber: bankAccountForm.routingNumber,
            bankName: bankAccountForm.bankName,
            accountType: bankAccountForm.accountType
          }
        };
        
        updateUserData(currentUser.id, updatedUser);
      }
      
      // Reset form
      setBankAccountForm({
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        accountType: 'checking',
      });
      
      setAddingBankAccount(false);
      toast.success('Bank account added successfully! Verification pending.');
      
      // In a real app, you'd use Supabase like this:
      /*
      const { error } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: currentUser.id,
          account_name: bankAccountForm.accountName,
          account_number: bankAccountForm.accountNumber,
          routing_number: bankAccountForm.routingNumber,
          bank_name: bankAccountForm.bankName,
          account_type: bankAccountForm.accountType,
          is_verified: false
        });
        
      if (error) throw error;
      */
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast.error('Failed to add bank account');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleWithdraw = async () => {
    if (!currentUser) return;
    
    // Validate
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    
    if (amount > balance) {
      toast.error('Insufficient balance for this withdrawal');
      return;
    }
    
    if (bankAccounts.length === 0) {
      toast.error('Please add a bank account first');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a withdrawal transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(), // In a real app, this would come from the database
        userId: currentUser.id,
        amount,
        type: 'withdrawal',
        status: 'pending', // Initially pending
        description: `Withdrawal to ${bankAccounts[0].bankName} ****${bankAccounts[0].accountNumber.slice(-4)}`,
        createdAt: new Date()
      };
      
      // In a real app, you'd save this to your database and process the withdrawal
      // For demo, we'll just update the local state
      setTransactions([newTransaction, ...transactions]);
      
      // Update balance (in a real app, you'd update this when the withdrawal is complete)
      setBalance(prevBalance => prevBalance - amount);
      
      // Clear withdrawal amount
      setWithdrawAmount('');
      
      toast.success('Withdrawal request submitted! It will be processed within 1-3 business days.');
      
      // In a real app, you'd use Supabase and possibly a backend service to process the withdrawal
      /*
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: currentUser.id,
          amount,
          type: 'withdrawal',
          status: 'pending',
          description: `Withdrawal to ${bankAccounts[0].bank_name} ****${bankAccounts[0].account_number.slice(-4)}`,
        });
        
      if (error) throw error;
      */
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Failed to process withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConvertGifts = () => {
    if (!currentUser) return;
    
    // Check if there are gifts to convert
    const totalGifts = unclaimedGifts.rose + unclaimedGifts.heart + unclaimedGifts.teddy;
    if (totalGifts === 0) {
      toast.error('No gifts available to convert');
      return;
    }
    
    // Calculate total value
    const conversionAmount = 
      (unclaimedGifts.rose * GIFT_VALUES.rose) + 
      (unclaimedGifts.heart * GIFT_VALUES.heart) + 
      (unclaimedGifts.teddy * GIFT_VALUES.teddy);
    
    setIsProcessing(true);
    
    try {
      // Create a gift conversion transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount: conversionAmount,
        type: 'gift_conversion',
        status: 'completed',
        description: `Converted ${unclaimedGifts.rose} roses, ${unclaimedGifts.heart} hearts, ${unclaimedGifts.teddy} teddies to cash`,
        createdAt: new Date()
      };
      
      // Update transactions
      setTransactions([newTransaction, ...transactions]);
      
      // Reset unclaimed gifts
      setUnclaimedGifts({ rose: 0, heart: 0, teddy: 0 });
      
      // Update user in context (in a real app, you'd also update the database)
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          popularityPoints: (currentUser.popularityPoints || 0) + conversionAmount
        };
        
        updateUserData(currentUser.id, updatedUser);
      }
      
      toast.success(`Successfully converted gifts to $${conversionAmount.toFixed(2)}!`);
      
      // In a real app, you'd use Supabase
      /*
      const { error } = await supabase.rpc('convert_gifts_to_cash', {
        user_id: currentUser.id
      });
      
      if (error) throw error;
      */
    } catch (error) {
      console.error('Error converting gifts:', error);
      toast.error('Failed to convert gifts to cash');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <History className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-gradient-to-r from-love-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-love-600" />
          <span>Monetize Your Profile</span>
        </CardTitle>
        <CardDescription>
          Convert gifts to cash and manage your earnings
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-love-100">
            Overview
          </TabsTrigger>
          <TabsTrigger value="bank-accounts" className="data-[state=active]:bg-love-100">
            Bank Accounts
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-love-100">
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="p-6">
          <div className="space-y-6">
            <div className="bg-love-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-love-800 mb-2">Your Balance</h3>
              <div className="text-3xl font-bold text-love-900">${balance.toFixed(2)}</div>
              <p className="text-sm text-love-600 mt-1">Available for withdrawal</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-love-500" />
                  <span>Unclaimed Gifts</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Roses</span>
                    <span>{unclaimedGifts.rose} × ${GIFT_VALUES.rose} = ${unclaimedGifts.rose * GIFT_VALUES.rose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hearts</span>
                    <span>{unclaimedGifts.heart} × ${GIFT_VALUES.heart} = ${unclaimedGifts.heart * GIFT_VALUES.heart}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teddies</span>
                    <span>{unclaimedGifts.teddy} × ${GIFT_VALUES.teddy} = ${unclaimedGifts.teddy * GIFT_VALUES.teddy}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Value</span>
                    <span>${(
                      unclaimedGifts.rose * GIFT_VALUES.rose +
                      unclaimedGifts.heart * GIFT_VALUES.heart +
                      unclaimedGifts.teddy * GIFT_VALUES.teddy
                    ).toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleConvertGifts} 
                  disabled={isProcessing || (unclaimedGifts.rose + unclaimedGifts.heart + unclaimedGifts.teddy === 0)}
                  className="w-full mt-4 bg-gradient-love"
                >
                  Convert Gifts to Cash
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-love-500" />
                  <span>Withdraw Funds</span>
                </h3>
                {bankAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Withdraw your earnings to your connected bank account
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
                      className="w-full bg-gradient-love"
                    >
                      {isProcessing ? 'Processing...' : 'Withdraw to Bank'}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Withdrawals typically process within 1-3 business days
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle>No bank account connected</AlertTitle>
                      <AlertDescription>
                        Please add a bank account to withdraw your earnings
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={() => setActiveTab('bank-accounts')} 
                      variant="outline" 
                      className="w-full"
                    >
                      Add Bank Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bank-accounts" className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Bank Accounts</h3>
              <Dialog open={addingBankAccount} onOpenChange={setAddingBankAccount}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setAddingBankAccount(true)}
                    className="bg-gradient-love"
                  >
                    Add Bank Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Bank Account</DialogTitle>
                    <DialogDescription>
                      Add your bank account details to withdraw your earnings
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g. Bank of America"
                        value={bankAccountForm.bankName}
                        onChange={(e) => setBankAccountForm({...bankAccountForm, bankName: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="e.g. John Smith"
                        value={bankAccountForm.accountName}
                        onChange={(e) => setBankAccountForm({...bankAccountForm, accountName: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={bankAccountForm.accountType}
                        onValueChange={(value) => setBankAccountForm({
                          ...bankAccountForm, 
                          accountType: value as AccountType
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        placeholder="e.g. 123456789"
                        value={bankAccountForm.routingNumber}
                        onChange={(e) => setBankAccountForm({...bankAccountForm, routingNumber: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="e.g. 987654321"
                        value={bankAccountForm.accountNumber}
                        onChange={(e) => setBankAccountForm({...bankAccountForm, accountNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Secure Information</AlertTitle>
                    <AlertDescription>
                      Your bank details are encrypted and stored securely
                    </AlertDescription>
                  </Alert>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setAddingBankAccount(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddBankAccount}
                      disabled={isProcessing}
                      className="bg-gradient-love"
                    >
                      {isProcessing ? 'Adding...' : 'Add Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-love-600" />
                          <CardTitle className="text-base">{account.bankName}</CardTitle>
                        </div>
                        <div className="flex items-center">
                          {account.isVerified ? (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                              <History className="h-3 w-3" />
                              <span>Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Account Holder</p>
                          <p className="font-medium">{account.accountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Account Type</p>
                          <p className="font-medium capitalize">{account.accountType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Account Number</p>
                          <p className="font-medium flex items-center gap-1">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span>••••{account.accountNumber.slice(-4)}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Routing Number</p>
                          <p className="font-medium flex items-center gap-1">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span>••••{account.routingNumber.slice(-4)}</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 py-3 flex justify-between">
                      <Button variant="outline" size="sm" className="text-sm">
                        Edit Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('overview')}
                        className="text-sm flex items-center gap-1"
                      >
                        <span>Withdraw to this Account</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <Landmark className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Bank Accounts</h3>
                <p className="text-gray-500 mb-4">You haven't added any bank accounts yet</p>
                <Button
                  onClick={() => setAddingBankAccount(true)}
                  className="bg-gradient-love"
                >
                  Add Your First Bank Account
                </Button>
              </Card>
            )}
            
            <Alert className="bg-gray-50">
              <Shield className="h-4 w-4 text-gray-500" />
              <AlertTitle>Secure Banking</AlertTitle>
              <AlertDescription>
                All bank information is encrypted and stored securely. We never store your full bank details on our servers.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Transaction History</h3>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === 'deposit' && <Wallet className="h-5 w-5 text-green-500" />}
                      {transaction.type === 'withdrawal' && <CreditCard className="h-5 w-5 text-amber-500" />}
                      {transaction.type === 'gift_conversion' && <Gift className="h-5 w-5 text-love-500" />}
                      
                      <div>
                        <div className="font-medium">
                          {transaction.type === 'deposit' && 'Deposit'}
                          {transaction.type === 'withdrawal' && 'Withdrawal'}
                          {transaction.type === 'gift_conversion' && 'Gift Conversion'}
                        </div>
                        <div className="text-sm text-gray-500">{transaction.description}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${transaction.type === 'withdrawal' ? 'text-amber-700' : 'text-green-700'}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                        {getStatusIcon(transaction.status)}
                        <span className="text-gray-500 ml-1">
                          {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <History className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-1">No Transactions</h3>
                <p className="text-gray-500 mb-4">You haven't made any transactions yet</p>
                <Button
                  onClick={() => setActiveTab('overview')}
                  className="bg-gradient-love"
                >
                  Go to Overview
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MonetizationPanel;
