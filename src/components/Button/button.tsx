import type { JSX } from 'react'
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import type { InteractionState } from '../../styles/interaction'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'

// One Button for every platform. On web, react-native-web renders this
// Pressable as a real <button> (role='button'), which Enter and Space press.
const ButtonBase = ({
  ref,
  label,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  icon,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  style,
  labelStyle,
  ...commonProps
}: ButtonProps): JSX.Element => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })
  const commonStyles = useCommonStyles(commonProps)
  const resolvedLeftIcon = leftIcon ?? icon
  const resolvedRightIcon = rightIcon
  useFocusVisibleTracking()

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      disabled={disabled || loading}
      role='button'
      aria-disabled={disabled || loading}
      aria-busy={loading}
      // Buttons shorter than 44 still get a 44-high touch area.
      hitSlop={computed.hitSlop}
      style={({ pressed, hovered, focused }: InteractionState) => [
        styles.base,
        computed.container,
        commonStyles,
        hovered && computed.hovered,
        pressed && computed.pressed,
        style,
        isFocusVisible(focused) && computed.focused,
      ]}
    >
      {loading && (
        // Hidden from screen readers: the button itself is announced as busy,
        // and an unnamed spinner would be read out as an empty progress bar.
        <View style={StyleSheet.absoluteFill} aria-hidden>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='small' color={computed.indicator} />
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', opacity: loading ? 0 : 1 }}>
        {resolvedLeftIcon ? <View style={styles.leftIcon}>{resolvedLeftIcon}</View> : null}
        <Text style={[styles.label, computed.label, labelStyle]}>
          {label}
        </Text>
        {resolvedRightIcon ? <View style={styles.rightIcon}>{resolvedRightIcon}</View> : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    includeFontPadding: false,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  hidden: {
    opacity: 0,
  },
})

// Inside <Skeleton loading>: the same box and label width, without the button.
const ButtonSkeleton = (props: ButtonProps): JSX.Element => {
  const { label, size = 'md', fullWidth = false, style, labelStyle } = props
  const computed = useButtonStyles({ size, fullWidth })
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])
  const leftIcon = props.leftIcon ?? props.icon

  return (
    <SkeletonBox style={[styles.base, computed.container, commonStyles, style]}>
      {leftIcon ? <View style={[styles.leftIcon, styles.hidden]}>{leftIcon}</View> : null}
      <Text style={[styles.label, computed.label, labelStyle, HIDDEN_TEXT]}>{label}</Text>
      {props.rightIcon ? <View style={[styles.rightIcon, styles.hidden]}>{props.rightIcon}</View> : null}
    </SkeletonBox>
  )
}

export const Button: (props: ButtonProps) => JSX.Element = withSkeleton(ButtonBase, ButtonSkeleton)
