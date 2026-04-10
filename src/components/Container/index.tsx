import { View, ScrollView, StyleSheet } from 'react-native'
import type { ContainerProps } from './container.type'
import { useCommonStyles } from 'hooks/common.hooks'

export const Container = ({
    children,
    scrollable = false,
    style,
    css,
    ...commonProps
}: ContainerProps) => {
    const computed = useCommonStyles(commonProps)


    if (scrollable) {
        return (
            <ScrollView
                contentContainerStyle={[styles.container, computed, css, style]}
            >
                {children}
            </ScrollView>
        )
    }

    return (
        <View style={[styles.container, computed, css, style]}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {},
})