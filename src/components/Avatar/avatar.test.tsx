import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { initialsOf } from './avatar'
import { Avatar } from './index'

describe('initialsOf', () => {
  it('takes the first letter of the first and last word', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL')
    expect(initialsOf('Jean Luc Picard')).toBe('JP')
    expect(initialsOf('  grace   hopper ')).toBe('GH')
  })

  it('uses one letter for a single word, and nothing for an empty name', () => {
    expect(initialsOf('Plato')).toBe('P')
    expect(initialsOf('   ')).toBe('')
  })

  it('keeps accented and non-Latin letters whole', () => {
    expect(initialsOf('élodie ünal')).toBe('ÉÜ')
    expect(initialsOf('𝒜da Lovelace')).toBe('𝒜L')
  })
})

describe('Avatar', () => {
  it('is an image named by the person, showing their initials', () => {
    renderWithTheme(<Avatar name='Ada Lovelace' />)

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeTruthy()
    expect(screen.getByText('AL')).toBeTruthy()
  })

  it('is hidden from screen readers without a name', () => {
    renderWithTheme(<Avatar testID='avatar' />)

    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('avatar').getAttribute('aria-hidden')).toBe('true')
  })

  it('shows the image over the initials when there is a src', () => {
    renderWithTheme(<Avatar testID='avatar' name='Ada Lovelace' src='https://example.com/ada.png' />)

    // The initials stay underneath, for while the image loads or if it fails.
    expect(screen.getByText('AL')).toBeTruthy()
    expect(screen.getByTestId('avatar').children).toHaveLength(2)
  })

  it('uses the secondary surface and its foreground', () => {
    renderWithTheme(<Avatar testID='avatar' name='Ada Lovelace' />)

    expect(getComputedStyle(screen.getByTestId('avatar')).backgroundColor).toBe(hexToRgb(lightTheme.colors.secondary))
    expect(getComputedStyle(screen.getByText('AL')).color).toBe(hexToRgb(lightTheme.colors.secondaryForeground))
  })

  it('sizes and shapes', () => {
    renderWithTheme(
      <>
        <Avatar testID='xs' name='A' size='xs' />
        <Avatar testID='xl' name='B' size='xl' />
        <Avatar testID='rounded' name='C' shape='rounded' />
      </>,
    )
    const style = (id: string) => getComputedStyle(screen.getByTestId(id))

    expect([style('xs').width, style('xs').borderTopLeftRadius]).toEqual(['24px', '12px'])
    expect([style('xl').width, style('xl').height]).toEqual(['64px', '64px'])
    expect(style('rounded').borderTopLeftRadius).toBe(`${lightTheme.radius.md}px`)
    expect(getComputedStyle(screen.getByText('B')).fontSize).toBe('26px') // 40% of 64
  })
})
