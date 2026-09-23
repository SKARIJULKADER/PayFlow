import { useEffect } from 'react'

/** Closes menus/dialogs on outside click, Escape and route-level unmounts. */
export function useOnClickOutside(ref, handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined

    const handlePointerDown = (event) => {
      const element = ref.current
      if (!element || element.contains(event.target)) return
      handler(event)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handler(event)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, handler, enabled])
}
