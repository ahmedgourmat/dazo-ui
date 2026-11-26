import { useMemo } from 'react'
import type { Insets, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../providers'
import { DISABLED_OPACITY, focusRing } from '../styles/interaction'
import type { ControlSize } from '../styles/tokens'

export type FieldStyles = {
  /** The bordered box. */
  box: ViewStyle
  /** Padding inside the box, around the label and value. */
  content: ViewStyle
  /** Added to the box while the pointer is over it (web only). */
  hovered: ViewStyle
  /** Added while the field has keyboard focus (web only). */
  focused: ViewStyle
  /** The small label above the value. */
  label: TextStyle
  value: TextStyle
  /** The value's color while it shows the placeholder. */
  placeholderColor: string
  /** Icons and indicators such as Select's chevron. */
  iconColor: string
  /** Extra touch area for fields shorter than 44, the iOS minimum (native only). */
  hitSlop: Insets
}

const VALUE_SIZE = { sm: 'sm', md: 'base', lg: 'base', xl: 'lg' } as const

/**
 * The look shared by fields that open something when pressed (Select,
 * FileInput): the same edge, height, radius and text sizes as Input.
 */
export const useFieldStyles = ({ size = 'md', disabled = false }: { size?: ControlSize; disabled?: boolean }): FieldStyles => {
  const theme = useTheme()

  return useMemo(() => {
    const { colors, space, fontSize, leading, controlHeight } = theme
    const valueSize = VALUE_SIZE[size]
    const touchGap = Math.max(0, (44 - controlHeight[size]) / 2)

    return {
      box: {
        minHeight: controlHeight[size],
        borderWidth: theme.borderWidth.thin,
        borderColor: colors.input,
        borderRadius: theme.radius.md,
        backgroundColor: colors.surface,
        opacity: disabled ? DISABLED_OPACITY : 1,
      },
      content: {
        paddingHorizontal: size === 'sm' || size === 'md' ? space[3] : space[4],
        paddingVertical: space[1.5],
      },
      hovered: disabled ? {} : { backgroundColor: colors.surfaceMuted },
      focused: focusRing(theme),
      label: {
        fontSize: fontSize.xs,
        lineHeight: leading.xs,
        color: colors.foregroundMuted,
        fontFamily: theme.fontFamily.medium,
        fontWeight: theme.fontWeight.medium,
      },
      value: {
        fontSize: fontSize[valueSize],
        lineHeight: leading[valueSize],
        color: colors.foreground,
        fontFamily: theme.fontFamily.regular,
      },
      placeholderColor: colors.foregroundMuted,
      iconColor: colors.foregroundMuted,
      hitSlop: { top: touchGap, bottom: touchGap, left: 0, right: 0 },
    }
  }, [disabled, size, theme])
}
