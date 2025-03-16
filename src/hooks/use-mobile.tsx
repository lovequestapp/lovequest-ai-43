
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Create event listener for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

// Additional breakpoints for more precise responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<string>('sm')

  React.useEffect(() => {
    const handleResize = () => {
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
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}
