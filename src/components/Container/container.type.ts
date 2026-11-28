import type { Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, ViewStyle, View, ScrollView } from 'react-native'

export interface ContainerProps extends CommonProps {
	/** The View, or the ScrollView when `scrollable` (for scrollTo / scrollToEnd). */
	ref?: Ref<View | ScrollView>
	/** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
	testID?: string
	css?: StyleProp<ViewStyle>
}