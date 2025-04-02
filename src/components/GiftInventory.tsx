
import React from 'react';
import { useGifts } from '@/hooks/useGifts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GiftInventory = () => {
  const { inventory, updateInventory } = useGifts();
  
  React.useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const renderGiftCount = (type: 'rose' | 'heart' | 'teddy', icon: string) => {
    const count = typeof inventory[type] === 'object' 
      ? (inventory[type] as any)?.count || 0 
      : inventory[type] || 0;
      
    const value = typeof inventory[type] === 'object'
      ? (inventory[type] as any)?.value || 0
      : 0;
      
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <p className="font-medium capitalize">{type}</p>
            {value > 0 && (
              <Badge variant="outline" className="mt-1 text-xs">
                Value: ${value}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold">{count}</div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Gift Inventory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderGiftCount('rose', '🌹')}
        {renderGiftCount('heart', '❤️')}
        {renderGiftCount('teddy', '🧸')}
      </CardContent>
    </Card>
  );
};

export default GiftInventory;
