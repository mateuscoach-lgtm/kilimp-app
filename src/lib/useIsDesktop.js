import { useState, useEffect } from 'react'

export function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoint : false
  )

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= breakpoint)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isDesktop
}
