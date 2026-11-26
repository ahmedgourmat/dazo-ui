import type { JSX } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import type { RadioGroupProps } from './radio.type'
import { spaceKeyActivates } from '../../hooks/keyboard'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import { DISABLED_OPACITY, focusRing, type InteractionState } from '../../styles/interaction'

export const RadioGroup = ({
    ref,
    options,
    value,
    onChange,
    disabled = false,
    direction = 'column',
    style,
    textColor,
    circleColor,
    labelStyle,
    accessibilityLabel,
    ...commonProps
}: RadioGroupProps): JSX.Element => {
    const theme = useTheme()
    const commonStyles = useCommonStyles(commonProps)
    const resolvedTextColor = textColor ?? theme.colors.foreground
    const resolvedCircleColor = circleColor ?? theme.colors.primary
    useFocusVisibleTracking()

    return (
        <View
            ref={ref}
            role='radiogroup'
            aria-label={accessibilityLabel}
            aria-disabled={disabled || undefined}
            style={[styles.group, { flexDirection: direction }, commonStyles, style]}
        >
            {options.map((option) => {
                const checked = option.value === value
                const optionDisabled = disabled || Boolean(option.disabled)
                const select = () => onChange?.(option.value)

                return (
                    <Pressable
                        key={option.value}
                        disabled={optionDisabled}
                        onPress={select}
                        role='radio'
                        aria-checked={checked}
                        aria-disabled={optionDisabled}
                        {...spaceKeyActivates(select, optionDisabled)}
                        style={({ focused }: InteractionState) => [
                            styles.option,
                            { borderRadius: theme.radius.sm },
                            direction === 'row' && styles.optionRow,
                            optionDisabled && { opacity: DISABLED_OPACITY },
                            isFocusVisible(focused) && focusRing(theme),
                        ]}
                    >
                        {/* `input` has 3:1 contrast, so an unselected circle is still easy to see. */}
                        <View
                            style={[
                                styles.circle,
                                {
                                    borderWidth: theme.borderWidth.thin,
                                    borderColor: checked ? resolvedCircleColor : theme.colors.input,
                                    backgroundColor: theme.colors.surface,
                                },
                            ]}
                        >
                            {checked ? <View style={[styles.dot, { backgroundColor: resolvedCircleColor }]} /> : null}
                        </View>
                        {option.icon ? <View style={styles.optionIcon}>{option.icon}</View> : null}
                        <Text
                            style={[
                                {
                                    color: resolvedTextColor,
                                    fontFamily: theme.fontFamily.regular,
                                    fontSize: theme.fontSize.base,
                                    lineHeight: theme.leading.base,
                                },
                                labelStyle,
                            ]}
                        >{option.label}</Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    group: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 44,
    },
    optionRow: {
        marginRight: 16,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    optionIcon: {
        marginRight: 8,
    },
})