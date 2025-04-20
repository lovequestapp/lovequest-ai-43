
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";

const MobileMonetization = () => {
  const { currentUser } = useUser();
  const [amount, setAmount] = useState<number>(50);
  const [payoutMethod, setPayoutMethod] = useState<string>("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Helper function to safely extract count from possibly object or number gift data
  const getGiftCount = (giftData: any): number => {
    // It can be a number or an object with count property
    if (giftData == null) return 0;
    if (typeof giftData === 'number') return giftData;
    if (typeof giftData === 'object' && typeof giftData.count === 'number') return giftData.count;
    return 0;
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const handleWithdrawal = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Calculate estimated earnings as total of gifts * values
  const calculateEarnings = (): number => {
    if (!currentUser) return 0;
    
    const roseCount = getGiftCount(currentUser.receivedGifts?.rose);
    const heartCount = getGiftCount(currentUser.receivedGifts?.heart);
    const teddyCount = getGiftCount(currentUser.receivedGifts?.teddy);
    
    // Values correspond to:
    // rose = 1,
    // heart = 3,
    // teddy = 5
    return roseCount * 1 + heartCount * 3 + teddyCount * 5;
  };
  
  const earnings = calculateEarnings();
  const isPremium = currentUser?.premiumStatus !== 'standard';
  
  // Calculate popularity score similarly
  const popularityScore = (): number => {
    if (!currentUser) return 0;
    let score = currentUser.popularityPoints || 0;

    score += getGiftCount(currentUser.receivedGifts?.rose) * 1;
    score += getGiftCount(currentUser.receivedGifts?.heart) * 5;
    score += getGiftCount(currentUser.receivedGifts?.teddy) * 10;

    return score;
  };
  
  // Gift stats with icons, counts, and values
  const giftStats = [
    { 
      type: "rose",
      icon: "🌹",
      count: getGiftCount(currentUser?.receivedGifts?.rose),
      value: 1
    },
    { 
      type: "heart", 
      icon: "❤️",
      count: getGiftCount(currentUser?.receivedGifts?.heart),
      value: 3
    },
    { 
      type: "teddy",
      icon: "🧸", 
      count: getGiftCount(currentUser?.receivedGifts?.teddy),
      value: 5
    }
  ];
  
  return (
    <div className="py-2 space-y-5">
      {/* Earnings Summary */}
      <Card className="border-love-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <span role="img" aria-label="wallet" className="mr-2 text-love-500" style={{fontSize: '1.25rem'}}>💰</span>
            Earnings Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <div className="text-3xl font-bold text-love-600">${earnings.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="text-sm text-muted-foreground">Popularity</div>
              <div className="text-lg font-semibold">{popularityScore()}</div>
            </div>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-lg font-semibold capitalize">
                {isPremium ? (
                  <span className="text-amber-500">{currentUser?.premiumStatus}</span>
                ) : (
                  <span>Standard</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Gift Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <span role="img" aria-label="gifts" className="mr-2 text-love-500" style={{fontSize:'1.25rem'}}>🎁</span>
            Received Gifts
          </CardTitle>
          <CardDescription>
            Gifts you've received from admirers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center space-x-4">
            {giftStats.map((gift) => (
              <div 
                key={gift.type}
                className="flex flex-col items-center p-3 bg-muted rounded-lg text-center flex-1"
              >
                <div className="text-2xl mb-1" aria-label={gift.type}>{gift.icon}</div>
                <div className="text-lg font-bold">{gift.count}</div>
                <div className="text-xs text-muted-foreground capitalize">{gift.type}s</div>
                <div className="text-xs mt-1 text-love-500">${(gift.count * gift.value).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Withdrawal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <span role="img" aria-label="dollar" className="mr-2 text-love-500" style={{fontSize:'1.25rem'}}>💵</span>
            Withdraw Earnings
          </CardTitle>
          <CardDescription>
            Transfer your earnings to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min={10}
              max={earnings}
            />
            <p className="text-xs text-muted-foreground">Minimum withdrawal: $10</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Payout Method</Label>
            <Select 
              value={payoutMethod} 
              onValueChange={setPayoutMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payout method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleWithdrawal}
            disabled={amount < 10 || amount > earnings || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Withdraw Funds'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Upgrade Banner */}
      {currentUser?.premiumStatus === 'standard' && (
        <div 
          className="rounded-lg p-4 bg-gradient-to-r from-love-100 to-love-200 border border-love-200"
          aria-live="polite"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-love-500 text-white p-2 rounded-full font-bold text-lg">
              💎
            </div>
            <div>
              <h3 className="font-semibold text-love-800">Upgrade Your Account</h3>
              <p className="text-sm text-love-600 mt-1">
                Get premium features with Unlimited or VIP subscription
              </p>
              <Button size="sm" className="mt-3 bg-love-500 hover:bg-love-600">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMonetization;
