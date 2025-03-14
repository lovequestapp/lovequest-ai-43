
import React from 'react';

type AriaRelevantType = 
  | 'additions' 
  | 'removals' 
  | 'text' 
  | 'all' 
  | 'additions text' 
  | 'additions removals' 
  | 'removals additions' 
  | 'removals text' 
  | 'text additions' 
  | 'text removals';

type ScreenReaderOnlyProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Sets the aria-live attribute to control how assistive technologies should announce updates
   * - 'off': Don't announce updates
   * - 'polite': Announce updates when the user is idle
   * - 'assertive': Announce updates immediately (use sparingly for critical information)
   */
  ariaLive?: 'off' | 'polite' | 'assertive';
  /**
   * Sets the aria-atomic attribute to control whether assistive technologies should present
   * the entire region or just the changed parts
   */
  ariaAtomic?: boolean;
  /**
   * Sets the aria-relevant attribute to specify what types of changes are relevant
   */
  ariaRelevant?: AriaRelevantType;
};

/**
 * A component that visually hides content but keeps it accessible to screen readers.
 * This follows best practices for screen reader accessibility.
 */
const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className = "",
  ariaLive = "polite",
  ariaAtomic = true,
  ariaRelevant = "additions text"
}) => {
  return (
    <span 
      className={`sr-only ${className}`}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-relevant={ariaRelevant}
    >
      {children}
    </span>
  );
};

export default ScreenReaderOnly;
