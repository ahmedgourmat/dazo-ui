import { useMemo, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from 'hooks/common.hooks'
import type { SelectProps, SelectOption } from './select.type'

export const Select = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  ...commonProps
}: SelectProps) => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const [open, setOpen] = useState(false)

  const selectedOption = useMemo<SelectOption | undefined>(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  return (
    <>
      <Pressable
        onPress={disabled ? undefined : () => setOpen(true)}
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
          {label ? <Text style={[styles.label, { color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }, labelStyle]}>{label}</Text> : null}
          <Text style={[styles.value, { color: selectedOption ? theme.colors.textPrimary : theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }]} numberOfLines={1}>
            {selectedOption?.label ?? placeholder}
          </Text>
        </View>

        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.menu, { backgroundColor: theme.colors.backgroundSurface, borderColor: theme.colors.border }]}>
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <Pressable
                  key={option.value}
                  disabled={option.disabled}
                  onPress={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                  style={[
                    styles.option,
                    isSelected && { backgroundColor: theme.colors.backgroundSunken },
                    option.disabled && { opacity: 0.5 },
                  ]}
                >
                  {option.icon ? <View style={styles.optionIcon}>{option.icon}</View> : null}
                  <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.regular }}>{option.label}</Text>
                </Pressable>
              )
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  menu: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: 320,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 8,
  },
})