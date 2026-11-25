import { useCallback, useState, type JSX } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import type { FileInputProps, PickedFile } from './file-input.type'

// The parts of the browser API the web picker uses. The library is built
// without DOM types because it also runs on iOS and Android.
type WebFile = { name: string; size: number; type: string }
type WebFileInput = {
  type: string
  multiple: boolean
  accept: string
  files: ArrayLike<WebFile> | null
  onchange: (() => void) | null
  click: () => void
}
type WebGlobals = {
  document?: { createElement: (tag: 'input') => WebFileInput }
  URL?: { createObjectURL?: (file: WebFile) => string }
}

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
    const { document: doc, URL: urlApi } = globalThis as unknown as WebGlobals

    if (!doc) {
      return
    }

    const input = doc.createElement('input')
    input.type = 'file'
    input.multiple = Boolean(commonProps.multiple)
    input.accept = commonProps.accept ?? ''

    input.onchange = () => {
      const files = Array.from(input.files ?? []).map((file) => ({
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

  const showClear = Boolean(onClear || localValue) && displayValue !== placeholder

  // The bordered box holds two separate buttons: the picker and "Clear".
  // Clear used to sit inside the picker, and a button inside a button is
  // invalid on web and hard to reach with a screen reader.
  return (
    <View
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
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        // No aria-label: the name comes from the visible label and value, so
        // voice-control users can say what they see.
        role='button'
        aria-disabled={disabled}
        style={[styles.picker, showClear && styles.pickerBeforeClear]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

        <View style={styles.content}>
          {label ? <Text style={[styles.label, { color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }, labelStyle]}>{label}</Text> : null}
          <Text style={[styles.value, { color: value ? theme.colors.textPrimary : theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }]} numberOfLines={1}>
            {displayValue}
          </Text>
        </View>

        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </Pressable>

      {showClear ? (
        <Pressable
          onPress={handleClear}
          role='button'
          aria-label={label ? `Clear ${label}` : 'Clear'}
          style={styles.clearButton}
        >
          <Text style={[styles.clear, { color: theme.colors.primary, fontFamily: theme.fontFamily.regular }]}>Clear</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  // The picker fills the box, so the whole field stays clickable as before.
  picker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pickerBeforeClear: {
    paddingRight: 0,
  },
  clearButton: {
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 16,
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
    fontSize: 12,
  },
})