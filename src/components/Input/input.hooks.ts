import { useMemo } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../providers'
import { DISABLED_OPACITY, focusRing } from '../../styles/interaction'
import type { ControlSize } from '../../styles/tokens'

type InputVariant = 'solid' | 'outline' | 'ghost'

export type InputStyles = {
  container: ViewStyle
  input: TextStyle
  placeholderColor: string
  /** Added to the container while the field has focus. */
  focusRing: ViewStyle
}

type UseInputStylesParams = {
  variant?: InputVariant
  size?: ControlSize
  editable?: boolean
  invalid?: boolean
  textColor?: string
}

export const useInputStyles = ({
  variant = 'outline',
  size = 'md',
  editable = true,
  invalid = false,
  textColor,
}: UseInputStylesParams): InputStyles => {
  const theme = useTheme()

  return useMemo(() => {
    const { colors, space, fontSize, borderWidth } = theme
    // 16px text from md up: smaller text in a focused field makes iOS Safari zoom in.
    // No lineHeight: on iOS it pushes the text of a one-line field off center.
    const sizeStyles = {
      sm: { minHeight: theme.controlHeight.sm, paddingHorizontal: space[3], fontSize: fontSize.sm },
      md: { minHeight: theme.controlHeight.md, paddingHorizontal: space[3], fontSize: fontSize.base },
      lg: { minHeight: theme.controlHeight.lg, paddingHorizontal: space[4], fontSize: fontSize.base },
      xl: { minHeight: theme.controlHeight.xl, paddingHorizontal: space[4], fontSize: fontSize.lg },
    } as const
    const { minHeight, paddingHorizontal, ...text } = sizeStyles[size]

    // Every variant has a 1px border (transparent where it isn't shown), so
    // fields of different variants line up. The edge that shows where an
    // outline or solid field is uses `input`, which has 3:1 contrast.
    const edge = invalid ? colors.danger : colors.input
    const variantStyles = {
      outline: {
        backgroundColor: 'transparent',
        borderColor: edge,
      },
      solid: {
        backgroundColor: colors.secondary,
        borderColor: 'transparent',
        borderBottomColor: edge,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: invalid ? colors.danger : 'transparent',
      },
    } as const

    return {
      container: {
        minHeight,
        paddingHorizontal,
        borderWidth: borderWidth.thin,
        borderRadius: theme.radius.md,
        ...variantStyles[variant],
        opacity: editable ? 1 : DISABLED_OPACITY,
      },
      input: {
        ...text,
        color: textColor ?? colors.foreground,
        fontFamily: theme.fontFamily.regular,
        // Fills the field, so a tap anywhere in it reaches the text box.
        minHeight: minHeight - 2 * borderWidth.thin,
      },
      placeholderColor: colors.foregroundMuted,
      // A 2px ring around the whole field while it has focus, for every
      // variant: unlike a thicker border it doesn't move the layout. iOS and
      // Android draw it too (New Architecture). Text fields show it after a
      // click as well, as browsers do, since typing goes there.
      focusRing: focusRing(theme),
    }
  }, [editable, invalid, size, theme, textColor, variant])
}

export type { InputVariant }
