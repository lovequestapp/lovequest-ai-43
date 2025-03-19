
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { 
    adminResponsive?: boolean;
    fullWidth?: boolean;
  }
>(({ className, adminResponsive = false, fullWidth = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <div className={cn(
      "relative w-full overflow-auto rounded-lg border bg-card", 
      isMobile ? "overflow-x-auto max-w-full" : "",
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
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b bg-muted/50", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    fullWidth?: boolean;
  }
>(({ className, fullWidth = false, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0", 
      fullWidth && "w-full",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
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
  }
>(({ className, adminResponsive = false, clickable = false, fullWidth = false, ...props }, ref) => {
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
  }
>(({ className, adminResponsive = false, hideOnMobile = false, fullWidth = false, ...props }, ref) => {
  const isMobile = useIsMobile()
  
  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        (isMobile && adminResponsive) ? "hidden sm:table-cell" : "",
        (isMobile && hideOnMobile) ? "hidden sm:table-cell" : "",
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
  }
>(({ className, mobileLabel, adminResponsive = false, hideOnMobile = false, highlightInMobile = false, fullWidth = false, ...props }, ref) => {
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
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
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
