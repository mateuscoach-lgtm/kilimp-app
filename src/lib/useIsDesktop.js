import { useState, useEffect } from 'react'

// Hook simples que diz se a tela é "grande" (computador/tablet) ou não.
// Breakpoint em 768px: abaixo disso é tratado como celular, igual já era.
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
