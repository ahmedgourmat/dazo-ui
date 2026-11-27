import { useEffect, useState, type JSX } from 'react'
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useControllableState } from '../../hooks/controllable'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import { spaceKeyActivates } from '../../hooks/keyboard'
import { useReducedMotion } from '../../hooks/motion'
import { useTheme } from '../../providers'
import { DISABLED_OPACITY, cssTransition, focusRing, type InteractionState } from '../../styles/interaction'
import type { SwitchProps } from './switch.type'
import { formFieldProps, useFormField } from '../FormField/form-field.context'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

const SIZES = {
  sm: { width: 32, height: 18, thumb: 14 },
  md: { width: 44, height: 24, thumb: 20 },
} as const

const SwitchBase = ({
  ref,
  testID,
  checked,
  defaultChecked = false,
  onChange,
  disabled: disabledProp = false,
  label,
  labelPosition = 'start',
  size = 'md',
  accessibilityLabel,
  style,
  labelStyle,
  ...commonProps
}: SwitchProps): JSX.Element => {
  const theme = useTheme()
  const { colors, motion } = theme
  const commonStyles = useCommonStyles(commonProps)
  const reduceMotion = useReducedMotion()
  const formField = useFormField()
  const disabled = disabledProp || Boolean(formField?.disabled)
  useFocusVisibleTracking()
  const [on, setOn] = useControllableState(checked, defaultChecked, onChange)
  const toggle = () => {
    if (!disabled) setOn(!on)
  }

  const track = SIZES[size]
  const inset = (track.height - track.thumb) / 2
  const travel = track.width - track.thumb - 2 * inset

  // The thumb slides; with reduced motion it jumps. iOS and Android animate
  // it with Animated. The web uses a CSS transition instead: react-native-web's
  // Animated needs a `global` that Vite and other bundlers don't define.
  const [position] = useState(() => new Animated.Value(on ? 1 : 0))
  useEffect(() => {
    if (Platform.OS === 'web') return
    if (reduceMotion) {
      position.setValue(on ? 1 : 0)
      return
    }
    const [x1, y1, x2, y2] = motion.easing.standard
    Animated.timing(position, {
      toValue: on ? 1 : 0,
      duration: motion.duration.fast,
      easing: Easing.bezier(x1, y1, x2, y2),
      useNativeDriver: true,
    }).start()
  }, [on, reduceMotion, position, motion])

  const thumbStyle = {
    width: track.thumb,
    height: track.thumb,
    borderRadius: track.thumb / 2,
    backgroundColor: on ? colors.primaryForeground : colors.surface,
  }

  // A 44-point touch target even without a label.
  const touchGap = Math.max(0, (44 - track.height) / 2)

  return (
    <Pressable
      ref={ref}
      testID={testID}
      onPress={toggle}
      disabled={disabled}
      role='switch'
      aria-checked={on}
      aria-disabled={disabled}
      aria-label={label ?? accessibilityLabel}
      {...formFieldProps(formField, 'own')}
      hitSlop={{ top: touchGap, bottom: touchGap }}
      {...spaceKeyActivates(toggle, disabled)}
      style={({ focused }: InteractionState) => [
        styles.row,
        {
          gap: theme.space[3],
          borderRadius: theme.radius.sm,
          justifyContent: label && labelPosition === 'start' ? 'space-between' : 'flex-start',
          opacity: disabled ? DISABLED_OPACITY : 1,
        },
        commonStyles,
        style,
        isFocusVisible(focused) && focusRing(theme),
      ]}
    >
      {(state) => {
        const { hovered } = state as InteractionState
        const text = label ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.foreground,
                    fontSize: theme.fontSize.base,
                    lineHeight: theme.leading.base,
                    fontFamily: theme.fontFamily.regular,
                  },
                  labelStyle,
                ]}
              >
                {label}
              </Text>
            ) : null
        // On and off differ by the thumb's side as well as the color. `input`
        // and `primary` both reach 3:1 against the page.
        const control = (
            <View
              style={{
                width: track.width,
                height: track.height,
                borderRadius: track.height / 2,
                padding: inset,
                backgroundColor: on ? colors.primary : colors.input,
                opacity: hovered && !disabled ? 0.9 : 1,
              }}
            >
              {Platform.OS === 'web' ? (
                <View
                  style={[
                    thumbStyle,
                    { transform: [{ translateX: on ? travel : 0 }] },
                    !reduceMotion && cssTransition('transform', motion.duration.fast, motion.easing.standard),
                  ]}
                />
              ) : (
                <Animated.View
                  style={[thumbStyle, { transform: [{ translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }] }]}
                />
              )}
            </View>
        )
        // In reading order, so screen readers and the layout agree.
        return labelPosition === 'start' ? <>{text}{control}</> : <>{control}{text}</>
      }}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  label: {
    flexShrink: 1,
  },
})

// Inside <Skeleton loading>: the label's width and the track, laid out as the switch is.
const SwitchSkeleton = (props: SwitchProps): JSX.Element => {
  const theme = useTheme()
  const { label, labelPosition = 'start', size = 'md', style, labelStyle } = props
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  const track = SIZES[size]
  const text = label ? (
    <SkeletonBox style={[styles.label, { borderRadius: theme.radius.sm }]}>
      <Text
        style={[
          { fontSize: theme.fontSize.base, lineHeight: theme.leading.base, fontFamily: theme.fontFamily.regular },
          labelStyle,
          HIDDEN_TEXT,
        ]}
      >
        {label}
      </Text>
    </SkeletonBox>
  ) : null
  const control = <SkeletonBox style={{ width: track.width, height: track.height, borderRadius: track.height / 2 }} />

  return (
    <View
      aria-hidden
      style={[
        styles.row,
        { gap: theme.space[3], justifyContent: label && labelPosition === 'start' ? 'space-between' : 'flex-start' },
        commonStyles,
        style,
      ]}
    >
      {labelPosition === 'start' ? <>{text}{control}</> : <>{control}{text}</>}
    </View>
  )
}

export const Switch: (props: SwitchProps) => JSX.Element = withSkeleton(SwitchBase, SwitchSkeleton)
