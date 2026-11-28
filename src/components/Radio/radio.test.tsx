import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { isDisabled, renderWithTheme } from '../../test/utils'
import { RadioGroup } from './index'

const options = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer', disabled: true },
]

describe('RadioGroup', () => {
  it('shows every option', () => {
    renderWithTheme(<RadioGroup options={options} />)

    for (const option of options) expect(screen.getByText(option.label)).toBeTruthy()
  })

  it('calls onChange with the value of the clicked option', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} value='admin' onChange={onChange} />)

    fireEvent.click(screen.getByText('Editor'))

    expect(onChange).toHaveBeenCalledWith('editor')
  })

  it('ignores clicks on a disabled option', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} onChange={onChange} />)

    fireEvent.click(screen.getByText('Viewer'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores clicks on every option when the group is disabled', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} onChange={onChange} disabled />)

    fireEvent.click(screen.getByText('Admin'))
    fireEvent.click(screen.getByText('Editor'))

    expect(onChange).not.toHaveBeenCalled()
  })

  describe('accessibility (#33)', () => {
    it('is announced as a radio group named by accessibilityLabel', () => {
      renderWithTheme(<RadioGroup options={options} accessibilityLabel='Role' />)

      expect(screen.getByRole('radiogroup', { name: 'Role' })).toBeTruthy()
    })

    it('announces each option as a radio, checked when it is the value', () => {
      renderWithTheme(<RadioGroup options={options} value='editor' />)

      const radios = screen.getAllByRole('radio')
      expect(radios.map((radio) => radio.textContent)).toEqual(['Admin', 'Editor', 'Viewer'])
      expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
    })

    it('announces disabled options, and every option when the group is disabled', () => {
      const { rerender } = renderWithTheme(<RadioGroup options={options} />)
      expect(screen.getAllByRole('radio').map(isDisabled)).toEqual([false, false, true])

      rerender(<RadioGroup options={options} disabled />)
      expect(screen.getAllByRole('radio').map(isDisabled)).toEqual([true, true, true])
    })

    it('selects an option with the Space key', () => {
      const onChange = vi.fn()
      renderWithTheme(<RadioGroup options={options} onChange={onChange} />)

      fireEvent.keyDown(screen.getByRole('radio', { name: 'Editor' }), { key: ' ' })

      expect(onChange).toHaveBeenCalledWith('editor')
    })

    it('ignores the Space key on a disabled option', () => {
      const onChange = vi.fn()
      renderWithTheme(<RadioGroup options={options} onChange={onChange} />)

      fireEvent.keyDown(screen.getByRole('radio', { name: 'Viewer' }), { key: ' ' })

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  it('renders option icons', () => {
    renderWithTheme(<RadioGroup options={[{ label: 'Admin', value: 'admin', icon: <span>shield</span> }]} />)

    expect(screen.getByText('shield')).toBeTruthy()
  })
})

// Issue #80: works with `value` + `onChange`, or on its own from `defaultValue`.
describe('RadioGroup: controlled and uncontrolled (#80)', () => {
  const checked = () => screen.queryAllByRole('radio').filter((r) => r.getAttribute('aria-checked') === 'true').map((r) => r.textContent)

  it('uncontrolled: selects the picked option itself and reports it', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} onChange={onChange} />)
    expect(checked()).toEqual([])

    fireEvent.click(screen.getByText('Editor'))

    expect(checked()).toEqual(['Editor'])
    expect(onChange).toHaveBeenCalledWith('editor')
  })

  it('uncontrolled: starts from defaultValue', () => {
    renderWithTheme(<RadioGroup options={options} defaultValue='admin' />)

    expect(checked()).toEqual(['Admin'])
    fireEvent.click(screen.getByText('Editor'))
    expect(checked()).toEqual(['Editor'])
  })

  it('controlled: shows `value` and only reports changes', () => {
    const onChange = vi.fn()
    const { rerender } = renderWithTheme(<RadioGroup options={options} value='admin' onChange={onChange} />)

    fireEvent.click(screen.getByText('Editor'))
    expect(onChange).toHaveBeenCalledWith('editor')
    expect(checked()).toEqual(['Admin'])

    rerender(<RadioGroup options={options} value='editor' onChange={onChange} />)
    expect(checked()).toEqual(['Editor'])
  })

  it('controlled: null clears the selection', () => {
    const { rerender } = renderWithTheme(<RadioGroup options={options} value='admin' />)

    rerender(<RadioGroup options={options} value={null} />)

    expect(checked()).toEqual([])
  })
})
