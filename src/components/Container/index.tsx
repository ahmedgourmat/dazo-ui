import { View, ScrollView, StyleSheet } from 'react-native'
import type { ContainerProps } from './container.type'
import { useCommonStyles } from 'hooks/common.hooks'

export const Container = ({
    children,
    scrollable = false,
    style,
    ...commonProps
}: ContainerProps) => {
    const computed = useCommonStyles(commonProps)


    if (scrollable) {
        return (
            <ScrollView
                contentContainerStyle={[styles.container, computed, style]}
            >
                {children}
            </ScrollView>
        )
    }

    return (
        <View style={[styles.container, computed, style]}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {},
})