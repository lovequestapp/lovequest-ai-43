
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { 
    adminResponsive?: boolean;
    fullWidth?: boolean;
    glassMorphism?: boolean;
    bordered?: boolean;
    elevated?: boolean;
    luxury?: boolean;
  }
>(({ className, adminResponsive = false, fullWidth = false, glassMorphism = false, bordered = false, elevated = false, luxury = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <div className={cn(
      "relative w-full overflow-auto rounded-lg border bg-card", 
      isMobile ? "overflow-x-auto max-w-full" : "",
      glassMorphism && "backdrop-blur-sm bg-white/80 shadow-sm",
      bordered && "border-love-200",
      elevated && "shadow-md hover:shadow-lg transition-shadow duration-300",
      luxury && "luxury-table",
      adminResponsive && isMobile ? "admin-horizontal-scroll shadow-sm max-w-full" : "",
      fullWidth && "w-full"
    )}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm", 
          adminResponsive && isMobile ? "admin-mobile-table" : "",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    highlighted?: boolean;
    luxury?: boolean;
  }
>(({ className, highlighted = false, luxury = false, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "[&_tr]:border-b bg-muted/50",
      highlighted && "bg-love-50/70",
      luxury && "text-love-800 [&_tr]:border-love-100",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    fullWidth?: boolean;
    animated?: boolean;
    luxury?: boolean;
  }
>(({ className, fullWidth = false, animated = false, luxury = false, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0", 
      fullWidth && "w-full",
      animated && "[&_tr]:animate-fade-in [&_tr]:duration-300",
      luxury && "[&_tr]:border-love-100/50 [&_tr]:hover:bg-love-50/30",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    highlighted?: boolean;
    luxury?: boolean;
  }
>(({ className, highlighted = false, luxury = false, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      highlighted && "bg-love-50/70",
      luxury && "border-love-100 text-love-700",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { 
    adminResponsive?: boolean;
    clickable?: boolean;
    fullWidth?: boolean;
    highlighted?: boolean;
    luxury?: boolean;
  }
>(({ className, adminResponsive = false, clickable = false, fullWidth = false, highlighted = false, luxury = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <tr
      ref={ref}
      className={cn(
        "transition-colors data-[state=selected]:bg-muted",
        adminResponsive && isMobile 
          ? "block sm:table-row border-b rounded-lg mb-2 sm:mb-0 sm:rounded-none bg-card even:bg-muted/30 max-w-full" 
          : "border-b hover:bg-muted/50",
        clickable ? "cursor-pointer active:bg-muted" : "",
        highlighted && "bg-love-50/50 hover:bg-love-50/80",
        luxury && "border-love-100/50 hover:bg-love-50/30 transition-colors duration-300",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { 
    adminResponsive?: boolean;
    hideOnMobile?: boolean;
    fullWidth?: boolean;
    gradient?: boolean;
    luxury?: boolean;
  }
>(({ className, adminResponsive = false, hideOnMobile = false, fullWidth = false, gradient = false, luxury = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        (isMobile && adminResponsive) ? "hidden sm:table-cell" : "",
        (isMobile && hideOnMobile) ? "hidden sm:table-cell" : "",
        gradient && "bg-gradient-love text-transparent bg-clip-text font-semibold",
        luxury && "uppercase text-xs tracking-wider font-semibold text-love-700 px-4 py-3",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    mobileLabel?: string;
    adminResponsive?: boolean;
    hideOnMobile?: boolean;
    highlightInMobile?: boolean;
    fullWidth?: boolean;
    emphasized?: boolean;
    luxury?: boolean;
  }
>(({ className, mobileLabel, adminResponsive = false, hideOnMobile = false, highlightInMobile = false, fullWidth = false, emphasized = false, luxury = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <td
      ref={ref}
      className={cn(
        "p-3 align-middle [&:has([role=checkbox])]:pr-0",
        (isMobile && mobileLabel && adminResponsive) ? 
          "block w-full sm:table-cell before:content-[attr(data-label)] before:font-medium before:text-xs before:uppercase before:text-primary/70 before:sm:hidden before:inline-block before:mb-1 before:w-full truncate-text" : 
          (isMobile && mobileLabel) ? "block w-full sm:table-cell before:content-[attr(data-label)] before:font-medium before:mr-2 before:inline-block sm:before:hidden truncate-text" : "",
        (isMobile && hideOnMobile) ? "hidden sm:table-cell" : "",
        (isMobile && highlightInMobile) ? "font-medium text-foreground" : "",
        emphasized && "font-medium text-love-700",
        luxury && "px-4 py-3 text-love-800",
        fullWidth && "w-full",
        className
      )}
      data-label={mobileLabel}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement> & {
    elegant?: boolean;
    luxury?: boolean;
  }
>(({ className, elegant = false, luxury = false, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-muted-foreground",
      elegant && "font-display italic text-love-600/70",
      luxury && "font-medium text-love-600 text-xs tracking-wide",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
