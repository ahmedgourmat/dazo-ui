import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { isDisabled, renderWithTheme } from '../../test/utils'
import { Checkbox } from './index'

describe('Checkbox', () => {
  it('is announced as a checkbox with its label', () => {
    renderWithTheme(<Checkbox label='Remember me' checked />)

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeTruthy()
  })

  it('announces whether it is checked', () => {
    const { rerender } = renderWithTheme(<Checkbox label='Terms' checked />)
    expect(screen.getByRole('checkbox', { name: 'Terms' }).getAttribute('aria-checked')).toBe('true')

    rerender(<Checkbox label='Terms' checked={false} />)
    expect(screen.getByRole('checkbox', { name: 'Terms' }).getAttribute('aria-checked')).toBe('false')
  })

  it('announces when it is disabled', () => {
    renderWithTheme(<Checkbox label='Terms' disabled />)

    expect(isDisabled(screen.getByRole('checkbox', { name: 'Terms' }))).toBe(true)
  })

  it('toggles with the Space key', () => {
    const onChange = vi.fn()
    renderWithTheme(<Checkbox label='Terms' onChange={onChange} />)

    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Terms' }), { key: ' ' })

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('ignores the Space key while disabled', () => {
    const onChange = vi.fn()
    renderWithTheme(<Checkbox label='Terms' onChange={onChange} disabled />)

    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Terms' }), { key: ' ' })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('asks to become checked when unchecked, and unchecked when checked', () => {
    const onChange = vi.fn()
    const { rerender } = renderWithTheme(<Checkbox label='Terms' checked={false} onChange={onChange} />)

    fireEvent.click(screen.getByText('Terms'))
    expect(onChange).toHaveBeenLastCalledWith(true)

    rerender(<Checkbox label='Terms' checked onChange={onChange} />)
    fireEvent.click(screen.getByText('Terms'))
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('shows a checkmark only when checked', () => {
    const { rerender } = renderWithTheme(<Checkbox label='Terms' checked={false} />)
    expect(screen.queryByText('✓')).toBeNull()

    rerender(<Checkbox label='Terms' checked />)
    expect(screen.getByText('✓')).toBeTruthy()
  })

  it('does not change while disabled', () => {
    const onChange = vi.fn()
    renderWithTheme(<Checkbox label='Terms' onChange={onChange} disabled />)

    fireEvent.click(screen.getByText('Terms'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('falls back to `value` as the accessible name when there is no label', () => {
    renderWithTheme(<Checkbox value='newsletter' />)

    expect(screen.getByRole('checkbox', { name: 'newsletter' })).toBeTruthy()
  })
})
