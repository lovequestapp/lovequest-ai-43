
import React from 'react';
import Checkout from '@/components/checkout/Checkout';

const CheckoutPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <Checkout />
    </div>
  );
};

export default CheckoutPage;
