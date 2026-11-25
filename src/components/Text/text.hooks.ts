import { useMemo, type ReactNode } from 'react'
import type { TextStyle } from 'react-native'
import { useTheme } from '../../providers'
import type { TextProps } from './text.type'

type UseTextStylesParams = Pick<TextProps,
    | 'variant'
    | 'size'
    | 'color'
    | 'fontSize'
    | 'fontWeight'
    | 'fontFamily'
    | 'fontStyle'
    | 'lineHeight'
    | 'textAlign'
    | 'textTransform'
    | 'textDecorationLine'
    | 'letterSpacing'
>

export const useTextStyles = ({
    variant = 'default',
    size,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    fontStyle,
    lineHeight,
    textAlign,
    textTransform,
    textDecorationLine,
    letterSpacing,
}: UseTextStylesParams): TextStyle => {

    const theme = useTheme()

    return useMemo(() => {
        const modeTextColor = theme.colors.textPrimary
        const variantStyles = {
            default: {
                fontSize: theme.fontSize.md,
                color: modeTextColor,
                fontWeight: theme.fontWeight.regular,
                fontFamily: theme.fontFamily.regular,
                lineHeight: theme.fontSize.md * 1.6,
            },
            title: {
                fontSize: theme.fontSize.xxl,
                color: modeTextColor,
                fontWeight: theme.fontWeight.bold,
                fontFamily: theme.fontFamily.bold,
                lineHeight: theme.fontSize.xxl * 1.25,
            },
            subtitle: {
                fontSize: theme.fontSize.lg,
                color: modeTextColor,
                fontWeight: theme.fontWeight.medium,
                fontFamily: theme.fontFamily.medium,
                lineHeight: theme.fontSize.lg * 1.35,
            },
            caption: {
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                fontWeight: theme.fontWeight.regular,
                fontFamily: theme.fontFamily.regular,
                lineHeight: theme.fontSize.sm * 1.45,
            },
        } as const

        return {
            ...variantStyles[variant],
            ...(size && { fontSize: theme.fontSize[size] }),
            ...(color && { color }),
            ...(fontSize !== undefined && { fontSize }),
            ...(fontWeight && { fontWeight }),
            ...(fontFamily && { fontFamily }),
            ...(fontStyle && { fontStyle }),
            ...(lineHeight !== undefined && { lineHeight }),
            ...(textAlign && { textAlign }),
            ...(textTransform && { textTransform }),
            ...(textDecorationLine && { textDecorationLine }),
            ...(letterSpacing !== undefined && { letterSpacing }),
        }
    }, [
        theme,
        variant,
        size,
        color,
        fontSize,
        fontWeight,
        fontFamily,
        fontStyle,
        lineHeight,
        textAlign,
        textTransform,
        textDecorationLine,
        letterSpacing,
    ])
}

type UseTextContentParams = Pick<TextProps, 'children' | 'lines' | 'letters'>

export type TextContent = {
    displayText: ReactNode
    numberOfLines: number | undefined
}

export const useTextContent = ({
    children,
    lines,
    letters,
}: UseTextContentParams): TextContent => {
    return useMemo(() => {
        const safeLines =
            typeof lines === 'number' && lines > 0
                ? Math.floor(lines)
                : undefined

        if (typeof children !== 'string') {
            return {
                displayText: children,
                numberOfLines: safeLines,
            }
        }

        const safeLetters =
            typeof letters === 'number' && letters > 0
                ? Math.floor(letters)
                : undefined

        const displayText =
            safeLetters !== undefined && children.length > safeLetters
                ? `${children.slice(0, safeLetters)}...`
                : children

        // `lines` is a maximum: the text wraps where the width needs it, and
        // anything past the last allowed line is cut with an ellipsis.
        return {
            displayText,
            numberOfLines: safeLines,
        }
    }, [children, lines, letters])
}
