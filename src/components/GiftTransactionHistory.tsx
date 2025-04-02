
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

interface Transaction {
  id: string;
  created_at: string;
  gift_type: 'rose' | 'heart' | 'teddy';
  transaction_type: 'purchase' | 'gift';
  amount: number;
  purchase_amount: number | null;
  sender_id?: string;
  recipient_id?: string;
  sender_name?: string;
  recipient_name?: string;
}

const GiftTransactionHistory = () => {
  const { currentUser } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        
        // Using raw SQL query to handle tables that might not be in TypeScript definitions yet
        const { data, error } = await supabase
          .from('gift_transactions')
          .select('*')
          .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });
            
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        // Fetch sender and recipient names in a separate query
        const processedData = await Promise.all(data.map(async (transaction) => {
          let senderName = 'Unknown';
          let recipientName = 'Unknown';
          
          if (transaction.sender_id) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', transaction.sender_id)
              .single();
              
            if (senderData?.name) {
              senderName = senderData.name;
            }
          }
          
          if (transaction.recipient_id) {
            const { data: recipientData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', transaction.recipient_id)
              .single();
              
            if (recipientData?.name) {
              recipientName = recipientData.name;
            }
          }
          
          return {
            ...transaction,
            sender_name: senderName,
            recipient_name: recipientName,
          };
        }));
        
        setTransactions(processedData);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [currentUser?.id]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const renderGiftIcon = (type: 'rose' | 'heart' | 'teddy') => {
    switch(type) {
      case 'rose': return '🌹';
      case 'heart': return '❤️';
      case 'teddy': return '🧸';
      default: return '🎁';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-love-200 rounded-full border-t-love-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            You don't have any gift transactions yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map(transaction => (
          <div key={transaction.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{renderGiftIcon(transaction.gift_type)}</span>
                <span className="font-medium capitalize">{transaction.gift_type}</span>
                <Badge variant={transaction.transaction_type === 'purchase' ? 'outline' : 'default'}>
                  {transaction.transaction_type === 'purchase' ? 'Purchased' : 'Gifted'}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(transaction.created_at)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                {transaction.transaction_type === 'purchase' ? (
                  <p>You purchased {transaction.amount} {transaction.gift_type}{transaction.amount > 1 ? 's' : ''}</p>
                ) : (
                  <p>
                    {transaction.sender_id === currentUser?.id 
                      ? `You sent ${transaction.amount} ${transaction.gift_type}${transaction.amount > 1 ? 's' : ''} to ${transaction.recipient_name}`
                      : `You received ${transaction.amount} ${transaction.gift_type}${transaction.amount > 1 ? 's' : ''} from ${transaction.sender_name}`
                    }
                  </p>
                )}
              </div>
              
              {transaction.purchase_amount && (
                <Badge variant="outline" className="bg-green-50 text-green-800">
                  ${transaction.purchase_amount.toFixed(2)}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GiftTransactionHistory;
