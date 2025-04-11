
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Diamond, Flower, CreditCard, Trash2, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Payment form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  if (cartItems.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Your Cart is Empty</CardTitle>
          <CardDescription>
            Add some gifts to your cart before checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any gifts to your cart yet.
          </p>
          <Button onClick={() => navigate('/shop')}>
            Browse Gifts
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would integrate with Stripe or another payment processor
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Payment successful!', {
        description: 'Your gifts have been added to your inventory.',
      });
      
      clearCart();
      navigate('/user-profile?tab=shop');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: 'There was an error processing your payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Review your cart and complete your purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Your Cart</h3>
                <div className="space-y-4 divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pt-4 first:pt-0">
                      <div className="h-12 w-12 bg-love-50 rounded-lg flex items-center justify-center">
                        {item.type === 'rose' && <Flower className="h-6 w-6 text-red-500" />}
                        {item.type === 'heart' && <Heart className="h-6 w-6 text-love-500" />}
                        {item.type === 'teddy' && <Diamond className="h-6 w-6 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                            {item.recipientName && (
                              <span className="ml-2 text-love-600">
                                For: {item.recipientName}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-md">
                              <button 
                                type="button"
                                className="px-2 py-1 text-sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="px-2 py-1 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button 
                                type="button"
                                className="px-2 py-1 text-sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-muted-foreground p-0 h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                
                <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="saved">Saved Cards</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name on Card</Label>
                          <Input 
                            id="name" 
                            placeholder="John Smith" 
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="number">Card Number</Label>
                          <Input 
                            id="number" 
                            placeholder="1234 5678 9012 3456" 
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input 
                              id="cvc" 
                              placeholder="123" 
                              required
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="save-card" 
                            className="rounded" 
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                          />
                          <Label htmlFor="save-card">Save this card for future purchases</Label>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>Processing...</>
                        ) : (
                          <>
                            Pay ${cartTotal.toFixed(2)}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <div className="space-y-4">
                      <RadioGroup defaultValue="card-1">
                        <div className="flex items-center space-x-2 border rounded-lg p-3">
                          <RadioGroupItem value="card-1" id="card-1" />
                          <Label htmlFor="card-1" className="flex flex-1 items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">Visa ending in 4242</div>
                              <div className="text-sm text-muted-foreground">Expires 05/25</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      <Button type="button" className="w-full" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                          <>Processing...</>
                        ) : (
                          <>
                            Pay ${cartTotal.toFixed(2)}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span>${(0.99).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(cartTotal + (cartTotal * 0.08) + 0.99).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
