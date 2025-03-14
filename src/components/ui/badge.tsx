
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
        warning: 
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
        info: 
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
        love: 
          "border-transparent bg-love-100 text-love-800 hover:bg-love-200 border-love-200",
        passion: 
          "border-transparent bg-passion-100 text-passion-800 hover:bg-passion-200 border-passion-200",
        gradient: 
          "border-transparent bg-gradient-love text-white hover:opacity-90",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      animation: {
        none: "",
        glow: "animate-glow",
        fade: "animate-fade-in",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  size?: "default" | "sm" | "lg";
  animation?: "none" | "glow" | "fade";
}

function Badge({ 
  className, 
  variant, 
  size, 
  animation = "none", 
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, animation }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
