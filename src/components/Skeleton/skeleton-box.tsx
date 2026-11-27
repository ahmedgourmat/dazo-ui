import { useContext, type JSX, type ReactNode, type Ref } from 'react'
import { Animated, Platform, StyleSheet, type StyleProp, type View, type ViewStyle } from 'react-native'
import { useReducedMotion } from '../../hooks/motion'
import { useTheme } from '../../providers'
import type { Theme } from '../../styles/theme'
import { PULSE, SkeletonContext, usePulse } from './skeleton.context'

type SkeletonBoxProps = {
  ref?: Ref<View>
  style?: StyleProp<ViewStyle>
  /** Content that only gives the box its size, such as a label in a transparent color. */
  children?: ReactNode
  testID?: string
}

/**
 * The shape every placeholder is drawn with: the component's own layout
 * styles, filled with the skeleton color, pulsing gently. Hidden from screen
 * readers; the `<Skeleton>` around it announces that the content is loading.
 */
export const SkeletonBox = ({ ref, style, children, testID }: SkeletonBoxProps): JSX.Element => {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const shared = useContext(SkeletonContext).pulse
  const web = Platform.OS === 'web'
  // A placeholder outside a <Skeleton> wrapper (or a standalone block) pulses on its own.
  const own = usePulse(!web && !reduceMotion && !shared)
  const pulse = shared ?? own

  return (
    <Animated.View
      ref={ref}
      testID={testID}
      aria-hidden
      style={[
        style,
        // After `style`, so the component's own colors and borders never show through.
        { backgroundColor: skeletonColor(theme), borderColor: 'transparent' },
        !reduceMotion && (web ? styles.pulse : pulse && { opacity: pulse }),
      ]}
    >
      {children}
    </Animated.View>
  )
}

/**
 * The placeholder color: visible against every surface of the mode. In dark
 * mode `border` equals `surfaceMuted` and `surfaceElevated` (#262626), so table
 * headers and menus would hide it; `borderStrong` stands out from all of them.
 */
export const skeletonColor = (theme: Theme): string =>
  theme.mode === 'dark' ? theme.colors.borderStrong : theme.colors.border

/** For text inside a placeholder: it keeps its size but isn't seen. */
export const HIDDEN_TEXT = { color: 'transparent' } as const

const styles = StyleSheet.create({
  // Web only: react-native-web turns these into a CSS animation. React Native's
  // types don't list them, and iOS and Android ignore them.
  pulse: {
    animationKeyframes: [{ '0%': { opacity: 1 }, '50%': { opacity: 0.5 }, '100%': { opacity: 1 } }],
    animationDuration: `${PULSE}ms`,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  } as object,
})
