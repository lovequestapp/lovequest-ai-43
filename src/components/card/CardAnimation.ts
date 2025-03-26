
// Animation constants and utility functions for the swipeable card

// Define the card styles and properties
export const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

export const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// Transform when card is being dragged
export const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

// Helper to convert Vector2 velocity to a number
export const getVelocityValue = (velocity: number | [number, number]): number => {
  return typeof velocity === 'number' 
    ? velocity 
    : Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
};
