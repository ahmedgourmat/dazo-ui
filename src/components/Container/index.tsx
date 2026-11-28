import type { JSX, Ref } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import type { ContainerProps } from './container.type'
import { useCommonStyles } from '../../hooks/common.hooks'

export const Container = ({
    ref,
    testID,
    children,
    scrollable = false,
    style,
    css,
    ...commonProps
}: ContainerProps): JSX.Element => {
    const computed = useCommonStyles(commonProps)


    if (scrollable) {
        return (
            <ScrollView
                ref={ref as Ref<ScrollView>}
                testID={testID}
                contentContainerStyle={[styles.container, computed, css, style]}
            >
                {children}
            </ScrollView>
        )
    }

    return (
        <View ref={ref as Ref<View>} testID={testID} style={[styles.container, computed, css, style]}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {},
})