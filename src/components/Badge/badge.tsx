import { useMemo, type JSX } from 'react'
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import { toneColors } from '../../styles/color'
import type { BadgeProps } from './badge.type'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

/**
 * A short status label. The text carries the meaning; color adds to it.
 * Solid badges put the tone's foreground color on the tone, which reaches
 * 4.5:1 in both modes. Subtle and outline badges keep the text neutral and
 * show the tone as a dot, because status colors are too light for small text.
 */
const BadgeBase = ({
  ref,
  testID,
  children,
  tone = 'neutral',
  variant = 'solid',
  size = 'md',
  icon,
  style,
  labelStyle,
  ...commonProps
}: BadgeProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)

  const { box, label, dot } = useMemo(() => {
    const { colors, space } = theme
    const toneColor = toneColors(tone, theme)
    const fontStep = size === 'sm' ? 'xs' : 'sm'
    const surfaces: Record<typeof variant, ViewStyle> = {
      solid: { backgroundColor: toneColor.color, borderColor: toneColor.color },
      subtle: { backgroundColor: colors.secondary, borderColor: colors.secondary },
      outline: { backgroundColor: 'transparent', borderColor: colors.borderStrong },
    }
    const box: ViewStyle = {
      ...surfaces[variant],
      minHeight: size === 'sm' ? 20 : 24,
      paddingHorizontal: size === 'sm' ? space[1.5] : space[2],
      borderWidth: theme.borderWidth.thin,
      borderRadius: theme.radius.full,
      gap: space[1.5],
    }
    const label: TextStyle = {
      color: variant === 'solid' ? toneColor.foreground : colors.foreground,
      fontSize: theme.fontSize[fontStep],
      lineHeight: theme.leading[fontStep],
      fontFamily: theme.fontFamily.medium,
      fontWeight: theme.fontWeight.medium,
    }
    // Neutral badges need no dot: there is no status to show.
    const dot: ViewStyle | null = variant !== 'solid' && tone !== 'neutral' ? { backgroundColor: toneColor.color } : null
    return { box, label, dot }
  }, [theme, tone, variant, size])

  return (
    <View ref={ref} testID={testID} style={[styles.box, box, commonStyles, style]}>
      {icon ? <View aria-hidden>{icon}</View> : dot ? <View aria-hidden style={[styles.dot, dot]} /> : null}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[label, labelStyle]} numberOfLines={1}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
})

// Inside <Skeleton loading>: a pill as wide as the label.
const BadgeSkeleton = (props: BadgeProps): JSX.Element => {
  const theme = useTheme()
  const { children, size = 'md', style, labelStyle } = props
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  const fontStep = size === 'sm' ? 'xs' : 'sm'

  return (
    <SkeletonBox
      style={[
        styles.box,
        {
          minHeight: size === 'sm' ? 20 : 24,
          paddingHorizontal: size === 'sm' ? theme.space[1.5] : theme.space[2],
          borderRadius: theme.radius.full,
        },
        commonStyles,
        style,
      ]}
    >
      <Text style={[{ fontSize: theme.fontSize[fontStep], lineHeight: theme.leading[fontStep] }, labelStyle, HIDDEN_TEXT]} numberOfLines={1}>
        {typeof children === 'string' || typeof children === 'number' ? children : ' '}
      </Text>
    </SkeletonBox>
  )
}

export const Badge: (props: BadgeProps) => JSX.Element = withSkeleton(BadgeBase, BadgeSkeleton)
