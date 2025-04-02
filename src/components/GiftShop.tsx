
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Gift, Diamond, Flower } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import LoadingIndicator from './ui/loading-indicator';

interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'rose' | 'heart' | 'teddy';
}

const GIFT_ITEMS: GiftItem[] = [
  {
    id: 'gift-rose',
    name: 'Rose',
    description: 'Send a beautiful rose to show your interest.',
    price: 50,
    image: '/gifts/rose.svg',
    type: 'rose'
  },
  {
    id: 'gift-heart',
    name: 'Heart',
    description: 'Express your feelings with a lovely heart.',
    price: 100,
    image: '/gifts/heart.svg',
    type: 'heart'
  },
  {
    id: 'gift-teddy',
    name: 'Teddy Bear',
    description: 'Make them smile with an adorable teddy bear.',
    price: 200,
    image: '/gifts/teddy.svg',
    type: 'teddy'
  }
];

const GiftShop: React.FC = () => {
  const { currentUser, purchaseGifts } = useUser();
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchase = async () => {
    if (!selectedGift) return;
    
    try {
      setIsProcessing(true);
      // Call the purchaseGifts function with the gift type and quantity
      const success = await purchaseGifts(selectedGift.type, 1);
      
      if (success) {
        toast.success(`You purchased a ${selectedGift.name}!`);
        setPurchaseDialogOpen(false);
      } else {
        toast.error("Failed to complete purchase");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An error occurred during purchase");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-love-500" />
          <span>Gift Shop</span>
        </CardTitle>
        <CardDescription>
          Purchase gifts to send to other users and show your interest
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="available">Available Gifts</TabsTrigger>
            <TabsTrigger value="inventory">My Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GIFT_ITEMS.map((gift) => (
                <Card key={gift.id} className="overflow-hidden">
                  <div className="aspect-square bg-love-50 flex items-center justify-center p-6">
                    {gift.type === 'rose' && <Flower className="h-16 w-16 text-red-500" />}
                    {gift.type === 'heart' && <Heart className="h-16 w-16 text-love-500" />}
                    {gift.type === 'teddy' && <Diamond className="h-16 w-16 text-amber-500" />}
                  </div>
                  
                  <CardContent className="p-4">
                    <CardTitle className="text-lg">{gift.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {gift.description}
                    </CardDescription>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm font-semibold text-love-700">
                        {gift.price} coins
                      </div>
                      <Button 
                        size="sm" 
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
          
          <TabsContent value="inventory" className="min-h-[200px]">
            {currentUser?.giftInventory ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(currentUser.giftInventory).map(([type, count]) => {
                    const giftItem = GIFT_ITEMS.find(g => g.type === type);
                    if (!giftItem || count === 0) return null;
                    
                    return (
                      <Card key={`inventory-${type}`} className="overflow-hidden">
                        <div className="aspect-square bg-love-50 flex items-center justify-center p-6">
                          {type === 'rose' && <Flower className="h-16 w-16 text-red-500" />}
                          {type === 'heart' && <Heart className="h-16 w-16 text-love-500" />}
                          {type === 'teddy' && <Diamond className="h-16 w-16 text-amber-500" />}
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{giftItem.name}</CardTitle>
                            <span className="text-lg font-bold">{count}x</span>
                          </div>
                          <CardDescription className="mt-1">
                            {giftItem.description}
                          </CardDescription>
                          <div className="mt-4">
                            <Button size="sm" className="w-full">
                              Send Gift
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {Object.values(currentUser.giftInventory).every(count => count === 0) && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">
                        You don't have any gifts in your inventory yet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab('available')}
                      >
                        Purchase Gifts
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <LoadingIndicator />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Gift</DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase this gift?
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="flex items-center gap-4 py-4">
              <div className="h-16 w-16 bg-love-50 rounded-lg flex items-center justify-center">
                {selectedGift.type === 'rose' && <Flower className="h-8 w-8 text-red-500" />}
                {selectedGift.type === 'heart' && <Heart className="h-8 w-8 text-love-500" />}
                {selectedGift.type === 'teddy' && <Diamond className="h-8 w-8 text-amber-500" />}
              </div>
              <div>
                <h4 className="font-semibold">{selectedGift.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedGift.price} coins</p>
              </div>
            </div>
          )}
          
          <RadioGroup defaultValue="1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="qty-1" />
              <Label htmlFor="qty-1">1 gift</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="qty-3" />
              <Label htmlFor="qty-3">3 gifts (5% discount)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="qty-5" />
              <Label htmlFor="qty-5">5 gifts (10% discount)</Label>
            </div>
          </RadioGroup>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <LoadingIndicator size="sm" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                'Confirm Purchase'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GiftShop;
