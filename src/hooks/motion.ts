import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

/**
 * True while the user has asked the system for less motion (iOS/Android
 * "Reduce motion", or prefers-reduced-motion on web). Components skip their
 * animations then; state changes still show, just without the transition.
 */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    let active = true
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value)
      })
      .catch(() => {})
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      if (active) setReduced(value)
    })
    return () => {
      active = false
      subscription.remove()
    }
  }, [])

  return reduced
}
