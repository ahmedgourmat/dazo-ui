import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Checkbox } from './index'

describe('Checkbox', () => {
  it('is announced as a checkbox with its label', () => {
    renderWithTheme(<Checkbox label='Remember me' checked />)

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeTruthy()
  })

  // Known gap on web: react-native-web 0.21 ignores `accessibilityState`, so
  // aria-checked / aria-disabled are missing. iOS and Android do read it.
  // To be fixed with the accessibility issues (#33).
  it.todo('exposes checked and disabled state to screen readers on web')

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
