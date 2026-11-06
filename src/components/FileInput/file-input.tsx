import { useCallback, useState, type JSX } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import type { FileInputProps, PickedFile } from './file-input.type'

export const FileInput = ({
  label,
  value,
  placeholder = 'Choose a file',
  disabled = false,
  leftIcon,
  rightIcon,
  autoOpenPicker = true,
  onFilesSelected,
  onPress,
  onClear,
  style,
  labelStyle,
  customPicker,
  ...commonProps
}: FileInputProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const [selectedFiles, setSelectedFiles] = useState<PickedFile[]>([])

  const applySelectedFiles = useCallback((files: PickedFile[]) => {
    setSelectedFiles(files)
    onFilesSelected?.(files)
  }, [onFilesSelected])

  const openWebPicker = useCallback(() => {
    const webApi = globalThis as any
    const doc = webApi['document'] as any
    const urlApi = webApi['URL'] as any

    if (!doc) {
      return
    }

    const input = doc.createElement('input')
    input.type = 'file'
    input.multiple = Boolean(commonProps.multiple)
    input.accept = commonProps.accept ?? ''

    input.onchange = () => {
      const files = (Array.from((input as any).files ?? []) as any[]).map((file: any) => ({
        name: file.name,
        uri: urlApi?.createObjectURL?.(file) ?? '',
        size: file.size,
        mimeType: file.type,
      }))

      applySelectedFiles(files)
    }

    input.click()
  }, [applySelectedFiles, commonProps.accept, commonProps.multiple])

  const openNativePicker = useCallback(async () => {
    console.warn(
      'Native file picking is disabled in the library runtime to avoid requiring expo-document-picker from the client app.'
    )
  }, [])

  const handlePress = useCallback(async () => {
    if (disabled) {
      return
    }

    onPress?.()

    if (!autoOpenPicker) {
      return
    }

    if (customPicker) {
      try {
        const files = await customPicker()
        if (files) {
          applySelectedFiles(files)
        }
      } catch (error) {
        console.error('Error with custom picker:', error)
      }
      return
    }

    if (Platform.OS === 'web') {
      openWebPicker()
      return
    }

    await openNativePicker()
  }, [autoOpenPicker, disabled, onPress, openNativePicker, openWebPicker, customPicker, applySelectedFiles])

  const handleClear = useCallback(() => {
    setSelectedFiles([])
    onFilesSelected?.([])
    onClear?.()
  }, [onClear, onFilesSelected])

  const localValue = selectedFiles.map((file) => file.name).join(', ')
  const displayValue = value?.trim() || localValue || placeholder

  return (
    <Pressable
      onPress={handlePress}
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
        <Text style={[styles.value, { color: value ? theme.colors.textPrimary : theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }]} numberOfLines={1}>
          {displayValue}
        </Text>
      </View>

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      {(onClear || localValue) && displayValue !== placeholder ? <Text onPress={handleClear} style={[styles.clear, { color: theme.colors.primary, fontFamily: theme.fontFamily.regular }]}>Clear</Text> : null}
    </Pressable>
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
  clear: {
    marginLeft: 12,
    fontSize: 12,
  },
})