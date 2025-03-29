
import React, { useState, useRef, useEffect } from 'react';
import { Animated, PanResponder, View, StyleSheet, Dimensions, Image } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * screenWidth;
const SWIPE_OUT_DURATION = 250;

interface SwipeableCardProps {
  data: any[];
  renderCard: (item: any) => React.ReactNode;
  onSwipeRight?: (item: any) => void;
  onSwipeLeft?: (item: any) => void;
  onCardRemoved?: () => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ data, renderCard, onSwipeRight, onSwipeLeft, onCardRemoved }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  
  // Use interpolation instead of directly accessing animated values
  const rotate = position.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  const opacity = position.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Fixed: Use proper API for accessing Animated values
        const currentX = position.x._offset || 0;
        const currentY = position.y._offset || 0;
        
        position.setOffset({
          x: currentX,
          y: currentY
        });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (data.length === 0 && onCardRemoved) {
      onCardRemoved();
    }
  }, [data.length, onCardRemoved]);

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    Animated.timing(position, {
      toValue: { x: x * 2, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = data[cardIndex];
    if (direction === 'right' && onSwipeRight) {
      onSwipeRight(item);
    } else if (direction === 'left' && onSwipeLeft) {
      onSwipeLeft(item);
    }
    position.setValue({ x: 0, y: 0 });
    setCardIndex(cardIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 4,
    }).start();
  };

  const renderCards = () => {
    if (cardIndex >= data.length) {
      return <View style={styles.noMoreCards}><Image source={{uri: 'https://i.imgur.com/t9pQqde.png'}} style={{width: 200, height: 200}} /></View>;
    }

    return data
      .slice(cardIndex, cardIndex + 1)
      .map((item, index) => {
        if (index === 0) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardStyle,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate }
                  ],
                  opacity,
                },
              ]}
              {...panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          );
        }

        return null;
      });
  };

  return (
    <View>
      {renderCards()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: screenWidth - 20,
    marginLeft: 10,
    marginTop: 10,
  },
  noMoreCards: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default SwipeableCard;
