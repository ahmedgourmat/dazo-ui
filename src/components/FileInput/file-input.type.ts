import type { ReactNode, Ref } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle, View } from 'react-native'

export type PickedFile = {
  name: string
  /**
   * Where the file can be read. From the built-in web picker this is a `blob:`
   * URL that FileInput creates and frees again: it works until the selection
   * changes, is cleared, or the FileInput unmounts. To keep a file longer, use
   * `file` (e.g. upload it, or call URL.createObjectURL(file) yourself).
   */
  uri: string
  size?: number
  mimeType?: string
  /** Web only: the browser's File object. */
  file?: File
}

/** What FileInput asks its picker for. */
export type FilePickerOptions = {
  /** The `accept` prop: comma-separated MIME types or extensions, e.g. 'image/*,.pdf'. */
  accept?: string
  /** The `multiple` prop. */
  multiple: boolean
}

/** Opens a picker and resolves with the chosen files, or null/undefined when cancelled. */
export type FilePicker = (options: FilePickerOptions) => Promise<PickedFile[] | undefined | null>

export interface FileInputProps extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  /** The pressable picker field. Use it to focus() or measure it. */
  ref?: Ref<View>
  /** Finds the component in end-to-end tests (Detox, Maestro, Playwright). Set on the same element as `ref`; on the web it becomes `data-testid`. */
  testID?: string
  label?: string
  /**
   * Text shown in the field. When set, FileInput is controlled: it shows this
   * value and nothing else, and you update it from onFilesSelected / onClear.
   */
  value?: string
  placeholder?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** Height 32 / 40 / 48 / 56 (it grows to fit a label). Default md. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  autoOpenPicker?: boolean
  onFilesSelected?: (files: PickedFile[]) => void
  onPress?: () => void
  onClear?: () => void
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  /**
   * Opens your own picker instead of the built-in one. Required on iOS and
   * Android, which have no built-in picker: with expo-document-picker installed,
   * pass `expoDocumentPicker(DocumentPicker)`.
   */
  customPicker?: FilePicker
}
