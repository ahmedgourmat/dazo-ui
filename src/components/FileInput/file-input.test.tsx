import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState, type ComponentProps } from 'react'
import { Platform } from 'react-native'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../providers'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, isDisabled, renderWithTheme } from '../../test/utils'
import { expoDocumentPicker, FileInput, type ExpoDocumentPickerModule } from './index'

const files = [
  { name: 'report.pdf', uri: 'file://report.pdf' },
  { name: 'photo.png', uri: 'file://photo.png' },
]

/** Rendered the same way both times, so rerender updates the FileInput instead of remounting it. */
const ThemedFileInput = (props: ComponentProps<typeof FileInput>) => (
  <ThemeProvider colorScheme='light'>
    <FileInput {...props} />
  </ThemeProvider>
)

type PickerResult = Awaited<ReturnType<ExpoDocumentPickerModule['getDocumentAsync']>>
const fakeDocumentPicker = (result: PickerResult) => ({ getDocumentAsync: vi.fn(async () => result) })

/**
 * Stands in for the browser's file dialog: records the <input type=file> that
 * FileInput creates, numbers the blob: URLs it makes, and lists the ones it frees.
 */
const stubWebPicker = () => {
  let created = 0
  const revoked: string[] = []
  let input: HTMLInputElement | undefined
  const createElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    const el = createElement(tag)
    if (tag === 'input') input = el as HTMLInputElement
    return el
  })
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:' + ++created)
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url: string) => void revoked.push(url))

  return {
    revoked,
    input: () => input,
    /** Picks files with these names in the open dialog. */
    choose: (...names: string[]) => {
      const chosen = names.map((name) => new File(['%PDF'], name, { type: 'application/pdf' }))
      Object.defineProperty(input, 'files', { value: chosen, configurable: true })
      act(() => input?.onchange?.(new Event('change')))
      return chosen
    },
  }
}

afterEach(() => vi.restoreAllMocks())

describe('FileInput', () => {
  it('shows the label and the placeholder before anything is picked', () => {
    renderWithTheme(<FileInput label='Attachment' placeholder='Pick a file' />)

    expect(screen.getByText('Attachment')).toBeTruthy()
    expect(screen.getByText('Pick a file')).toBeTruthy()
  })

  it('shows the names of the files returned by customPicker', async () => {
    const onFilesSelected = vi.fn()
    renderWithTheme(<FileInput placeholder='Pick' customPicker={async () => files} onFilesSelected={onFilesSelected} />)

    fireEvent.click(screen.getByText('Pick'))

    expect(await screen.findByText('report.pdf, photo.png')).toBeTruthy()
    expect(onFilesSelected).toHaveBeenCalledWith(files)
  })

  it('clears the picked files', async () => {
    const onFilesSelected = vi.fn()
    const onClear = vi.fn()
    renderWithTheme(
      <FileInput placeholder='Pick' customPicker={async () => files} onFilesSelected={onFilesSelected} onClear={onClear} />,
    )

    fireEvent.click(screen.getByText('Pick'))
    fireEvent.click(await screen.findByText('Clear'))

    expect(screen.getByText('Pick')).toBeTruthy()
    expect(onFilesSelected).toHaveBeenLastCalledWith([])
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('shows `value` instead of the picked file names', () => {
    renderWithTheme(<FileInput placeholder='Pick' value='existing.txt' />)

    expect(screen.getByText('existing.txt')).toBeTruthy()
  })

  it('does not open the picker while disabled', () => {
    const customPicker = vi.fn(async () => files)
    const onPress = vi.fn()
    renderWithTheme(<FileInput placeholder='Pick' customPicker={customPicker} onPress={onPress} disabled />)

    fireEvent.click(screen.getByText('Pick'))

    expect(customPicker).not.toHaveBeenCalled()
    expect(onPress).not.toHaveBeenCalled()
  })

  it('opens the browser file picker on web and reports the chosen files', async () => {
    const web = stubWebPicker()
    const onFilesSelected = vi.fn()
    renderWithTheme(<FileInput placeholder='Pick' accept='application/pdf' multiple onFilesSelected={onFilesSelected} />)

    fireEvent.click(screen.getByText('Pick'))
    expect(web.input()?.type).toBe('file')
    expect(web.input()?.accept).toBe('application/pdf')
    expect(web.input()?.multiple).toBe(true)

    const [file] = web.choose('report.pdf')
    expect(onFilesSelected).toHaveBeenCalledWith([
      { name: 'report.pdf', uri: 'blob:1', size: file.size, mimeType: 'application/pdf', file },
    ])
    expect(await screen.findByText('report.pdf')).toBeTruthy()
  })

  describe('blob: URLs from the web picker (#40)', () => {
    it('frees the previous URLs when new files are picked', () => {
      const web = stubWebPicker()
      renderWithTheme(<FileInput placeholder='Pick' multiple />)

      fireEvent.click(screen.getByText('Pick'))
      web.choose('a.pdf', 'b.pdf')
      expect(web.revoked).toEqual([])

      fireEvent.click(screen.getByText('a.pdf, b.pdf'))
      web.choose('c.pdf')
      expect(web.revoked).toEqual(['blob:1', 'blob:2'])
    })

    it('frees them when cleared', () => {
      const web = stubWebPicker()
      renderWithTheme(<FileInput placeholder='Pick' />)

      fireEvent.click(screen.getByText('Pick'))
      web.choose('a.pdf')
      fireEvent.click(screen.getByText('Clear'))

      expect(web.revoked).toEqual(['blob:1'])
    })

    it('frees them when the FileInput unmounts', () => {
      const web = stubWebPicker()
      const { unmount } = renderWithTheme(<FileInput placeholder='Pick' />)

      fireEvent.click(screen.getByText('Pick'))
      web.choose('a.pdf')
      unmount()

      expect(web.revoked).toEqual(['blob:1'])
    })

    it('leaves URLs from customPicker alone, and still frees its own', async () => {
      const web = stubWebPicker()
      const { rerender } = render(<ThemedFileInput placeholder='Pick' />)

      fireEvent.click(screen.getByText('Pick'))
      web.choose('a.pdf')

      rerender(<ThemedFileInput placeholder='Pick' customPicker={async () => files} />)
      fireEvent.click(screen.getByText('a.pdf'))
      await screen.findByText('report.pdf, photo.png')
      expect(web.revoked).toEqual(['blob:1'])

      fireEvent.click(screen.getByText('Clear'))
      expect(web.revoked).toEqual(['blob:1'])
    })
  })

  it('passes accept and multiple to customPicker', () => {
    const customPicker = vi.fn(async () => files)
    renderWithTheme(<FileInput placeholder='Pick' accept='image/*' multiple customPicker={customPicker} />)

    fireEvent.click(screen.getByText('Pick'))

    expect(customPicker).toHaveBeenCalledWith({ accept: 'image/*', multiple: true })
  })

  it('keeps the current files when customPicker is cancelled', async () => {
    let cancel = false
    const onFilesSelected = vi.fn()
    renderWithTheme(
      <FileInput placeholder='Pick' customPicker={async () => (cancel ? null : files)} onFilesSelected={onFilesSelected} />,
    )

    fireEvent.click(screen.getByText('Pick'))
    await screen.findByText('report.pdf, photo.png')
    cancel = true
    fireEvent.click(screen.getByText('report.pdf, photo.png'))
    await act(async () => {})

    expect(screen.getByText('report.pdf, photo.png')).toBeTruthy()
    expect(onFilesSelected).toHaveBeenCalledTimes(1)
  })

  it('shows picked file names in the text color, not the placeholder color', async () => {
    renderWithTheme(<FileInput placeholder='Pick' customPicker={async () => files} />)

    expect(getComputedStyle(screen.getByText('Pick')).color).toBe(hexToRgb(lightTheme.colors.textSecondary))
    fireEvent.click(screen.getByText('Pick'))

    const names = await screen.findByText('report.pdf, photo.png')
    expect(getComputedStyle(names).color).toBe(hexToRgb(lightTheme.colors.textPrimary))
  })

  describe('`value` is the source of truth when given (#40)', () => {
    it('keeps showing `value` after files are picked', async () => {
      const onFilesSelected = vi.fn()
      renderWithTheme(
        <FileInput placeholder='Pick' value='existing.txt' customPicker={async () => files} onFilesSelected={onFilesSelected} />,
      )

      fireEvent.click(screen.getByText('existing.txt'))
      await act(async () => {})

      expect(onFilesSelected).toHaveBeenCalledWith(files)
      expect(screen.getByText('existing.txt')).toBeTruthy()
      expect(screen.queryByText('report.pdf, photo.png')).toBeNull()
    })

    it('shows the placeholder when `value` is empty, even after a pick', async () => {
      renderWithTheme(<FileInput placeholder='Pick' value='' customPicker={async () => files} />)

      fireEvent.click(screen.getByText('Pick'))
      await act(async () => {})

      expect(screen.getByText('Pick')).toBeTruthy()
      expect(screen.queryByText('Clear')).toBeNull()
    })

    it('follows the app: picking and clearing update the field through `value`', async () => {
      const Controlled = () => {
        const [names, setNames] = useState('')
        return (
          <FileInput
            placeholder='Pick'
            value={names}
            customPicker={async () => files}
            onFilesSelected={(picked) => setNames(picked.map((file) => file.name).join(' + '))}
          />
        )
      }
      renderWithTheme(<Controlled />)

      fireEvent.click(screen.getByText('Pick'))
      expect(await screen.findByText('report.pdf + photo.png')).toBeTruthy()

      fireEvent.click(screen.getByText('Clear'))
      expect(screen.getByText('Pick')).toBeTruthy()
    })

    it('offers Clear only when the app can react to it', () => {
      renderWithTheme(
        <>
          <FileInput placeholder='A' value='read-only.txt' />
          <FileInput placeholder='B' value='clearable.txt' onClear={() => {}} />
        </>,
      )

      expect(screen.getAllByText('Clear')).toHaveLength(1)
    })
  })

  describe('on iOS and Android (#40)', () => {
    const originalOS = Platform.OS
    const setOS = (os: string) => Object.defineProperty(Platform, 'OS', { value: os, configurable: true })
    afterEach(() => setOS(originalOS))

    it('explains how to add a picker when none is given', () => {
      setOS('ios')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      renderWithTheme(<FileInput placeholder='Pick' />)

      fireEvent.click(screen.getByText('Pick'))

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('expoDocumentPicker(DocumentPicker)'))
    })

    it('picks files with expoDocumentPicker', async () => {
      setOS('android')
      const DocumentPicker = fakeDocumentPicker({
        canceled: false,
        assets: [{ name: 'scan.pdf', uri: 'file:///cache/scan.pdf', size: 42, mimeType: 'application/pdf' }],
      })
      const onFilesSelected = vi.fn()
      renderWithTheme(
        <FileInput
          placeholder='Pick'
          accept='application/pdf'
          customPicker={expoDocumentPicker(DocumentPicker)}
          onFilesSelected={onFilesSelected}
        />,
      )

      fireEvent.click(screen.getByText('Pick'))

      expect(await screen.findByText('scan.pdf')).toBeTruthy()
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({ type: ['application/pdf'], multiple: false })
      expect(onFilesSelected).toHaveBeenCalledWith([
        { name: 'scan.pdf', uri: 'file:///cache/scan.pdf', size: 42, mimeType: 'application/pdf', file: undefined },
      ])
    })
  })

  describe('expoDocumentPicker (#40)', () => {
    const nothingPicked = { canceled: false, assets: [] }

    it('passes the MIME types from accept and skips extensions', async () => {
      const DocumentPicker = fakeDocumentPicker(nothingPicked)

      await expoDocumentPicker(DocumentPicker)({ accept: 'image/*, .pdf ,application/pdf', multiple: true })

      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({ type: ['image/*', 'application/pdf'], multiple: true })
    })

    it('allows any file when accept has no MIME types', async () => {
      const DocumentPicker = fakeDocumentPicker(nothingPicked)

      await expoDocumentPicker(DocumentPicker)({ accept: '.pdf', multiple: false })
      await expoDocumentPicker(DocumentPicker)({ multiple: false })

      expect(DocumentPicker.getDocumentAsync).toHaveBeenNthCalledWith(1, { type: '*/*', multiple: false })
      expect(DocumentPicker.getDocumentAsync).toHaveBeenNthCalledWith(2, { type: '*/*', multiple: false })
    })

    it('returns null when cancelled', async () => {
      const DocumentPicker = fakeDocumentPicker({ canceled: true, assets: null })

      expect(await expoDocumentPicker(DocumentPicker)({ multiple: false })).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('is announced as a button named by its visible label and value', () => {
      renderWithTheme(<FileInput label='Attachment' placeholder='Pick a file' disabled />)

      const picker = screen.getByRole('button', { name: 'Attachment Pick a file' })
      expect(isDisabled(picker)).toBe(true)
    })

    it('has a separate Clear button, not one nested inside the picker', async () => {
      renderWithTheme(<FileInput label='Attachment' placeholder='Pick' customPicker={async () => files} />)

      fireEvent.click(screen.getByRole('button', { name: 'Attachment Pick' }))
      const clear = await screen.findByRole('button', { name: 'Clear Attachment' })
      const picker = screen.getByRole('button', { name: 'Attachment report.pdf, photo.png' })

      expect(picker.contains(clear)).toBe(false)
    })
  })

  it('only calls onPress when autoOpenPicker is off', () => {
    const customPicker = vi.fn(async () => files)
    const onPress = vi.fn()
    renderWithTheme(<FileInput placeholder='Pick' customPicker={customPicker} onPress={onPress} autoOpenPicker={false} />)

    fireEvent.click(screen.getByText('Pick'))

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(customPicker).not.toHaveBeenCalled()
  })
})
