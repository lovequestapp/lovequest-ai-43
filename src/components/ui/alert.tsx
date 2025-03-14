
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-all duration-300 animate-scale-in",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: 
          "border-green-500/30 bg-green-50 text-green-800 [&>svg]:text-green-500",
        warning: 
          "border-amber-500/30 bg-amber-50 text-amber-800 [&>svg]:text-amber-500",
        info: 
          "border-blue-500/30 bg-blue-50 text-blue-800 [&>svg]:text-blue-500",
        love: 
          "border-love-300/50 bg-love-50 text-love-800 [&>svg]:text-love-500",
      },
      animation: {
        none: "",
        slide: "animate-slide-up-fade",
        bounce: "animate-soft-bounce",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "slide",
    },
  }
)

interface AlertProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  animation?: "none" | "slide" | "bounce";
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ className, variant, animation, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, animation }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
