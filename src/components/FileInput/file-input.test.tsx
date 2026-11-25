import { act, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { isDisabled, renderWithTheme } from '../../test/utils'
import { FileInput } from './index'

const files = [
  { name: 'report.pdf', uri: 'file://report.pdf' },
  { name: 'photo.png', uri: 'file://photo.png' },
]

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
    const onFilesSelected = vi.fn()
    const createObjectURL = vi.fn(() => 'blob:report')
    vi.stubGlobal('URL', { ...URL, createObjectURL })
    const createElement = document.createElement.bind(document)
    let picker: HTMLInputElement | undefined
    const spy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = createElement(tag)
      if (tag === 'input') picker = el as HTMLInputElement
      return el
    })

    renderWithTheme(<FileInput placeholder='Pick' accept='application/pdf' multiple onFilesSelected={onFilesSelected} />)
    fireEvent.click(screen.getByText('Pick'))
    spy.mockRestore()

    expect(picker?.type).toBe('file')
    expect(picker?.accept).toBe('application/pdf')
    expect(picker?.multiple).toBe(true)

    const file = new File(['%PDF'], 'report.pdf', { type: 'application/pdf' })
    Object.defineProperty(picker, 'files', { value: [file] })
    act(() => picker?.onchange?.(new Event('change')))

    expect(onFilesSelected).toHaveBeenCalledWith([
      { name: 'report.pdf', uri: 'blob:report', size: file.size, mimeType: 'application/pdf' },
    ])
    expect(await screen.findByText('report.pdf')).toBeTruthy()
    vi.unstubAllGlobals()
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
