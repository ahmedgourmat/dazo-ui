import type { CommonProps } from 'styles/commonStyling.type'
import type { StyleProp, ViewStyle } from 'react-native'

export interface ContainerProps extends CommonProps {
	css?: StyleProp<ViewStyle>
}