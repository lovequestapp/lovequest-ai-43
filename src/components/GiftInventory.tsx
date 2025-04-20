
import React from 'react';
import { useGifts } from '@/hooks/useGifts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GiftInventoryProps {
  teddyIcon?: React.ReactNode; // Accept an optional icon for teddy bear gift
}

const GiftInventory: React.FC<GiftInventoryProps> = ({ teddyIcon }) => {
  const { inventory, updateInventory } = useGifts();

  React.useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const renderGiftCount = (type: 'rose' | 'heart' | 'teddy') => {
    const giftItem = inventory[type];
    let count = 0;
    let value = 0;

    if (giftItem) {
      if (typeof giftItem === 'object' && giftItem !== null) {
        count = typeof giftItem.count === 'number' ? giftItem.count : 0;
        value = typeof giftItem.value === 'number' ? giftItem.value : 0;
      } else if (typeof giftItem === 'number') {
        count = giftItem;
        value = 0;
      }
    }

    let icon;
    if (type === 'rose') icon = '🌹';
    else if (type === 'heart') icon = '❤️';
    else if (type === 'teddy') icon = teddyIcon || '🧸';

    return (
      <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl" aria-label={type}>{icon}</div>
          <div>
            <p className="font-medium capitalize">{type}</p>
            {value > 0 && (
              <Badge variant="outline" className="mt-1 text-xs">
                Value: ${value.toFixed(2)}
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
        {renderGiftCount('rose')}
        {renderGiftCount('heart')}
        {renderGiftCount('teddy')}
      </CardContent>
    </Card>
  );
};

export default GiftInventory;

