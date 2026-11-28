import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { finishModalAnimations, isDisabled, renderWithTheme } from '../../test/utils'
import { Select } from './index'

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Legacy', value: 'legacy', disabled: true },
]

const open = (triggerText: string) => fireEvent.click(screen.getByText(triggerText))

describe('Select', () => {
  it('shows the label and the placeholder when nothing is selected', () => {
    renderWithTheme(<Select label='Plan' options={options} />)

    expect(screen.getByText('Plan')).toBeTruthy()
    expect(screen.getByText('Select an option')).toBeTruthy()
  })

  it('shows the label of the selected option', () => {
    renderWithTheme(<Select options={options} value='pro' placeholder='Pick one' />)

    expect(screen.getByText('Pro')).toBeTruthy()
    expect(screen.queryByText('Pick one')).toBeNull()
  })

  it('keeps the options hidden until it is opened', () => {
    renderWithTheme(<Select options={options} />)
    expect(screen.queryByText('Starter')).toBeNull()

    open('Select an option')

    for (const option of options) expect(screen.getByText(option.label)).toBeTruthy()
  })

  it('calls onChange with the picked value and closes', () => {
    const onChange = vi.fn()
    renderWithTheme(<Select options={options} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Pro'))

    expect(onChange).toHaveBeenCalledWith('pro')
    finishModalAnimations()
    expect(screen.queryByText('Starter')).toBeNull()
  })

  it('ignores clicks on a disabled option', () => {
    const onChange = vi.fn()
    renderWithTheme(<Select options={options} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Legacy'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not open while disabled', () => {
    renderWithTheme(<Select options={options} disabled />)

    open('Select an option')

    expect(screen.queryByText('Starter')).toBeNull()
  })

  describe('accessibility (#33)', () => {
    const trigger = (name: string) => screen.getByRole('button', { name })

    it('is announced as a button named by its visible label and value', () => {
      const { rerender } = renderWithTheme(<Select label='Plan' options={options} />)
      expect(trigger('Plan Select an option')).toBeTruthy()

      rerender(<Select label='Plan' options={options} value='pro' />)
      expect(trigger('Plan Pro')).toBeTruthy()
    })

    it('announces whether it is open', () => {
      renderWithTheme(<Select label='Plan' options={options} />)
      expect(trigger('Plan Select an option').getAttribute('aria-expanded')).toBe('false')

      open('Select an option')

      expect(trigger('Plan Select an option').getAttribute('aria-expanded')).toBe('true')
    })

    it('announces when it is disabled', () => {
      renderWithTheme(<Select label='Plan' options={options} disabled />)

      expect(isDisabled(trigger('Plan Select an option'))).toBe(true)
    })

    // Browsers turn Enter and Space on a real <button> into a click, which is
    // how it opens from the keyboard. jsdom doesn't do that conversion, so this
    // checks the element type; the key presses are checked in real Chrome.
    it('is a real button element, so Enter and Space open it', () => {
      renderWithTheme(<Select label='Plan' options={options} />)

      expect(trigger('Plan Select an option').tagName).toBe('BUTTON')
    })

    it('opens as a dialog named after the field', () => {
      renderWithTheme(<Select label='Plan' options={options} />)
      open('Select an option')
      finishModalAnimations() // react-native-web adds the dialog role once the fade-in ends

      expect(screen.getByRole('dialog', { name: 'Plan' })).toBeTruthy()
    })

    it('shows the options as a radio group with the selected one checked', () => {
      renderWithTheme(<Select label='Plan' options={options} value='pro' />)
      open('Pro')

      const group = screen.getByRole('radiogroup', { name: 'Plan' })
      const radios = within(group).getAllByRole('radio')
      // Named by their labels alone: the checkmark on the selected one is hidden from screen readers.
      expect(radios).toEqual(['Starter', 'Pro', 'Legacy'].map((name) => within(group).getByRole('radio', { name })))
      expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
      expect(radios.map(isDisabled)).toEqual([false, false, true])
    })

    it('picks an option with the Space key', () => {
      const onChange = vi.fn()
      renderWithTheme(<Select label='Plan' options={options} onChange={onChange} />)
      open('Select an option')

      fireEvent.keyDown(screen.getByRole('radio', { name: 'Starter' }), { key: ' ' })

      expect(onChange).toHaveBeenCalledWith('starter')
    })

    // react-native-web only listens for Escape and traps focus once the opening
    // fade has finished, hence finishModalAnimations() right after opening.
    it('closes with the Escape key', () => {
      renderWithTheme(<Select label='Plan' options={options} />)
      open('Select an option')
      finishModalAnimations()

      fireEvent.keyUp(document, { key: 'Escape' })
      finishModalAnimations()

      expect(screen.queryByRole('radiogroup')).toBeNull()
      expect(trigger('Plan Select an option').getAttribute('aria-expanded')).toBe('false')
    })

    it('closes when you tap outside the menu, but not when you tap inside it', () => {
      const onChange = vi.fn()
      renderWithTheme(<Select label='Plan' options={options} onChange={onChange} />)
      open('Select an option')
      finishModalAnimations()

      fireEvent.click(screen.getByRole('radiogroup', { name: 'Plan' }))
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeTruthy()

      const backdrop = screen.getByRole('dialog').querySelector('[aria-hidden="true"]') as HTMLElement
      fireEvent.click(backdrop)
      finishModalAnimations()

      expect(screen.queryByRole('radiogroup')).toBeNull()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('moves focus into the options when it opens, and back to the field when it closes', async () => {
      renderWithTheme(<Select label='Plan' options={options} />)
      trigger('Plan Select an option').focus()

      open('Select an option')
      finishModalAnimations()
      await waitFor(() => expect(screen.getByRole('radiogroup').contains(document.activeElement)).toBe(true))

      fireEvent.keyUp(document, { key: 'Escape' })
      finishModalAnimations()
      await waitFor(() => expect(document.activeElement).toBe(trigger('Plan Select an option')))
    })
  })

  // Regression for #27: options after about the sixth could not be reached.
  it('renders every option of a long list', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ label: `Option ${i + 1}`, value: `o${i + 1}` }))
    const onChange = vi.fn()
    renderWithTheme(<Select options={many} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Option 9'))

    expect(onChange).toHaveBeenCalledWith('o9')
  })
})

// Issue #80: works with `value` + `onChange`, or on its own from `defaultValue`.
describe('Select: controlled and uncontrolled (#80)', () => {
  const pick = (from: string, option: string) => {
    open(from)
    fireEvent.click(screen.getByText(option))
    finishModalAnimations()
  }

  it('uncontrolled: shows the picked option and reports it', () => {
    const onChange = vi.fn()
    renderWithTheme(<Select options={options} onChange={onChange} />)

    pick('Select an option', 'Pro')

    expect(screen.getByText('Pro')).toBeTruthy()
    expect(screen.queryByText('Select an option')).toBeNull()
    expect(onChange).toHaveBeenCalledWith('pro')
  })

  it('uncontrolled: starts from defaultValue', () => {
    renderWithTheme(<Select options={options} defaultValue='starter' />)

    expect(screen.getByText('Starter')).toBeTruthy()
    pick('Starter', 'Pro')
    expect(screen.getByText('Pro')).toBeTruthy()
  })

  it('controlled: shows `value` and only reports changes', () => {
    const onChange = vi.fn()
    const { rerender } = renderWithTheme(<Select options={options} value='starter' onChange={onChange} />)

    pick('Starter', 'Pro')
    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.getByText('Starter')).toBeTruthy()

    rerender(<Select options={options} value='pro' onChange={onChange} />)
    expect(screen.getByText('Pro')).toBeTruthy()
  })

  it('controlled: null clears the field back to the placeholder', () => {
    const { rerender } = renderWithTheme(<Select options={options} value='pro' />)

    rerender(<Select options={options} value={null} />)

    expect(screen.getByText('Select an option')).toBeTruthy()
  })
})
