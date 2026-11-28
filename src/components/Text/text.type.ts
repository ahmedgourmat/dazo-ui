import type { Ref } from 'react'
import type { StyleProp, TextStyle, Text } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { FontSizeKey } from '../../styles/tokens'

export interface TextProps extends Omit<CommonProps, 'style' | 'scrollable'> {
    /** The Text element. */
    ref?: Ref<Text>
    /** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
    testID?: string
    children?: React.ReactNode
    /** default: body text (16/24). title: 24/32 semibold. subtitle: 18/28 medium. caption: 14/20 muted. */
    variant?: 'default' | 'title' | 'subtitle' | 'caption'
    /** A step of the type scale, with its line height: xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 · 4xl 36 · 5xl 48. */
    size?: FontSizeKey
    /** A theme color name ('foregroundMuted', 'danger', …) or any color. */
    color?: string
    fontSize?: number
    fontWeight?: TextStyle['fontWeight']
    fontFamily?: TextStyle['fontFamily']
    fontStyle?: TextStyle['fontStyle']
    lineHeight?: number
    textAlign?: TextStyle['textAlign']
    textTransform?: TextStyle['textTransform']
    textDecorationLine?: TextStyle['textDecorationLine']
    letterSpacing?: number
    /** At most this many lines; the rest is cut with an ellipsis (numberOfLines). */
    lines?: number
    /** At most this many characters; longer text is cut and ends with "...". */
    letters?: number
    style?: StyleProp<TextStyle>
}