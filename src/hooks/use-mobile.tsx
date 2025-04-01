
"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window exists (for SSR)
    if (typeof window === 'undefined') return;
    
    // Set initial value based on window width
    const checkMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(checkMobile())
    
    // Debounced resize handler to prevent excessive re-renders
    let resizeTimer: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(checkMobile());
      }, 100);
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  return isMobile
}

// Additional breakpoints for more precise responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string>('sm')

  React.useEffect(() => {
    // Check if window exists (for SSR)
    if (typeof window === 'undefined') return;
    
    // Create debounced event handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth
        
        if (width < 640) {
          setBreakpoint('xs')
        } else if (width < 768) {
          setBreakpoint('sm')
        } else if (width < 1024) {
          setBreakpoint('md')
        } else if (width < 1280) {
          setBreakpoint('lg')
        } else {
          setBreakpoint('xl')
        }
      }, 100);
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return breakpoint
}

// Admin layout management hook
export function useAdminLayout() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  
  React.useEffect(() => {
    // Close sidebar by default on mobile
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])
  
  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])
  
  return {
    isMobile,
    sidebarOpen,
    toggleSidebar
  }
}
