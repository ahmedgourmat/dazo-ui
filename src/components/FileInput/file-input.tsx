import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import type { FileInputProps, PickedFile } from './file-input.type'

// The parts of the browser API the web picker uses. The library is built
// without DOM types because it also runs on iOS and Android.
// File itself comes from React Native's global types.
type WebFileInput = {
  type: string
  multiple: boolean
  accept: string
  files: ArrayLike<File> | null
  onchange: (() => void) | null
  click: () => void
}
type WebGlobals = {
  document?: { createElement: (tag: 'input') => WebFileInput }
  URL?: { createObjectURL?: (file: File) => string; revokeObjectURL?: (url: string) => void }
}

const revokeObjectUrls = (urls: string[]): void => {
  const { URL: urlApi } = globalThis as unknown as WebGlobals
  for (const url of urls) urlApi?.revokeObjectURL?.(url)
}

export const FileInput = ({
  ref,
  label,
  value,
  placeholder = 'Choose a file',
  accept,
  multiple = false,
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

  // blob: URLs this FileInput created for the built-in web picker. Each set is
  // freed when the selection changes, is cleared, or the FileInput unmounts;
  // URLs from customPicker belong to the app and are left alone.
  const ownedUrls = useRef<string[]>([])
  useEffect(() => () => {
    revokeObjectUrls(ownedUrls.current)
    ownedUrls.current = []
  }, [])

  const applySelectedFiles = useCallback((files: PickedFile[], createdUrls: string[] = []) => {
    revokeObjectUrls(ownedUrls.current)
    ownedUrls.current = createdUrls
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
    input.multiple = multiple
    input.accept = accept ?? ''

    input.onchange = () => {
      const files = Array.from(input.files ?? []).map((file) => ({
        name: file.name,
        uri: urlApi?.createObjectURL?.(file) ?? '',
        size: file.size,
        mimeType: file.type,
        file,
      }))

      applySelectedFiles(files, files.map((file) => file.uri).filter(Boolean))
    }

    input.click()
  }, [applySelectedFiles, accept, multiple])

  const warnNoNativePicker = useCallback(() => {
    console.warn(
      'FileInput: iOS and Android have no built-in file picker. Pass one through customPicker, ' +
        "e.g. with expo-document-picker installed: customPicker={expoDocumentPicker(DocumentPicker)} " +
        "(import * as DocumentPicker from 'expo-document-picker'; import { expoDocumentPicker } from 'dazo-ui')."
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
        const files = await customPicker({ accept, multiple })
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

    warnNoNativePicker()
  }, [autoOpenPicker, disabled, onPress, warnNoNativePicker, openWebPicker, customPicker, applySelectedFiles, accept, multiple])

  const handleClear = useCallback(() => {
    applySelectedFiles([])
    onClear?.()
  }, [applySelectedFiles, onClear])

  // `value` is the source of truth when given (controlled): the field shows it
  // and nothing else, so it can't disagree with the files picked here.
  // Without it, the field shows the names of the files picked here.
  const controlled = value !== undefined
  const shownValue = controlled ? value.trim() : selectedFiles.map((file) => file.name).join(', ')
  const displayValue = shownValue || placeholder

  // Controlled fields only offer Clear when the app can react to it.
  const showClear = Boolean(shownValue) && (!controlled || Boolean(onClear || onFilesSelected))

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
        ref={ref}
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
          <Text style={[styles.value, { color: shownValue ? theme.colors.textPrimary : theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }]} numberOfLines={1}>
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