import { useMemo, type ReactNode } from 'react'
import type { TextStyle } from 'react-native'
import { useTheme } from '../../providers'
import { resolveColor } from '../../styles/color'
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
        const step = (key: keyof typeof theme.fontSize) => ({
            fontSize: theme.fontSize[key],
            lineHeight: theme.leading[key],
        })
        const variantStyles = {
            default: {
                ...step('base'),
                color: theme.colors.foreground,
                fontWeight: theme.fontWeight.regular,
                fontFamily: theme.fontFamily.regular,
            },
            title: {
                ...step('2xl'),
                color: theme.colors.foreground,
                fontWeight: theme.fontWeight.semibold,
                fontFamily: theme.fontFamily.semibold,
            },
            subtitle: {
                ...step('lg'),
                color: theme.colors.foreground,
                fontWeight: theme.fontWeight.medium,
                fontFamily: theme.fontFamily.medium,
            },
            caption: {
                ...step('sm'),
                color: theme.colors.foregroundMuted,
                fontWeight: theme.fontWeight.regular,
                fontFamily: theme.fontFamily.regular,
            },
        } as const

        return {
            ...variantStyles[variant],
            // A size from the scale brings its own line height.
            ...(size && step(size)),
            ...(color && { color: resolveColor(color, theme) }),
            // A custom size without a custom line height: one that fits it,
            // so large text isn't clipped by the variant's smaller one.
            ...(fontSize !== undefined && { fontSize, lineHeight: Math.round(fontSize * 1.4) }),
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
