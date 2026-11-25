import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { isDisabled, renderWithTheme } from '../../test/utils'
import { Button } from './index'

describe('Button', () => {
  it('shows its label and calls onPress when clicked', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress while disabled', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} disabled />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).not.toHaveBeenCalled()
  })

  it('does not call onPress while loading, and shows a spinner', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} loading />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).not.toHaveBeenCalled()
    // Visible, but hidden from screen readers (the button is announced as busy instead).
    expect(screen.getByRole('progressbar', { hidden: true })).toBeTruthy()
  })

  it('renders left and right icons, and `icon` as the left icon', () => {
    renderWithTheme(
      <>
        <Button label='A' leftIcon={<span>left</span>} rightIcon={<span>right</span>} />
        <Button label='B' icon={<span>legacy</span>} />
      </>,
    )

    expect(screen.getByText('left')).toBeTruthy()
    expect(screen.getByText('right')).toBeTruthy()
    expect(screen.getByText('legacy')).toBeTruthy()
  })

  describe('sizes (#29)', () => {
    const cases = [
      { size: 'sm', minHeight: 32, paddingY: 6, paddingX: 12, fontSize: lightTheme.fontSize.sm },
      { size: 'md', minHeight: 40, paddingY: 8, paddingX: 20, fontSize: lightTheme.fontSize.md },
      { size: 'lg', minHeight: 48, paddingY: 10, paddingX: 24, fontSize: lightTheme.fontSize.lg },
    ] as const

    for (const c of cases) {
      it(`${c.size}: a minimum height (not a maximum) with padding that leaves room for the label`, () => {
        renderWithTheme(<Button label='Save' size={c.size} />)
        const button = getComputedStyle(screen.getByRole('button', { name: 'Save' }))
        const labelLine = parseFloat(getComputedStyle(screen.getByText('Save')).lineHeight)

        expect(button.minHeight).toBe(`${c.minHeight}px`)
        expect(button.maxHeight).not.toBe(`${c.minHeight}px`)
        expect([button.paddingTop, button.paddingBottom]).toEqual([`${c.paddingY}px`, `${c.paddingY}px`])
        expect([button.paddingLeft, button.paddingRight]).toEqual([`${c.paddingX}px`, `${c.paddingX}px`])
        // The label line is set in pixels (a unitless CSS value would be a multiplier)
        // and fits inside the minimum height together with the padding.
        expect(labelLine).toBeCloseTo(c.fontSize * 1.15, 1)
        expect(labelLine + 2 * c.paddingY).toBeLessThanOrEqual(c.minHeight)
      })
    }

    it('converts a lineHeight given in labelStyle to pixels too', () => {
      renderWithTheme(<Button label='Save' labelStyle={{ lineHeight: 22 }} />)

      expect(getComputedStyle(screen.getByText('Save')).lineHeight).toBe('22px')
    })

    it('draws a solid border for the outline variant', () => {
      renderWithTheme(<Button label='Save' variant='outline' />)

      expect(getComputedStyle(screen.getByRole('button', { name: 'Save' })).borderTopStyle).toBe('solid')
    })
  })

  describe('accessibility (#33)', () => {
    it('is announced as a button named by its label', () => {
      renderWithTheme(<Button label='Save' />)

      expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
    })

    it('is announced as disabled while disabled or loading', () => {
      renderWithTheme(
        <>
          <Button label='Off' disabled />
          <Button label='Busy' loading />
          <Button label='On' />
        </>,
      )

      expect(isDisabled(screen.getByRole('button', { name: 'Off' }))).toBe(true)
      expect(isDisabled(screen.getByRole('button', { name: 'Busy' }))).toBe(true)
      expect(isDisabled(screen.getByRole('button', { name: 'On' }))).toBe(false)
    })

    it('is announced as busy while loading', () => {
      renderWithTheme(<Button label='Save' loading />)

      expect(screen.getByRole('button', { name: 'Save' }).getAttribute('aria-busy')).toBe('true')
    })

    it('does not submit a surrounding form', () => {
      const onSubmit = vi.fn((event: Event) => event.preventDefault())
      renderWithTheme(
        <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
          <Button label='Add row' />
        </form>,
      )

      fireEvent.click(screen.getByRole('button', { name: 'Add row' }))

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('prefers leftIcon over icon when both are given', () => {
    renderWithTheme(<Button label='A' leftIcon={<span>left</span>} icon={<span>legacy</span>} />)

    expect(screen.getByText('left')).toBeTruthy()
    expect(screen.queryByText('legacy')).toBeNull()
  })
})
