
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, CreditCard, ShoppingCart, Heart, Package, Award } from 'lucide-react';

interface GiftItem {
  id: string;
  type: 'rose' | 'heart' | 'teddy';
  name: string;
  icon: string;
  price: number;
  description: string;
  discount?: number;
}

const giftItems: GiftItem[] = [
  {
    id: 'rose',
    type: 'rose',
    name: 'Rose',
    icon: '🌹',
    price: 5,
    description: 'A beautiful rose to show your interest',
  },
  {
    id: 'heart',
    type: 'heart',
    name: 'Heart',
    icon: '❤️',
    price: 10,
    description: 'A heart to express your affection',
    discount: 15,
  },
  {
    id: 'teddy',
    type: 'teddy',
    name: 'Teddy Bear',
    icon: '🧸',
    price: 20,
    description: 'A cute teddy bear to win their heart',
  },
];

const GiftShop: React.FC = () => {
  const { currentUser, purchaseGift } = useUser();
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  
  if (!currentUser) return null;
  
  const handlePurchase = async () => {
    if (!selectedGift) return;
    
    try {
      // Call the purchaseGift function with the gift type
      const success = await purchaseGift(selectedGift.type);
      
      if (success) {
        toast.success(`You purchased a ${selectedGift.name}!`);
        setPurchaseDialogOpen(false);
      } else {
        toast.error('Purchase failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during purchase.');
      console.error('Purchase error:', error);
    }
  };
  
  const calculateInventory = (type: 'rose' | 'heart' | 'teddy'): number => {
    return currentUser.giftInventory?.[type] || 0;
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="text-love-500" />
          <span>Gift Shop</span>
        </h1>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={16} />
          <span>My Inventory</span>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="available" className="flex-1">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Available Gifts
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1">
            <Package className="mr-2 h-4 w-4" />
            My Inventory
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">
            <Award className="mr-2 h-4 w-4" />
            Most Popular
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {giftItems.map((gift) => (
              <Card key={gift.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="text-6xl mb-4">{gift.icon}</div>
                    <h3 className="text-xl font-semibold mb-1">{gift.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 text-center">
                      {gift.description}
                    </p>
                    
                    <div className="flex items-center mb-4">
                      {gift.discount ? (
                        <>
                          <span className="text-lg font-bold">${(gift.price * (1 - gift.discount / 100)).toFixed(2)}</span>
                          <span className="text-muted-foreground line-through ml-2">${gift.price.toFixed(2)}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">Save {gift.discount}%</Badge>
                        </>
                      ) : (
                        <span className="text-lg font-bold">${gift.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-love hover:opacity-90"
                      onClick={() => {
                        setSelectedGift(gift);
                        setPurchaseDialogOpen(true);
                      }}
                    >
                      Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Gift Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {giftItems.map((gift) => (
                  <div key={gift.id} className="flex flex-col items-center p-4 border rounded-lg">
                    <div className="text-4xl mb-3">{gift.icon}</div>
                    <h3 className="font-medium">{gift.name}</h3>
                    <span className="text-2xl font-bold mt-2">{calculateInventory(gift.type)}</span>
                    <span className="text-sm text-muted-foreground">available</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Send gifts to profiles you're interested in to stand out from the crowd!
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('available')}
                >
                  Get More Gifts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Popular Gifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">❤️</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Heart</h3>
                    <p className="text-sm text-muted-foreground">Most popular gift this month</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => {
                      const heartGift = giftItems.find(g => g.id === 'heart');
                      if (heartGift) {
                        setSelectedGift(heartGift);
                        setPurchaseDialogOpen(true);
                      }
                    }}
                  >
                    Buy
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🌹</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Rose</h3>
                    <p className="text-sm text-muted-foreground">Classic choice for showing interest</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => {
                      const roseGift = giftItems.find(g => g.id === 'rose');
                      if (roseGift) {
                        setSelectedGift(roseGift);
                        setPurchaseDialogOpen(true);
                      }
                    }}
                  >
                    Buy
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🧸</div>
                  <div className="flex-1">
                    <h3 className="font-medium">Teddy Bear</h3>
                    <p className="text-sm text-muted-foreground">Premium gift with highest response rate</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => {
                      const teddyGift = giftItems.find(g => g.id === 'teddy');
                      if (teddyGift) {
                        setSelectedGift(teddyGift);
                        setPurchaseDialogOpen(true);
                      }
                    }}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          
          {selectedGift && (
            <div className="flex flex-col items-center p-4">
              <div className="text-6xl mb-4">{selectedGift.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{selectedGift.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 text-center">
                {selectedGift.description}
              </p>
              
              <div className="flex items-center mb-6">
                {selectedGift.discount ? (
                  <>
                    <span className="text-2xl font-bold">
                      ${(selectedGift.price * (1 - selectedGift.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground line-through ml-2">
                      ${selectedGift.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${selectedGift.price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  This gift will be added to your inventory and you can send it to anyone you're interested in.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} className="bg-gradient-love">
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftShop;
