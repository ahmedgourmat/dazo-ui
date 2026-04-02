import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from 'hooks/common.hooks'
import type { FileInputProps } from './file-input.type'

export const FileInput = ({
  label,
  value,
  placeholder = 'Choose a file',
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  onClear,
  style,
  labelStyle,
  ...commonProps
}: FileInputProps) => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const displayValue = value?.trim() || placeholder

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.backgroundSurface,
          opacity: disabled ? 0.7 : 1,
        },
        commonStyles,
        style,
      ]}
    >
      {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

      <View style={styles.content}>
        {label ? <Text style={[styles.label, { color: theme.colors.textSecondary }, labelStyle]}>{label}</Text> : null}
        <Text style={[styles.value, { color: value ? theme.colors.textPrimary : theme.colors.textSecondary }]} numberOfLines={1}>
          {displayValue}
        </Text>
      </View>

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      {onClear && value ? <Text onPress={onClear} style={[styles.clear, { color: theme.colors.primary }]}>Clear</Text> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  clear: {
    marginLeft: 8,
    fontSize: 12,
  },
})