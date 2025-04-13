
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGifts } from '@/hooks/useGifts';
import GiftInventory from '@/components/GiftInventory';
import GiftTransactionHistory from '@/components/GiftTransactionHistory';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2, Flower, Heart, Rabbit } from 'lucide-react';

const GiftItem = ({ 
  type, 
  icon, 
  price, 
  onPurchase 
}: { 
  type: 'rose' | 'heart' | 'teddy'; 
  icon: React.ReactNode; 
  price: number;
  onPurchase: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="text-4xl flex items-center justify-center w-12 h-12">
          {icon}
        </div>
        <div>
          <h3 className="font-medium capitalize">{type}</h3>
          <p className="text-sm text-muted-foreground">Send a {type} to show your affection</p>
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-20"
        />
        <Button onClick={() => onPurchase(quantity)}>
          Buy
        </Button>
      </div>
    </div>
  );
};

const Shop = () => {
  const { isLoading } = useProtectedRoute({ requireAuth: true });
  const { purchaseGifts, isProcessing } = useGifts();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handlePurchase = async (type: 'rose' | 'heart' | 'teddy', quantity: number) => {
    await purchaseGifts(type, quantity);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gift Shop</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="inventory">My Inventory</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shop" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Gifts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <GiftItem 
                  type="rose" 
                  icon={<Flower className="h-8 w-8 text-red-500" />} 
                  price={4.99} 
                  onPurchase={(quantity) => handlePurchase('rose', quantity)} 
                />
                <GiftItem 
                  type="heart" 
                  icon={<Heart className="h-8 w-8 text-love-500" />} 
                  price={9.99} 
                  onPurchase={(quantity) => handlePurchase('heart', quantity)} 
                />
                <GiftItem 
                  type="teddy" 
                  icon={<Rabbit className="h-8 w-8 text-amber-500" />} 
                  price={14.99} 
                  onPurchase={(quantity) => handlePurchase('teddy', quantity)} 
                />
              </CardContent>
            </Card>
            
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Gift Values</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <span className="inline-block mr-1"><Flower className="h-4 w-4 text-red-500 inline" /></span> 
                  Roses: $1 in monetary value
                </li>
                <li>
                  <span className="inline-block mr-1"><Heart className="h-4 w-4 text-love-500 inline" /></span> 
                  Hearts: $3 in monetary value
                </li>
                <li>
                  <span className="inline-block mr-1"><Rabbit className="h-4 w-4 text-amber-500 inline" /></span> 
                  Teddy Bears: $5 in monetary value
                </li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Once purchased, you can gift these items to other members. When received, they'll add to that member's popularity and monetization potential.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <GiftInventory />
          </TabsContent>
          
          <TabsContent value="transactions">
            <GiftTransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
      
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Processing your purchase...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
