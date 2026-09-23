import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Animates a number towards `target` (used for the balance card so the amount
 * "counts up" instead of snapping). Respects prefers-reduced-motion.
 */
export function useCountUp(target, { duration = 750 } = {}) {
  const numericTarget = Number.isFinite(Number(target)) ? Number(target) : 0
  const [displayValue, setDisplayValue] = useState(numericTarget)
  const currentRef = useRef(numericTarget)
  const frameRef = useRef(0)

  useEffect(() => {
    const from = currentRef.current
    const to = numericTarget

    if (from === to || prefersReducedMotion()) {
      currentRef.current = to
      setDisplayValue(to)
      return undefined
    }

    const startedAt = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const next = from + (to - from) * eased

      currentRef.current = next
      setDisplayValue(next)

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick)
      } else {
        currentRef.current = to
        setDisplayValue(to)
      }
    }

    frameRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameRef.current)
  }, [numericTarget, duration])

  return displayValue
}
