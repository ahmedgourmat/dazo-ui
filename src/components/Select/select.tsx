import { useMemo, useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
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
            shadowColor: '#000000',
            shadowOpacity: disabled ? 0 : 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: disabled ? 0 : 1,
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
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: theme.colors.backgroundSurface,
                borderColor: theme.colors.border,
                shadowColor: '#000000',
                shadowOpacity: 0.2,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 5,
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === value

                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => {
                      onChange?.(item.value)
                      setOpen(false)
                    }}
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: theme.colors.backgroundSunken },
                      item.disabled && { opacity: 0.5 },
                    ]}
                  >
                    {item.icon ? <View style={styles.optionIcon}>{item.icon}</View> : null}
                    <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.regular }}>{item.label}</Text>
                  </Pressable>
                )
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  menu: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    maxHeight: 320,
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
})