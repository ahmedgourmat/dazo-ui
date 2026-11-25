// src/components/Button/Button.hooks.ts
import { useMemo } from 'react'
import { useTheme } from '../../providers'
import type { ButtonProps } from './button.type'
import type { TextStyle, ViewStyle } from 'react-native'

export type ButtonSizeStyle = {
    minHeight: number
    paddingVertical: number
    paddingHorizontal: number
    fontSize: number
}

export type ButtonStyles = {
    container: ViewStyle
    label: TextStyle
    indicator: string
    currentSize: ButtonSizeStyle
}

type UseButtonStylesParams = Pick<ButtonProps,
    'variant' | 'size' | 'disabled' | 'fullWidth'
>

export const useButtonStyles = ({
    variant = 'solid',
    size = 'md',
    disabled = false,
    fullWidth = false,
}: UseButtonStylesParams): ButtonStyles => {

    const theme = useTheme()

    return useMemo(() => {
        // minHeight keeps the designed heights (32 / 40 / 48) but lets the button
        // grow when the label needs more room: a second line, or a larger system
        // font size. The vertical padding plus one line of label fits inside each
        // height: 15 + 2×6 = 27 ≤ 32, 17.3 + 2×8 ≈ 33 ≤ 40, 19.6 + 2×10 ≈ 40 ≤ 48.
        const sizeStyles = {
            sm: {
                minHeight: 32,
                paddingVertical: 6,
                paddingHorizontal: 12,
                fontSize: theme.fontSize.sm,
            },
            md: {
                minHeight: 40,
                paddingVertical: 8,
                paddingHorizontal: 20,
                fontSize: theme.fontSize.md,
            },
            lg: {
                minHeight: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                fontSize: theme.fontSize.lg,
            },
        } as const
        const currentSize = sizeStyles[size]

        const variantStyles = {
            solid: {
                container: {
                    backgroundColor: disabled
                        ? theme.colors.textDisabled
                        : theme.colors.primary,
                    borderWidth: 0,
                    shadowColor: '#000000',
                    shadowOpacity: disabled ? 0 : 0.2,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: disabled ? 0 : 2,
                },
                label: {
                    color: theme.colors.textInverse,
                },
                indicator: theme.colors.textInverse,
            },
            outline: {
                container: {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: disabled
                        ? theme.colors.border
                        : theme.colors.primary,
                },
                label: {
                    color: theme.colors.textPrimary,
                },
                indicator: theme.colors.textPrimary,
            },
            ghost: {
                container: {
                    backgroundColor: 'transparent' as const,
                    borderWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                label: {
                    color: theme.colors.textSecondary,
                },
                indicator: theme.colors.textSecondary,
            },
        } as const

        return {
            container: {
                // Each side is written out (not paddingVertical/Horizontal) so the
                // web Button, which hands these styles to a DOM <button>, can use
                // them as CSS too.
                minHeight: currentSize.minHeight,
                paddingTop: currentSize.paddingVertical,
                paddingBottom: currentSize.paddingVertical,
                paddingLeft: currentSize.paddingHorizontal,
                paddingRight: currentSize.paddingHorizontal,
                ...variantStyles[variant].container,
                // Native draws solid borders by default; a DOM <button> would
                // otherwise use the browser's 3D "outset" border.
                borderStyle: 'solid',
                borderRadius: theme.radius.md,
                alignSelf: fullWidth ? 'stretch' : 'flex-start',
            } as ViewStyle,
            label: {
                ...variantStyles[variant].label,
                fontSize: currentSize.fontSize,
                fontWeight: theme.fontWeight.medium,
                fontFamily: theme.fontFamily.medium,
                lineHeight: currentSize.fontSize * 1.15,
            },
            indicator: variantStyles[variant].indicator,
            currentSize,
        }
    }, [theme, variant, size, disabled, fullWidth])
}