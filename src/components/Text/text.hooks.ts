import { useMemo } from 'react'
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
}: UseTextStylesParams) => {

    const theme = useTheme()
    const modeTextColor = theme.colors.textPrimary

    return useMemo(() => {
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

export const useTextContent = ({
    children,
    lines,
    letters,
}: UseTextContentParams) => {
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

        if (safeLines === undefined) {
            return {
                displayText,
                numberOfLines: undefined,
            }
        }

        const words = displayText.trim().split(/\s+/).filter(Boolean)
        const wordCount = Math.max(words.length, 1)

        // Max logical lines = number of words (spaces + 1).
        const numberOfLines = Math.min(safeLines, wordCount)

        if (numberOfLines <= 1 || words.length <= 1) {
            return {
                displayText,
                numberOfLines,
            }
        }

        // Force logical wrapping by distributing words across target lines.
        const baseWordsPerLine = Math.floor(words.length / numberOfLines)
        let remainder = words.length % numberOfLines
        let cursor = 0
        const chunks: string[] = []

        for (let i = 0; i < numberOfLines; i += 1) {
            const take = baseWordsPerLine + (remainder > 0 ? 1 : 0)
            const chunk = words.slice(cursor, cursor + take).join(' ')
            chunks.push(chunk)
            cursor += take
            if (remainder > 0) remainder -= 1
        }

        const wrappedText = chunks.join('\n')

        return {
            displayText: wrappedText,
            numberOfLines,
        }
    }, [children, lines, letters])
}



