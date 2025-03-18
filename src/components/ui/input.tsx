
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isValid?: boolean;
  isInvalid?: boolean;
  /* Adds an animated hover effect to the input */
  animated?: boolean;
  /* Makes the input circular when true */
  circular?: boolean;
  /* Makes the input larger for admin forms */
  large?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    icon, 
    iconPosition = 'left', 
    isValid, 
    isInvalid, 
    animated = false,
    circular = false,
    large = false,
    ...props 
  }, ref) => {
    const [focused, setFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative group", 
        animated && "transition-all duration-300",
        large && "w-full"
      )}>
        {icon && iconPosition === 'left' && (
          <div className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
            focused ? "text-love-500" : "text-muted-foreground",
            animated && "group-hover:text-love-400",
            large && "left-4 text-lg"
          )}>
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 md:text-sm",
            iconPosition === 'left' && icon ? "pl-10" : "",
            iconPosition === 'right' && icon ? "pr-10" : "",
            isValid && "border-green-500 focus-visible:ring-green-500/20",
            isInvalid && "border-red-500 focus-visible:ring-red-500/20",
            animated && "input-highlight hover:border-love-200",
            circular && "rounded-full aspect-square w-10 p-0 flex items-center justify-center text-center",
            large && "h-12 px-4 py-3 text-base md:text-base rounded-lg",
            large && iconPosition === 'left' && icon ? "pl-12" : "",
            large && iconPosition === 'right' && icon ? "pr-12" : "",
            className
          )}
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
            focused ? "text-love-500" : "text-muted-foreground",
            animated && "group-hover:text-love-400",
            large && "right-4 text-lg"
          )}>
            {icon}
          </div>
        )}
        {isValid && (
          <div className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-green-500",
            large && "right-4"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
