
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Sidebar = ({ className, children, ...props }: SidebarProps) => {
  const { theme } = useTheme();
  
  return (
    <aside 
      className={cn(
        "flex flex-col h-full border-r border-border",
        theme === 'dark' 
          ? "bg-background/95 backdrop-blur-sm" 
          : "bg-background",
        "w-64 px-3 py-4",
        className
      )} 
      {...props}
    >
      {children}
    </aside>
  );
};

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, className, children, ...props }: SidebarSectionProps) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">{title}</h3>
      )}
      {children}
    </div>
  );
};

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const SidebarItem = ({ active, icon, className, children, ...props }: SidebarItemProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
        active 
          ? theme === 'dark'
            ? "bg-accent/80 text-accent-foreground font-medium"
            : "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  );
};

Sidebar.Section = SidebarSection;
Sidebar.Item = SidebarItem;

export { Sidebar };
