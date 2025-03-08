
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Gift, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';

interface GiftItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

const GiftShop: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'rose': 0,
    'heart': 0,
    'teddy': 0
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const { toast } = useToast();
  const { purchaseGifts } = useUser();

  const giftItems: GiftItem[] = [
    { 
      id: 'rose', 
      name: 'Virtual Rose', 
      price: 20, 
      icon: <Heart className="text-rose-500" />,
      description: 'Send a beautiful rose to show your affection'
    },
    { 
      id: 'heart', 
      name: 'Virtual Heart', 
      price: 100, 
      icon: <Heart className="text-red-500 fill-red-500" />,
      description: 'Express your feelings with a premium heart'
    },
    { 
      id: 'teddy', 
      name: 'Virtual Teddy Bear', 
      price: 50, 
      icon: <Gift className="text-amber-700" />,
      description: 'A cute teddy bear to make them smile'
    },
  ];

  const updateQuantity = (id: string, value: number) => {
    if (value >= 0) {
      setQuantities(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const getTotal = () => {
    return giftItems.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 0));
    }, 0);
  };

  const handleCheckout = () => {
    // In a real app, this would connect to a payment processor
    if (getTotal() <= 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one gift to your cart",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingOut(true);
  };

  const handlePayment = () => {
    // Validate card details
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      toast({
        title: "Incomplete payment details",
        description: "Please fill in all payment information",
        variant: "destructive"
      });
      return;
    }

    // Process purchase
    const purchasedGifts: Record<string, number> = {};
    Object.keys(quantities).forEach(key => {
      if (quantities[key] > 0) {
        purchasedGifts[key] = quantities[key];
      }
    });

    // Call the purchaseGifts function from UserContext
    purchaseGifts(purchasedGifts);

    // Show success message
    toast({
      title: "Purchase successful!",
      description: `You purchased virtual gifts for $${getTotal()}`,
    });

    // Reset form
    setQuantities({ 'rose': 0, 'heart': 0, 'teddy': 0 });
    setIsCheckingOut(false);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvc('');
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-love-500" />
          Gift Shop
        </h3>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isCheckingOut ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {giftItems.map((item) => (
                <Card key={item.id} className="border-love-100">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2 flex justify-center">{item.icon}</div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-love-700 font-semibold">${item.price}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 0) - 1)}
                        disabled={!quantities[item.id]}
                      >-</Button>
                      
                      <Input 
                        className="w-16 text-center" 
                        value={quantities[item.id] || 0}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        min="0"
                      />
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 0) + 1)}
                      >+</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Total Items: {Object.values(quantities).reduce((a, b) => a + b, 0)}</p>
                <p className="font-medium">Total: ${getTotal()}</p>
              </div>
              
              <Button 
                className="bg-gradient-love hover:opacity-90"
                onClick={handleCheckout}
                disabled={getTotal() <= 0}
              >
                Checkout
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium">Payment Details</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number" 
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input 
                  id="card-name" 
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card-expiry">Expiry Date</Label>
                  <Input 
                    id="card-expiry" 
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input 
                    id="card-cvc" 
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="font-medium mb-4">Order Summary</p>
              {giftItems.map((item) => {
                if (quantities[item.id] > 0) {
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{quantities[item.id]}</span>
                      <span>${item.price * quantities[item.id]}</span>
                    </div>
                  );
                }
                return null;
              })}
              <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                <span>Total</span>
                <span>${getTotal()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {isCheckingOut && (
          <>
            <Button variant="outline" onClick={() => setIsCheckingOut(false)}>
              Back
            </Button>
            <Button className="bg-gradient-love hover:opacity-90" onClick={handlePayment}>
              Complete Purchase
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default GiftShop;
