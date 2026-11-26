import type { Ref } from 'react'
import type { StyleProp, TextStyle, Text } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface TextProps extends Omit<CommonProps, 'style' | 'scrollable'> {
    /** The Text element. */
    ref?: Ref<Text>
    children?: React.ReactNode
    variant?: 'default' | 'title' | 'subtitle' | 'caption'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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