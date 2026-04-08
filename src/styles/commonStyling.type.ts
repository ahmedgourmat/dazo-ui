import type { StyleProp, ViewStyle } from 'react-native'
import { RadiusKey, SpacingValue } from 'styles/tokens'

export interface CommonProps {
    children?: React.ReactNode

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


    backgroundColor?: string
    scrollable?: boolean


    // Positioning
    position?: 'absolute' | 'relative'
    top?: number | string
    bottom?: number | string
    left?: number | string
    right?: number | string
    zIndex?: number

    // Dimensions
    width?: number | string
    height?: number | string
    minWidth?: number | string
    maxWidth?: number | string
    minHeight?: number | string
    maxHeight?: number | string

    // Flex (missing ones)
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
    flexGrow?: number
    flexShrink?: number
    flexBasis?: number | string
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around'
    flex?: number
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    gap?: SpacingValue

    // Visual
    opacity?: number
    overflow?: 'visible' | 'hidden' | 'scroll'
    elevation?: number           // Android shadow
    shadowColor?: string         // iOS shadow
    shadowOpacity?: number
    shadowRadius?: number
    shadowOffset?: { width: number; height: number }

    // Border (missing ones)
    borderTopWidth?: number
    borderBottomWidth?: number
    borderLeftWidth?: number
    borderRightWidth?: number
    borderTopLeftRadius?: number
    borderTopRightRadius?: number
    borderBottomLeftRadius?: number
    borderBottomRightRadius?: number
    borderStyle?: 'solid' | 'dotted' | 'dashed'
    borderRadius?: RadiusKey | number
    borderWidth?: number
    borderColor?: string

    style?: StyleProp<ViewStyle>
}