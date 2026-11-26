import { useMemo } from 'react'
import { useTheme } from '../../providers'
import { DISABLED_OPACITY, focusRing } from '../../styles/interaction'
import type { ButtonProps } from './button.type'
import type { Insets, TextStyle, ViewStyle } from 'react-native'

export type ButtonStyles = {
    container: ViewStyle
    /** Added on top of `container` while the pointer is over the button (web only). */
    hovered: ViewStyle
    /** Added on top of `container` while the button is pressed. */
    pressed: ViewStyle
    /** Added on top of `container` while the button has keyboard focus (web only). */
    focused: ViewStyle
    label: TextStyle
    indicator: string
    /** Extra touch area around buttons shorter than 44, the iOS minimum (native only). */
    hitSlop: Insets
}

type UseButtonStylesParams = Pick<ButtonProps,
    'variant' | 'size' | 'disabled' | 'fullWidth'
>

// [vertical padding, horizontal padding, font size] as steps of the theme's
// space and fontSize scales. Heights come from theme.controlHeight.
// minHeight keeps the control heights (32 / 40 / 48 / 56) but lets the button
// grow when the label needs more room: a second line, or a larger system
// font size. The padding plus one line of label fits inside each height:
// 14 × 1.15 + 2×6 ≈ 28 ≤ 32, 16 × 1.15 + 2×8 ≈ 34 ≤ 40,
// 18 × 1.15 + 2×8 ≈ 37 ≤ 48, 18 × 1.15 + 2×12 ≈ 45 ≤ 56.
const SIZES = {
    sm: [1.5, 3, 'sm'],
    md: [2, 4, 'base'],
    lg: [2, 5, 'lg'],
    xl: [3, 6, 'lg'],
} as const

export const useButtonStyles = ({
    variant = 'solid',
    size = 'md',
    disabled = false,
    fullWidth = false,
}: UseButtonStylesParams): ButtonStyles => {

    const theme = useTheme()

    return useMemo(() => {
        const { colors, space } = theme
        const [paddingY, paddingX, fontStep] = SIZES[size]
        const minHeight = theme.controlHeight[size]
        const fontSize = theme.fontSize[fontStep]

        // [background (and border), text, hover]. Solid and secondary buttons
        // lighten a little on hover; the quieter ones get the secondary surface.
        const lighten: ViewStyle = { opacity: 0.9 }
        const surface: ViewStyle = { backgroundColor: colors.secondary }
        const [background, color, hovered]: readonly [string, string, ViewStyle] = ({
            solid: [colors.primary, colors.primaryForeground, lighten],
            secondary: [colors.secondary, colors.secondaryForeground, lighten],
            outline: ['transparent', colors.foreground, surface],
            ghost: ['transparent', colors.foreground, surface],
        } as const)[variant]
        const touchGap = Math.max(0, (44 - minHeight) / 2)

        return {
            container: {
                minHeight,
                paddingVertical: space[paddingY],
                paddingHorizontal: space[paddingX],
                backgroundColor: background,
                // Every variant has the same 1px border, so they line up when side by side.
                borderWidth: theme.borderWidth.thin,
                borderColor: variant === 'outline' ? colors.borderStrong : background,
                borderRadius: theme.radius.md,
                opacity: disabled ? DISABLED_OPACITY : 1,
                alignSelf: fullWidth ? 'stretch' : 'flex-start',
            },
            hovered: disabled ? {} : hovered,
            pressed: disabled ? {} : { opacity: 0.8 },
            focused: focusRing(theme),
            label: {
                color,
                fontSize,
                fontWeight: theme.fontWeight.semibold,
                fontFamily: theme.fontFamily.semibold,
                lineHeight: fontSize * 1.15,
            },
            indicator: color,
            hitSlop: { top: touchGap, bottom: touchGap },
        }
    }, [theme, variant, size, disabled, fullWidth])
}
