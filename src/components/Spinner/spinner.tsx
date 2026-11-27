import type { JSX } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import { resolveColor } from '../../styles/color'
import type { SpinnerProps } from './spinner.type'
import { SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

// iOS only draws 'small' (20) and 'large' (36), so sm is a scaled 'small'.
// Using the same values everywhere keeps the sizes identical on every platform.
const SIZES = {
  sm: { size: 'small', scale: 0.8 },
  md: { size: 'small', scale: 1 },
  lg: { size: 'large', scale: 1 },
} as const

/**
 * A themed loading indicator. It keeps spinning when the user asks for less
 * motion: it is essential feedback, and it doesn't move across the screen.
 */
const SpinnerBase = ({
  ref,
  testID,
  size = 'md',
  color = 'foreground',
  label = 'Loading',
  style,
  ...commonProps
}: SpinnerProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const current = SIZES[size]

  return (
    <View
      ref={ref}
      testID={testID}
      // One element for screen readers, named by the label.
      accessible
      role='progressbar'
      aria-label={label}
      style={[styles.container, commonStyles, style]}
    >
      <ActivityIndicator
        aria-hidden
        size={current.size}
        color={resolveColor(color, theme)}
        style={current.scale !== 1 ? { transform: [{ scale: current.scale }] } : undefined}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
})

const DIAMETERS = { sm: 16, md: 20, lg: 36 } as const

// Inside <Skeleton loading>: a circle the size of the indicator.
const SpinnerSkeleton = (props: SpinnerProps): JSX.Element => {
  const diameter = DIAMETERS[props.size ?? 'md']
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  return (
    <SkeletonBox
      style={[styles.container, { width: diameter, height: diameter, borderRadius: diameter / 2 }, commonStyles, props.style]}
    />
  )
}

export const Spinner: (props: SpinnerProps) => JSX.Element = withSkeleton(SpinnerBase, SpinnerSkeleton)
