import type { StyleProp, TextStyle } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface TextProps extends Omit<CommonProps, 'style' | 'scrollable'> {
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
    lines?: number
    letters?: number
    style?: StyleProp<TextStyle>
}