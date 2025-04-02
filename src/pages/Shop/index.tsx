
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useGifts } from '@/hooks/useGifts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Coffee, Package, Gift, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import GiftInventory from '@/components/GiftInventory';
import GiftTransactionHistory from '@/components/GiftTransactionHistory';

const ShopPage = () => {
  const { currentUser } = useUser();
  const { inventory, purchaseGifts, isProcessing } = useGifts();
  const [quantities, setQuantities] = useState({
    rose: 1,
    heart: 1,
    teddy: 1
  });
  const navigate = useNavigate();

  const prices = {
    rose: 4.99,
    heart: 9.99,
    teddy: 14.99
  };

  const monetaryValues = {
    rose: 1,
    heart: 3,
    teddy: 5
  };

  const handleQuantityChange = (type: 'rose' | 'heart' | 'teddy', value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) return;
    
    setQuantities(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handlePurchase = async (type: 'rose' | 'heart' | 'teddy') => {
    if (isProcessing) return;
    
    try {
      const quantity = quantities[type];
      const success = await purchaseGifts(type, quantity);
      
      if (success) {
        toast.success(`Successfully purchased ${quantity} ${type}${quantity > 1 ? 's' : ''}!`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
              <CardDescription className="text-center">
                You need to be logged in to access the shop
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-love-500" />
            Gift Shop
          </h1>
          <p className="text-muted-foreground mt-2">
            Purchase gifts to send to other users and make their day special!
          </p>
        </div>

        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="inventory">Your Inventory</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shop" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rose Gift Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🌹</span> Rose
                  </CardTitle>
                  <CardDescription>
                    A beautiful rose to express your admiration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 text-sm px-2.5 py-0.5">
                        Value: ${monetaryValues.rose}
                      </Badge>
                      <p className="text-xl font-bold text-love-600">${prices.rose}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={quantities.rose}
                          onChange={(e) => handleQuantityChange('rose', e.target.value)}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Total: ${(prices.rose * quantities.rose).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handlePurchase('rose')} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>

              {/* Heart Gift Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span> Heart
                  </CardTitle>
                  <CardDescription>
                    Show your feelings with a beautiful heart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-purple-50 text-purple-800 text-sm px-2.5 py-0.5">
                        Value: ${monetaryValues.heart}
                      </Badge>
                      <p className="text-xl font-bold text-love-600">${prices.heart}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={quantities.heart}
                          onChange={(e) => handleQuantityChange('heart', e.target.value)}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Total: ${(prices.heart * quantities.heart).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handlePurchase('heart')} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>

              {/* Teddy Gift Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🧸</span> Teddy Bear
                  </CardTitle>
                  <CardDescription>
                    A cuddly teddy bear to show your affection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 text-sm px-2.5 py-0.5">
                        Value: ${monetaryValues.teddy}
                      </Badge>
                      <p className="text-xl font-bold text-love-600">${prices.teddy}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={quantities.teddy}
                          onChange={(e) => handleQuantityChange('teddy', e.target.value)}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Total: ${(prices.teddy * quantities.teddy).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handlePurchase('teddy')} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">About Our Gifts</h3>
                    <p className="text-sm text-muted-foreground">
                      These gifts can be sent to other users to show your appreciation. Each gift has a monetary value
                      that the recipient can convert to account credit. Gifts are a great way to support your favorite
                      users on the platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <GiftInventory />
          </TabsContent>
          
          <TabsContent value="history">
            <GiftTransactionHistory />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
