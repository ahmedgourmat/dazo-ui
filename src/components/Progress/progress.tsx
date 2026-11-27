import { useEffect, useState, type JSX } from 'react'
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useReducedMotion } from '../../hooks/motion'
import { useTheme } from '../../providers'
import { toneColors } from '../../styles/color'
import type { ProgressProps } from './progress.type'
import { SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

/** Share of the track the moving bar covers when the progress is unknown. */
const UNKNOWN_SHARE = 0.4
/** One sweep of the moving bar, in ms. Longer than the motion tokens on purpose: it repeats. */
const SWEEP = 1200

const ProgressBase = ({
  ref,
  testID,
  value,
  max = 100,
  label,
  tone = 'neutral',
  size = 'md',
  style,
  ...commonProps
}: ProgressProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const reduceMotion = useReducedMotion()
  const known = value !== undefined
  const share = known ? Math.min(1, Math.max(0, value / (max || 1))) : UNKNOWN_SHARE

  // Unknown progress: the bar sweeps across the track, unless motion is reduced.
  // iOS and Android move it with Animated. The web uses a CSS animation
  // instead: react-native-web's Animated needs a `global` that Vite and other
  // bundlers don't define.
  const web = Platform.OS === 'web'
  const moving = !known && !reduceMotion
  const [trackWidth, setTrackWidth] = useState(0)
  const [sweep] = useState(() => new Animated.Value(0))
  useEffect(() => {
    if (!moving || web) return
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: SWEEP,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => {
      loop.stop()
      sweep.setValue(0)
    }
  }, [moving, web, sweep])

  const barWidth = trackWidth * share
  const position = known
    ? null
    : !moving
      // Reduced motion: a still bar in the middle of the track.
      ? styles.centered
      : web
        ? styles.sweep
        : { transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-barWidth, trackWidth] }) }] }

  return (
    <View
      ref={ref}
      testID={testID}
      role='progressbar'
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={known ? max : undefined}
      aria-valuenow={known ? Math.min(max, Math.max(0, value)) : undefined}
      onLayout={web ? undefined : (event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={[
        styles.track,
        {
          height: size === 'sm' ? 4 : 8,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.secondary,
        },
        commonStyles,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          {
            // A percentage, so it is right before the first layout too.
            width: `${share * 100}%`,
            borderRadius: theme.radius.full,
            backgroundColor: toneColors(tone, theme).color,
          },
          position,
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
  centered: {
    marginLeft: `${((1 - UNKNOWN_SHARE) / 2) * 100}%`,
  },
  // Web only: react-native-web turns these into a CSS animation (as its own
  // ActivityIndicator does). React Native's types don't list them. The bar is
  // 40% of the track, so it starts just off the left edge (-100% of itself)
  // and ends just off the right edge (250% of itself).
  sweep: {
    // Inside keyframes react-native-web takes CSS transform strings, not React Native transform arrays.
    animationKeyframes: [{ '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(250%)' } }],
    animationDuration: `${SWEEP}ms`,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  } as object,
})

// Inside <Skeleton loading>: the empty track.
const ProgressSkeleton = (props: ProgressProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  return (
    <SkeletonBox
      style={[
        styles.track,
        { height: props.size === 'sm' ? 4 : 8, borderRadius: theme.radius.full },
        commonStyles,
        props.style,
      ]}
    />
  )
}

export const Progress: (props: ProgressProps) => JSX.Element = withSkeleton(ProgressBase, ProgressSkeleton)
