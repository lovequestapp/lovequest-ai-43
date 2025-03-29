import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { CheckIcon, CircleDollarSign, Wallet, CreditCard, ArrowDownToLine, History, BanknoteIcon, HeartIcon, GiftIcon, BadgeDollarSign, ArrowRight, Calendar, ChevronDown } from 'lucide-react';

const Monetization = () => {
  const { 
    currentUser, 
    getGiftMonetizationDetails, 
    initiateWithdrawal, 
    updateBankDetails,
    getWithdrawalHistory,
    getPendingWithdrawal 
  } = useUser();
  
  const monetizationDetails = getGiftMonetizationDetails();
  const { 
    availableBalance,
    giftValues,
    minimumWithdrawal,
    currency,
    exchangeRates
  } = monetizationDetails;
  
  const [activeTab, setActiveTab] = useState('balance');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: currentUser?.bankDetails?.accountName || '',
    accountNumber: currentUser?.bankDetails?.accountNumber || '',
    bankName: currentUser?.bankDetails?.bankName || '',
    routingNumber: currentUser?.bankDetails?.routingNumber || '',
    accountType: currentUser?.bankDetails?.accountType || ''
  });
  
  const pendingWithdrawal = getPendingWithdrawal();
  const withdrawalHistory = getWithdrawalHistory() || [];
  
  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast("Invalid Amount - Please enter a valid withdrawal amount");
      return;
    }
    
    const success = initiateWithdrawal(amount);
    if (success) {
      setWithdrawalAmount('');
    }
  };
  
  const handleSubmitBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateBankDetails({
      accountName: bankDetails.accountName,
      accountNumber: bankDetails.accountNumber,
      bankName: bankDetails.bankName,
      routingNumber: bankDetails.routingNumber,
      accountType: bankDetails.accountType || 'checking'
    });
  };
  
  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    setShowCurrencySelector(false);
  };
  
  const convertCurrency = (amountUSD: number): number => {
    return amountUSD * (exchangeRates[selectedCurrency as keyof typeof exchangeRates] || 1);
  };
  
  const formatCurrency = (amount: number): string => {
    let locale = 'en-US';
    switch(selectedCurrency) {
      case 'EUR': locale = 'de-DE'; break;
      case 'GBP': locale = 'en-GB'; break;
      case 'JPY': locale = 'ja-JP'; break;
      case 'CAD': locale = 'en-CA'; break;
      case 'AUD': locale = 'en-AU'; break;
      case 'CNY': locale = 'zh-CN'; break;
      case 'INR': locale = 'en-IN'; break;
      default: locale = 'en-US';
    }
    
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: selectedCurrency 
    }).format(amount);
  };
  
  const getCurrencySymbol = (currencyCode: string): string => {
    switch(currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'CNY': return '¥';
      case 'INR': return '₹';
      default: return currencyCode;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold">Monetization</h2>
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowCurrencySelector(!showCurrencySelector)}
          >
            {getCurrencySymbol(selectedCurrency)} {selectedCurrency}
            <ChevronDown size={16} />
          </Button>
          
          {showCurrencySelector && (
            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md border z-10">
              <div className="p-1 grid grid-cols-1 w-36">
                {Object.keys(exchangeRates).map(curr => (
                  <button 
                    key={curr}
                    className={`text-left px-3 py-2 hover:bg-gray-100 rounded ${curr === selectedCurrency ? 'bg-love-50 text-love-600' : ''}`}
                    onClick={() => handleCurrencyChange(curr)}
                  >
                    {getCurrencySymbol(curr)} {curr}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-love-50 to-purple-50 border border-love-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Balance</p>
              <h3 className="text-3xl font-bold">{formatCurrency(convertCurrency(availableBalance))}</h3>
            </div>
            <div className="h-14 w-14 rounded-full bg-love-100 flex items-center justify-center">
              <Wallet className="text-love-500 h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gift Values</CardTitle>
              <CardDescription>See how much each gift is worth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <HeartIcon className="text-rose-500 h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Rose</p>
                      <p className="text-sm text-gray-500">Simple but meaningful</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-love-50 text-love-700">
                    {formatCurrency(convertCurrency(giftValues.rose))}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                      <HeartIcon className="text-red-500 fill-red-500 h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Heart</p>
                      <p className="text-sm text-gray-500">Show your affection</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-love-50 text-love-700">
                    {formatCurrency(convertCurrency(giftValues.heart))}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <GiftIcon className="text-amber-700 h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Teddy Bear</p>
                      <p className="text-sm text-gray-500">Cute and cuddly</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-love-50 text-love-700">
                    {formatCurrency(convertCurrency(giftValues.teddy))}
                  </Badge>
                </div>
              </div>
              
              <Alert className="mt-6 bg-blue-50 border-blue-200">
                <CircleDollarSign className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  Each gift you receive is automatically converted to cash value in your balance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <BadgeDollarSign className="text-green-600 h-6 w-6" />
                  </div>
                  <p className="font-medium">Minimum Withdrawal</p>
                  <p className="text-2xl font-semibold mt-1">{formatCurrency(convertCurrency(minimumWithdrawal))}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <BanknoteIcon className="text-amber-600 h-6 w-6" />
                  </div>
                  <p className="font-medium">Processing Time</p>
                  <p className="text-2xl font-semibold mt-1">1-3 Days</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <CreditCard className="text-purple-600 h-6 w-6" />
                  </div>
                  <p className="font-medium">Withdrawal Fee</p>
                  <p className="text-2xl font-semibold mt-1">Free</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="withdraw" className="space-y-4 mt-4">
          {pendingWithdrawal ? (
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal in Progress</CardTitle>
                <CardDescription>Your withdrawal is being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CircleDollarSign className="h-5 w-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-800">Transaction Pending</h4>
                    </div>
                    <p className="text-amber-700 text-sm">
                      Your withdrawal of {formatCurrency(convertCurrency(pendingWithdrawal.amount))} is being processed.
                      This typically takes 1-3 business days.
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">{formatCurrency(convertCurrency(pendingWithdrawal.amount))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Requested</span>
                    <span>{new Date(pendingWithdrawal.requestDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Transfer your earnings to your bank account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdrawalAmount">Amount ({selectedCurrency})</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">{getCurrencySymbol(selectedCurrency)}</span>
                        </div>
                        <Input
                          id="withdrawalAmount"
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum withdrawal: {formatCurrency(convertCurrency(minimumWithdrawal))}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-love hover:opacity-90"
                      onClick={handleWithdrawal}
                      disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < minimumWithdrawal / exchangeRates[selectedCurrency as keyof typeof exchangeRates] || parseFloat(withdrawalAmount) > availableBalance / exchangeRates[selectedCurrency as keyof typeof exchangeRates]}
                    >
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Withdraw to Bank Account
                    </Button>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-700">
                        Withdrawals typically process within 1-3 business days.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                  <CardDescription>Add or update your bank information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Your full name"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Your account number"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="Your bank's name"
                        value={bankDetails.bankName}
                        onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="swiftCode">SWIFT/BIC Code (optional)</Label>
                      <Input
                        id="swiftCode"
                        placeholder="For international transfers"
                        value={bankDetails.swiftCode}
                        onChange={(e) => setBankDetails({...bankDetails, swiftCode: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleSubmitBankDetails}>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Save Bank Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your past withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawalHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">No transaction history yet</p>
                  <p className="text-sm text-gray-400">Your completed withdrawals will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawalHistory.map((withdrawal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          withdrawal.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <ArrowDownToLine className={`h-5 w-5 ${
                            withdrawal.status === 'approved' ? 'text-green-500' : 'text-red-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">Withdrawal</p>
                          <p className="text-sm text-gray-500">
                            {new Date(withdrawal.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(convertCurrency(withdrawal.amount))}
                        </p>
                        <Badge className={`mt-1 ${
                          withdrawal.status === 'approved' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Monetization;
