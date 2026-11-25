import type { FilePicker } from './file-input.type'

/**
 * The part of expo-document-picker this uses. Written out here so dazo-ui
 * doesn't depend on expo-document-picker: apps that want it install it.
 */
export type ExpoDocumentPickerModule = {
  getDocumentAsync: (options?: { type?: string | string[]; multiple?: boolean }) => Promise<{
    canceled: boolean
    assets: { name: string; uri: string; size?: number; mimeType?: string; file?: File }[] | null
  }>
}

/**
 * A FileInput picker built on expo-document-picker, for iOS, Android and web:
 *
 *   import * as DocumentPicker from 'expo-document-picker'
 *   <FileInput customPicker={expoDocumentPicker(DocumentPicker)} />
 *
 * `multiple` and the MIME types in `accept` are passed on. Extensions in
 * `accept` ('.pdf') are skipped, because the native pickers filter by MIME type.
 */
export const expoDocumentPicker = (picker: ExpoDocumentPickerModule): FilePicker =>
  async ({ accept, multiple }) => {
    const mimeTypes = (accept ?? '')
      .split(',')
      .map((type) => type.trim())
      .filter((type) => type.includes('/'))

    const result = await picker.getDocumentAsync({
      type: mimeTypes.length > 0 ? mimeTypes : '*/*',
      multiple,
    })

    if (result.canceled || !result.assets) return null

    return result.assets.map(({ name, uri, size, mimeType, file }) => ({ name, uri, size, mimeType, file }))
  }
