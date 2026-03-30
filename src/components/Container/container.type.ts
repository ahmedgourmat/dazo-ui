import type { StyleProp, ViewStyle } from 'react-native'
import type { Theme } from '../../styles/theme'

export type SpacingKey = keyof Theme['spacing']
export type RadiusKey = keyof Theme['radius']
export type SpacingValue = SpacingKey | number

export interface ContainerProps {
    children: React.ReactNode

    padding?: SpacingValue
    paddingHorizontal?: SpacingValue
    paddingVertical?: SpacingValue
    paddingTop?: SpacingValue
    paddingBottom?: SpacingValue
    paddingLeft?: SpacingValue
    paddingRight?: SpacingValue
    margin?: SpacingValue
    marginHorizontal?: SpacingValue
    marginVertical?: SpacingValue
    marginTop?: SpacingValue
    marginBottom?: SpacingValue
    marginLeft?: SpacingValue
    marginRight?: SpacingValue

    flex?: number
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    gap?: SpacingValue

    backgroundColor?: string
    borderRadius?: RadiusKey | number
    borderWidth?: number
    borderColor?: string

    scrollable?: boolean
    style?: StyleProp<ViewStyle>
}