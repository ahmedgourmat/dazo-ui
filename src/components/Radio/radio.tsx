import type { JSX } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import type { RadioGroupProps } from './radio.type'
import { spaceKeyActivates } from '../../hooks/keyboard'

export const RadioGroup = ({
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
    const resolvedTextColor = textColor ?? theme.colors.textPrimary
    const resolvedCircleColor = circleColor ?? theme.colors.primary

    return (
        <View
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
                        style={[styles.option, direction === 'row' && styles.optionRow, option.disabled && { opacity: 0.5 }]}
                    >
                        <View style={[styles.circle, { borderColor: checked ? resolvedCircleColor : theme.colors.border }]}>
                            {checked ? <View style={[styles.dot, { backgroundColor: resolvedCircleColor }]} /> : null}
                        </View>
                        {option.icon ? <View style={styles.optionIcon}>{option.icon}</View> : null}
                        <Text style={[styles.label, { color: resolvedTextColor, fontFamily: theme.fontFamily.regular }, labelStyle]}>{option.label}</Text>
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
        borderWidth: 2,
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
    label: {
        fontSize: 15,
    },
})