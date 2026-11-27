import { createContext, useContext, useEffect, useState, type Context } from 'react'
import { Animated } from 'react-native'

export type SkeletonState = {
  /** True inside `<Skeleton loading>`: components draw their placeholder. */
  loading: boolean
  /** iOS and Android: the pulse every placeholder shares, or null when there is none. */
  pulse: Animated.Value | null
}

export const SkeletonContext: Context<SkeletonState> = createContext<SkeletonState>({ loading: false, pulse: null })

/**
 * True inside `<Skeleton loading>`. Every dazo-ui component already reacts to
 * it; use it to give your own components a placeholder too.
 */
export const useSkeleton = (): boolean => useContext(SkeletonContext).loading

/** One pulse cycle in ms. */
export const PULSE = 1600

/**
 * An opacity that pulses between 1 and 0.5 while `enabled`, or null.
 * iOS and Android only: the web pulses with CSS (react-native-web's Animated
 * needs a `global` that Vite and other bundlers don't define).
 */
export const usePulse = (enabled: boolean): Animated.Value | null => {
  const [value] = useState(() => new Animated.Value(1))

  useEffect(() => {
    if (!enabled) return
    const half = { duration: PULSE / 2, useNativeDriver: true }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 0.5, ...half }),
        Animated.timing(value, { toValue: 1, ...half }),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
      value.setValue(1)
    }
  }, [enabled, value])

  return enabled ? value : null
}
