import { useCallback, useEffect, useId, useRef, useState, type JSX } from 'react'
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from '../../hooks/common.hooks'
import { useFieldStyles, VALUE_SIZE } from '../../hooks/field.hooks'
import { isFocusVisible, useFocusVisibleTracking } from '../../hooks/focusVisible'
import type { InteractionState } from '../../styles/interaction'
import type { FileInputProps, PickedFile } from './file-input.type'
import { formFieldProps, useFormField } from '../FormField/form-field.context'
import { FieldSkeleton } from '../Skeleton/field-skeleton'
import { withSkeleton } from '../Skeleton/with-skeleton'

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

const FileInputBase = ({
  ref,
  label,
  value,
  placeholder = 'Choose a file',
  accept,
  multiple = false,
  disabled: disabledProp = false,
  size = 'md',
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
  const formField = useFormField()
  const disabled = disabledProp || Boolean(formField?.disabled)
  const field = useFieldStyles({ size, disabled, invalid: formField?.invalid })
  const valueId = useId()
  useFocusVisibleTracking()
  // Hover and keyboard focus on the picker show on the whole box, so they
  // follow its rounded edge.
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
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
        field.box,
        hovered && field.hovered,
        commonStyles,
        style,
        isFocusVisible(focused) && field.focused,
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
        {...formFieldProps(formField, 'value', { valueId, value: displayValue })}
        hitSlop={field.hitSlop}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        // The box draws the focus ring instead.
        style={[styles.picker, styles.noFocusRing, field.content, showClear && styles.pickerBeforeClear]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <View style={styles.content}>
          {label ? <Text style={[field.label, labelStyle]}>{label}</Text> : null}
          <Text nativeID={valueId} style={[field.value, !shownValue && { color: field.placeholderColor }]} numberOfLines={1}>
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
          style={({ hovered: clearHovered, focused: clearFocused }: InteractionState) => [
            styles.clearButton,
            { paddingRight: field.content.paddingHorizontal },
            clearHovered && styles.clearHovered,
            // Inside the button: the box would clip a ring outside it.
            isFocusVisible(clearFocused) && [field.focused, { outlineOffset: -2 }],
          ]}
        >
          <Text
            style={{
              color: theme.colors.foreground,
              fontSize: theme.fontSize.sm,
              lineHeight: theme.leading.sm,
              fontFamily: theme.fontFamily.medium,
              fontWeight: theme.fontWeight.medium,
            }}
          >
            Clear
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  // The picker fills the box, so the whole field stays clickable as before.
  picker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // React Native's types don't list 'none', but react-native-web passes it to CSS.
  noFocusRing: {
    outlineStyle: 'none',
  } as unknown as ViewStyle,
  pickerBeforeClear: {
    paddingRight: 0,
  },
  clearButton: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  clearHovered: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
})

// Inside <Skeleton loading>: the field's box, as high as with its label.
const FileInputSkeleton = (props: FileInputProps): JSX.Element => {
  const theme = useTheme()
  const size = props.size ?? 'md'
  const withLabel = props.label
    ? 2 * theme.space[1.5] + theme.leading.xs + theme.leading[VALUE_SIZE[size]] + 2 * theme.borderWidth.thin
    : 0
  return <FieldSkeleton props={props} height={Math.max(theme.controlHeight[size], withLabel)} />
}

export const FileInput: (props: FileInputProps) => JSX.Element = withSkeleton(FileInputBase, FileInputSkeleton)
