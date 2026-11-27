import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { Divider } from './index'

describe('Divider', () => {
  it('is a horizontal separator, 1px high in the border color', () => {
    renderWithTheme(<Divider />)

    const separator = screen.getByRole('separator')
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal')
    expect(getComputedStyle(separator).height).toBe('1px')
    expect(getComputedStyle(separator).backgroundColor).toBe(hexToRgb(lightTheme.colors.border))
  })

  it('can be vertical', () => {
    renderWithTheme(<Divider orientation='vertical' />)

    const separator = screen.getByRole('separator')
    expect(separator.getAttribute('aria-orientation')).toBe('vertical')
    expect(getComputedStyle(separator).width).toBe('1px')
  })

  it('is hidden from screen readers when decorative', () => {
    renderWithTheme(<Divider testID='line' decorative />)

    expect(screen.queryByRole('separator')).toBeNull()
    expect(screen.getByTestId('line').getAttribute('aria-hidden')).toBe('true')
  })

  it('shows a label between two lines, which screen readers skip', () => {
    renderWithTheme(<Divider testID='or' label='or' />)

    const row = screen.getByTestId('or')
    expect(screen.getByText('or')).toBeTruthy()
    const lines = Array.from(row.children).filter((child) => child.getAttribute('aria-hidden') === 'true')
    expect(lines).toHaveLength(2)
  })

  it('takes a theme color name and style props', () => {
    renderWithTheme(<Divider color='borderStrong' marginVertical='md' />)

    const style = getComputedStyle(screen.getByRole('separator'))
    expect(style.backgroundColor).toBe(hexToRgb(lightTheme.colors.borderStrong))
    expect(style.marginTop).toBe('16px')
  })
})
