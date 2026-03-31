import type { StyleProp, TextStyle } from 'react-native'
import type { CommonProps } from 'styles/commonStyling.type'

export interface TextProps extends Omit<CommonProps, 'style' | 'scrollable'> {
    children?: React.ReactNode
    variant?: 'default' | 'title' | 'subtitle' | 'caption'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    style?: StyleProp<TextStyle>
}