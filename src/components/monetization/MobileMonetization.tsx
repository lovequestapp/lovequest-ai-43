
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from '@/context/UserContext';
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';
import { Check, AlertCircle, CreditCard, Gift, History, Wallet, DollarSign, ArrowRight, Shield, Lock } from 'lucide-react';

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

const MobileMonetization: React.FC = () => {
  const { currentUser, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [unclaimedGifts, setUnclaimedGifts] = useState({ rose: 0, heart: 0, teddy: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  
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
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    }
  };
  
  const fetchBankAccounts = async () => {
    if (!currentUser) return;
    
    try {
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
        id: Date.now().toString(),
        ...bankAccountForm,
        isVerified: false // New accounts start as unverified
      };
      
      // Update local state
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
      
      setShowBankForm(false);
      toast.success('Bank account added successfully! Verification pending.');
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
        id: Date.now().toString(),
        userId: currentUser.id,
        amount,
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal to ${bankAccounts[0].bankName} ****${bankAccounts[0].accountNumber.slice(-4)}`,
        createdAt: new Date()
      };
      
      // Update local state
      setTransactions([newTransaction, ...transactions]);
      
      // Update balance
      setBalance(prevBalance => prevBalance - amount);
      
      // Clear withdrawal amount
      setWithdrawAmount('');
      
      toast.success('Withdrawal request submitted! It will be processed within 1-3 business days.');
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
      
      // Update user in context
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          popularityPoints: (currentUser.popularityPoints || 0) + conversionAmount
        };
        
        updateUserData(currentUser.id, updatedUser);
      }
      
      toast.success(`Successfully converted gifts to $${conversionAmount.toFixed(2)}!`);
    } catch (error) {
      console.error('Error converting gifts:', error);
      toast.error('Failed to convert gifts to cash');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-1 pb-16">
      <div className="bg-gradient-to-r from-love-50 to-purple-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
          <DollarSign className="h-5 w-5 text-love-600" />
          <span>Monetize Your Profile</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Convert gifts to cash and withdraw your earnings
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="bank" className="text-xs">Bank Account</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="bg-love-50 p-4 rounded-lg">
            <h3 className="text-base font-medium text-love-800 mb-1">Available Balance</h3>
            <div className="text-2xl font-bold text-love-900">${balance.toFixed(2)}</div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-4 w-4 text-love-500" />
                Unclaimed Gifts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
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
                  <span>Total Gift Value</span>
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4 text-love-500" />
                Withdraw Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
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
                    <p className="text-xs text-muted-foreground">
                      Processing fee: 2.9% of withdrawal amount
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
                      className="bg-gradient-love"
                      size="sm"
                    >
                      Instant Deposit
                    </Button>
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
                      variant="outline"
                      size="sm"
                    >
                      Standard (1-3 days)
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Instant deposit fees: 1.5% additional fee (min $0.25, max $10)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-sm font-medium">No bank account connected</AlertTitle>
                    <AlertDescription className="text-xs">
                      Please add a bank account to withdraw your earnings
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => setActiveTab('bank')} 
                    variant="outline" 
                    className="w-full"
                  >
                    Add Bank Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank" className="space-y-4">
          {showBankForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Bank Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g. Bank of America"
                      value={bankAccountForm.bankName}
                      onChange={(e) => setBankAccountForm({...bankAccountForm, bankName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      placeholder="e.g. John Smith"
                      value={bankAccountForm.accountName}
                      onChange={(e) => setBankAccountForm({...bankAccountForm, accountName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <select
                      id="accountType"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={bankAccountForm.accountType}
                      onChange={(e) => setBankAccountForm({
                        ...bankAccountForm, 
                        accountType: e.target.value as AccountType
                      })}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder="e.g. 123456789"
                      value={bankAccountForm.routingNumber}
                      onChange={(e) => setBankAccountForm({...bankAccountForm, routingNumber: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="e.g. 987654321"
                      value={bankAccountForm.accountNumber}
                      onChange={(e) => setBankAccountForm({...bankAccountForm, accountNumber: e.target.value})}
                    />
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200 mt-4">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-sm font-medium">Secure Information</AlertTitle>
                    <AlertDescription className="text-xs">
                      Your bank details are encrypted and stored securely
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowBankForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddBankAccount}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-love"
                    >
                      {isProcessing ? 'Adding...' : 'Save Account'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium">Your Bank Accounts</h3>
                <Button 
                  onClick={() => setShowBankForm(true)}
                  size="sm"
                  className="bg-gradient-love"
                >
                  Add Account
                </Button>
              </div>
              
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <Card key={account.id} className="overflow-hidden">
                      <CardHeader className="py-3 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm">{account.bankName}</CardTitle>
                          {account.isVerified ? (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                              <Check className="h-3 w-3" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                              <History className="h-3 w-3" />
                              <span>Pending</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Account Holder</p>
                            <p className="font-medium">{account.accountName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Account Type</p>
                            <p className="font-medium capitalize">{account.accountType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Account Number</p>
                            <p className="font-medium flex items-center gap-1">
                              <Lock className="h-3 w-3 text-gray-400" />
                              <span>••••{account.accountNumber.slice(-4)}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Routing Number</p>
                            <p className="font-medium flex items-center gap-1">
                              <Lock className="h-3 w-3 text-gray-400" />
                              <span>••••{account.routingNumber.slice(-4)}</span>
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-3 text-sm bg-gradient-love"
                          onClick={() => setActiveTab('overview')}
                          size="sm"
                        >
                          Withdraw to this Account
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-8 w-8 text-gray-300 mb-2" />
                  <h3 className="text-base font-medium mb-1">No Bank Accounts</h3>
                  <p className="text-sm text-gray-500 mb-3">You haven't added any bank accounts yet</p>
                  <Button
                    onClick={() => setShowBankForm(true)}
                    className="bg-gradient-love"
                  >
                    Add Your First Bank Account
                  </Button>
                </Card>
              )}
              
              <Alert className="bg-gray-50 mt-4">
                <Shield className="h-4 w-4 text-gray-500" />
                <AlertTitle className="text-sm font-medium">Secure Banking</AlertTitle>
                <AlertDescription className="text-xs">
                  All bank information is encrypted and stored securely
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <h3 className="text-base font-medium mb-2">Transaction History</h3>
          
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <div className="flex items-center p-3 border-b">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {transaction.type === 'withdrawal' ? (
                          <Wallet className="h-4 w-4 text-blue-500 mr-2" />
                        ) : (
                          <Gift className="h-4 w-4 text-love-500 mr-2" />
                        )}
                        <p className="text-sm font-medium">{transaction.description}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${transaction.type === 'withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs flex items-center justify-end">
                        {transaction.status === 'completed' && (
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </span>
                        )}
                        {transaction.status === 'pending' && (
                          <span className="flex items-center text-yellow-600">
                            <History className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                        {transaction.status === 'failed' && (
                          <span className="flex items-center text-red-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center text-center">
              <History className="h-8 w-8 text-gray-300 mb-2" />
              <h3 className="text-base font-medium mb-1">No Transactions</h3>
              <p className="text-sm text-gray-500">
                Your transaction history will appear here
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileMonetization;
