
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { initiateWithdrawal } from '@/services/profileService';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

interface WithdrawalFormProps {
  balance: number;
  userId: string;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ balance, userId }) => {
  const [amount, setAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'paypal'>('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (parseFloat(amount) > balance) {
      toast.error("Withdrawal amount exceeds your available balance");
      return;
    }
    
    setIsProcessing(true);
    try {
      const success = await initiateWithdrawal(userId, parseFloat(amount), withdrawMethod);
      
      if (success) {
        setAmount('');
        toast.success(`Withdrawal of ${formatCurrency(parseFloat(amount))} initiated`, {
          description: "Your funds will be transferred shortly"
        });
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Withdraw Funds</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Available balance: {formatCurrency(balance)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Withdrawal Method</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={withdrawMethod === 'bank' ? "default" : "outline"}
              className={withdrawMethod === 'bank' ? "bg-love-500 hover:bg-love-600" : ""}
              onClick={() => setWithdrawMethod('bank')}
            >
              Bank Transfer
            </Button>
            <Button
              type="button"
              variant={withdrawMethod === 'paypal' ? "default" : "outline"}
              className={withdrawMethod === 'paypal' ? "bg-love-500 hover:bg-love-600" : ""}
              onClick={() => setWithdrawMethod('paypal')}
            >
              PayPal
            </Button>
          </div>
        </div>
        
        <div className="text-sm space-y-1">
          <p className="font-medium">Fees and Processing Times:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>• Standard transfer: 2-3 business days (free)</li>
            <li>• Instant transfer: Same day (2.9% fee)</li>
          </ul>
        </div>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleWithdraw} 
            disabled={isProcessing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
            className="bg-love-500 hover:bg-love-600 w-full sm:w-auto"
          >
            {isProcessing ? "Processing..." : "Withdraw Funds"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;
