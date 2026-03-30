import { View, ScrollView, StyleSheet } from 'react-native'
import { useMemo } from 'react'
import type { ContainerProps, RadiusKey, SpacingValue } from './container.type'
import { useTheme } from 'providers'
import { Theme } from 'styles/theme'


// create this helper above the component
const resolveSpacing = (
    value: SpacingValue | undefined,
    spacing: Theme['spacing']
): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === 'number') return value               // raw number → use as-is
    return spacing[value]                                     // token key → resolve
}

const resolveRadius = (
    value: RadiusKey | number | undefined,
    radius: Theme['radius']
): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === 'number') return value
    return radius[value]
}

export const Container = ({
    children,
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    marginHorizontal,
    marginVertical,
    flex,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    backgroundColor,
    borderRadius,
    borderWidth,
    borderColor,
    scrollable = false,
    style,
}: ContainerProps) => {

    const theme: Theme = useTheme()

    const computed = useMemo(() => {
        // shorthand aliases so you don't repeat theme.spacing everywhere
        const s = (v: SpacingValue | undefined) =>
            resolveSpacing(v, theme.spacing)
        const r = (v: RadiusKey | number | undefined) =>
            resolveRadius(v, theme.radius)

        return {
            ...(padding !== undefined && { padding: s(padding) }),
            ...(paddingHorizontal !== undefined && { paddingHorizontal: s(paddingHorizontal) }),
            ...(paddingVertical !== undefined && { paddingVertical: s(paddingVertical) }),
            ...(margin !== undefined && { margin: s(margin) }),
            ...(marginHorizontal !== undefined && { marginHorizontal: s(marginHorizontal) }),
            ...(marginVertical !== undefined && { marginVertical: s(marginVertical) }),
            ...(gap !== undefined && { gap: s(gap) }),
            ...(borderRadius !== undefined && { borderRadius: r(borderRadius) }),
            ...(backgroundColor && { backgroundColor }),
            ...(borderWidth !== undefined && { borderWidth }),
            ...(borderColor && { borderColor }),
            ...(flex !== undefined && { flex }),
            ...(flexDirection && { flexDirection }),
            ...(alignItems && { alignItems }),
            ...(justifyContent && { justifyContent }),
        }
    }, [
        theme,
        padding, paddingHorizontal, paddingVertical,
        margin, marginHorizontal, marginVertical,
        gap, flex, flexDirection, alignItems, justifyContent,
        backgroundColor, borderRadius, borderWidth, borderColor,
    ])


    if (scrollable) {
        return (
            <ScrollView
                contentContainerStyle={[computed, style]}
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