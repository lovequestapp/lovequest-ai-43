
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, RotateCw, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface SwipeableCardProps {
  name: string;
  age: number;
  bio: string;
  image: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onUndo: () => void;
  onShowDetails: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  name,
  age,
  bio,
  image,
  onSwipeRight,
  onSwipeLeft,
  onUndo,
  onShowDetails
}) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [springs, api] = useSpring(() => ({
    x: 0,
    scale: 1,
    rotateZ: 0,
    config: { friction: 50, tension: 600 }
  }));

  const bind = useDrag(({ active, offset: [ox] }) => {
    api.start({
      x: ox,
      scale: active ? 1.1 : 1,
      rotateZ: ox / 30,
      config: { friction: 50, tension: active ? 800 : 500 }
    });
  });

  const swipeRight = () => {
    if (isSwiped) return;
    setIsSwiped(true);
    api.start({
      x: 1000,
      rotateZ: 30,
      scale: 0,
      immediate: false,
      config: { friction: 30, tension: 400 },
      onRest: () => {
        setIsSwiped(false);
        api.start({
          x: 0,
          scale: 1,
          rotateZ: 0
        });
        onSwipeRight();
      }
    });
  };

  const swipeLeft = () => {
    if (isSwiped) return;
    setIsSwiped(true);
    api.start({
      x: -1000,
      rotateZ: -30,
      scale: 0,
      immediate: false,
      config: { friction: 30, tension: 400 },
      onRest: () => {
        setIsSwiped(false);
        api.start({
          x: 0,
          scale: 1,
          rotateZ: 0
        });
        onSwipeLeft();
      }
    });
  };

  const undoSwipe = () => {
    api.start({
      x: 0,
      scale: 1,
      rotateZ: 0,
      immediate: false,
      config: { friction: 50, tension: 500 },
      onRest: () => {
        onUndo();
      }
    });
  };

  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        swipeRight();
      } else if (event.key === 'ArrowLeft') {
        swipeLeft();
      } else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
        undoSwipe();
      }
    };

    window.addEventListener('keydown', keyPressHandler);

    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  }, [onSwipeLeft, onSwipeRight, onUndo, swipeLeft, swipeRight, undoSwipe]);

  return (
    <animated.div
      ref={cardRef}
      {...bind()}
      style={{
        ...springs,
        zIndex: 10,
        touchAction: 'pan-y',
      }}
      className="relative w-full max-w-md h-[600px] rounded-xl shadow-lg overflow-hidden bg-white"
    >
      <Card className="absolute inset-0">
        <div className="relative h-3/4">
          <img
            src={image}
            alt={`${name}'s profile`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex flex-col justify-between h-1/4">
          <div>
            <h2 className="text-2xl font-semibold">{name}, {age}</h2>
            <p className="text-gray-600">{bio}</p>
          </div>
          <div className="flex justify-around mt-4">
            <Button variant="destructive" onClick={swipeLeft}>
              <X className="h-5 w-5 mr-2" />
              Decline
            </Button>
            <Button variant="secondary" onClick={onShowDetails}>
              <Info className="h-5 w-5 mr-2" />
              Details
            </Button>
            <Button onClick={swipeRight}>
              <Heart className="h-5 w-5 mr-2" />
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </animated.div>
  );
};

export default SwipeableCard;
