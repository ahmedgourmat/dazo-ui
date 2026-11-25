import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, isDisabled, renderWithTheme } from '../../test/utils'
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

  describe('layout props (#32)', () => {
    const box = () => getComputedStyle(screen.getByRole('checkbox'))
    const { spacing, radius, colors } = lightTheme

    it('resolves spacing tokens instead of passing "md" through', () => {
      renderWithTheme(<Checkbox label='Terms' padding='md' marginTop='lg' />)

      expect(box().paddingTop).toBe(`${spacing.md}px`)
      expect(box().paddingLeft).toBe(`${spacing.md}px`)
      expect(box().marginTop).toBe(`${spacing.lg}px`)
    })

    it('lets a single side win over its shorthand, as before', () => {
      renderWithTheme(<Checkbox label='Terms' marginVertical='sm' marginBottom={3} paddingHorizontal={5} />)

      expect(box().marginTop).toBe(`${spacing.sm}px`)
      expect(box().marginBottom).toBe('3px')
      expect(box().paddingLeft).toBe('5px')
      expect(box().paddingRight).toBe('5px')
    })

    it('applies the other layout props it used to ignore', () => {
      renderWithTheme(<Checkbox label='Terms' backgroundColor='backgroundSunken' borderRadius='lg' width={200} opacity={0.5} />)

      expect(box().backgroundColor).toBe(hexToRgb(colors.backgroundSunken))
      expect(box().borderTopLeftRadius).toBe(`${radius.lg}px`)
      expect(box().width).toBe('200px')
      expect(box().opacity).toBe('0.5')
    })

    it('still lets `style` override them', () => {
      renderWithTheme(<Checkbox label='Terms' padding='md' style={{ paddingTop: 1 }} />)

      expect(box().paddingTop).toBe('1px')
      expect(box().paddingBottom).toBe(`${spacing.md}px`)
    })
  })

  it('falls back to `value` as the accessible name when there is no label', () => {
    renderWithTheme(<Checkbox value='newsletter' />)

    expect(screen.getByRole('checkbox', { name: 'newsletter' })).toBeTruthy()
  })
})
