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
import { 
  Heart, 
  Gift, 
  Diamond, 
  Flower, 
  ShoppingCart,
  Plus,
  Minus,
  User
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { useCart, GiftItem } from '@/context/CartContext';
import LoadingIndicator from './ui/loading-indicator';
import { Badge } from './ui/badge';

export const GIFT_ITEMS = [
  {
    id: 'gift-rose',
    name: 'Rose',
    description: 'Send a beautiful rose to show your interest.',
    price: 4.99,
    image: '/gifts/rose-detailed.png',
    type: 'rose' as const
  },
  {
    id: 'gift-heart',
    name: 'Heart',
    description: 'Express your feelings with a lovely heart.',
    price: 9.99,
    image: '/gifts/crystal-heart.png',
    type: 'heart' as const
  },
  {
    id: 'gift-teddy',
    name: 'Teddy Bear',
    description: 'Make them smile with an adorable teddy bear.',
    price: 14.99,
    image: '/gifts/luxury-teddy.png',
    type: 'teddy' as const
  }
];

interface GiftShopProps {
  recipientId?: string;
  recipientName?: string;
}

const GiftShop: React.FC<GiftShopProps> = ({ recipientId, recipientName }) => {
  const { currentUser, purchaseGifts } = useUser();
  const { addToCart, cartItems, itemCount } = useCart();
  const [selectedGift, setSelectedGift] = useState<typeof GIFT_ITEMS[0] | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = (gift: typeof GIFT_ITEMS[0]) => {
    setSelectedGift(gift);
    setPurchaseDialogOpen(true);
  };
  
  const confirmAddToCart = () => {
    if (!selectedGift) return;
    
    addToCart({
      id: selectedGift.id,
      name: selectedGift.name,
      type: selectedGift.type,
      price: selectedGift.price,
      recipientId,
      recipientName
    }, quantity);
    
    setPurchaseDialogOpen(false);
    setQuantity(1);
  };
  
  const handlePurchase = async () => {
    if (!selectedGift) return;
    
    try {
      setIsProcessing(true);
      const success = await purchaseGifts(selectedGift.type, quantity);
      
      if (success) {
        toast.success(`You purchased ${quantity} ${selectedGift.name}${quantity > 1 ? 's' : ''}!`);
        setPurchaseDialogOpen(false);
      } else {
        toast.error("Failed to complete purchase");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An error occurred during purchase");
    } finally {
      setIsProcessing(false);
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-love-500" />
              <span>Gift Shop</span>
            </CardTitle>
            <CardDescription>
              Purchase gifts to send to other users and show your interest
            </CardDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="relative"
            onClick={() => setCartDialogOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Cart</span>
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="available">Available Gifts</TabsTrigger>
              <TabsTrigger value="inventory">My Inventory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-6">
              <Card>
                <CardContent className="space-y-4">
                  {GIFT_ITEMS.map((gift) => (
                    <div key={gift.id} className="flex items-center gap-4">
                      <img 
                        src={gift.image} 
                        alt={gift.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{gift.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {gift.description}
                        </CardDescription>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm font-semibold text-love-700">
                            ${gift.price.toFixed(2)}
                          </div>
                          <div className="space-x-2">
                            {recipientId ? (
                              <Button 
                                size="sm"
                                onClick={() => handleAddToCart(gift)}
                              >
                                Add to Cart
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePurchase()}
                                >
                                  Buy Now
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleAddToCart(gift)}
                                >
                                  Add to Cart
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory" className="min-h-[200px]">
              {currentUser?.giftInventory ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(currentUser.giftInventory).map(([type, value]) => {
                      const count = typeof value === 'object' ? value.count : value;
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
                              <Button 
                                size="sm" 
                                className="w-full"
                                disabled={!recipientId}
                                onClick={() => {
                                  if (recipientId) {
                                    handleAddToCart(giftItem);
                                  } else {
                                    toast.info("Please select a recipient to send a gift");
                                  }
                                }}
                              >
                                Send Gift
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {Object.values(currentUser.giftInventory).every(value => {
                      const count = typeof value === 'object' ? value.count : value;
                      return count === 0;
                    }) && (
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
      </Card>

      {/* Add to Cart Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gift to Cart</DialogTitle>
            <DialogDescription>
              How many gifts would you like to add?
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="flex items-center gap-4 py-4">
              <div className="h-16 w-16 bg-love-50 rounded-lg flex items-center justify-center">
                {selectedGift.type === 'rose' && <Flower className="h-8 w-8 text-red-500" />}
                {selectedGift.type === 'heart' && <Heart className="h-8 w-8 text-love-500" />}
                {selectedGift.type === 'teddy' && <Diamond className="h-8 w-8 text-amber-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{selectedGift.name}</h4>
                <p className="text-sm text-muted-foreground">${selectedGift.price.toFixed(2)} each</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 py-2">
            <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium text-lg">{quantity}</span>
            <Button variant="outline" size="icon" onClick={incrementQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedGift && (
            <div className="py-2 text-right font-medium">
              Total: ${(selectedGift.price * quantity).toFixed(2)}
            </div>
          )}
          
          {recipientName && (
            <div className="flex items-center gap-2 p-2 bg-love-50 rounded-lg">
              <User className="h-4 w-4 text-love-500" />
              <span>Sending to: {recipientName}</span>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAddToCart}>
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cart Dialog - Just a preview, we'll create a separate Cart component */}
      <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </DialogTitle>
            <DialogDescription>
              Review your items before checkout
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[300px] overflow-auto">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Your cart is empty
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                  <div className="h-10 w-10 bg-love-50 rounded-lg flex items-center justify-center">
                    {item.type === 'rose' && <Flower className="h-5 w-5 text-red-500" />}
                    {item.type === 'heart' && <Heart className="h-5 w-5 text-love-500" />}
                    {item.type === 'teddy' && <Diamond className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.recipientName ? `For: ${item.recipientName}` : 'No recipient specified'}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="py-2 flex justify-between font-medium border-t">
            <span>Total:</span>
            <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCartDialogOpen(false)}>
              Continue Shopping
            </Button>
            <Button 
              onClick={() => {
                setCartDialogOpen(false);
                window.location.href = "/checkout";
              }}
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftShop;
