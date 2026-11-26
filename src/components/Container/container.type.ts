import type { Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, ViewStyle, View, ScrollView } from 'react-native'

export interface ContainerProps extends CommonProps {
	/** The View, or the ScrollView when `scrollable` (for scrollTo / scrollToEnd). */
	ref?: Ref<View | ScrollView>
	css?: StyleProp<ViewStyle>
}