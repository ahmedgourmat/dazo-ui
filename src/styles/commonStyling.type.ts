import type { StyleProp, ViewStyle } from 'react-native'
import type { ShadowKey } from './shadow'
import type { BorderWidthKey, RadiusKey, SpacingValue } from './tokens'
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
    aspectRatio?: number
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
    display?: 'none' | 'flex'
    flex?: number
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    gap?: SpacingValue
    rowGap?: SpacingValue
    columnGap?: SpacingValue

    // Visual
    opacity?: number
    overflow?: 'visible' | 'hidden' | 'scroll'
    /** Elevation level from the theme: 'none' | 'sm' | 'md' | 'lg' | 'xl'. The shadow* props below override parts of it. */
    shadow?: ShadowKey
    elevation?: number           // Android shadow
    shadowColor?: string         // iOS shadow
    shadowOpacity?: number
    shadowRadius?: number
    shadowOffset?: { width: number; height: number }

    // Border (missing ones)
    borderTopWidth?: BorderWidthKey | number
    borderBottomWidth?: BorderWidthKey | number
    borderLeftWidth?: BorderWidthKey | number
    borderRightWidth?: BorderWidthKey | number
    borderTopLeftRadius?: RadiusKey | number
    borderTopRightRadius?: RadiusKey | number
    borderBottomLeftRadius?: RadiusKey | number
    borderBottomRightRadius?: RadiusKey | number
    borderStyle?: 'solid' | 'dotted' | 'dashed'
    borderRadius?: RadiusKey | number
    borderWidth?: BorderWidthKey | number
    borderColor?: string
    borderTopColor?: string
    borderBottomColor?: string
    borderLeftColor?: string
    borderRightColor?: string
    transform?: ViewStyle['transform']

    style?: StyleProp<ViewStyle>
}