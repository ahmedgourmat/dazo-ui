import { render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { darkTheme, lightTheme } from '../../styles/theme'
import { setSystemColorScheme } from '../../test/utils'
import { ThemeProvider } from './Theme.provider'
import { useTheme } from './Theme.context'

type ProviderProps = Omit<Parameters<typeof ThemeProvider>[0], 'children'>

const themeFrom = (props: ProviderProps) =>
  renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider {...props}>{children}</ThemeProvider>,
  }).result.current

const ShowMode = () => <span>{useTheme().mode}</span>

describe('ThemeProvider', () => {
  it('falls back to the light theme when there is no provider', () => {
    expect(renderHook(() => useTheme()).result.current).toBe(lightTheme)
  })

  it('uses the forced light or dark theme', () => {
    expect(themeFrom({ colorScheme: 'light' })).toBe(lightTheme)
    expect(themeFrom({ colorScheme: 'dark' })).toBe(darkTheme)
  })

  it('follows the system setting by default and updates when it changes', () => {
    render(
      <ThemeProvider>
        <ShowMode />
      </ThemeProvider>,
    )
    expect(screen.getByText('light')).toBeTruthy()

    setSystemColorScheme('dark')
    expect(screen.getByText('dark')).toBeTruthy()
  })

  it('ignores the system setting when a scheme is forced', () => {
    setSystemColorScheme('dark')
    expect(themeFrom({ colorScheme: 'light' })).toBe(lightTheme)
  })

  it('merges color and spacing overrides into the base theme', () => {
    const theme = themeFrom({
      colorScheme: 'dark',
      theme: { colors: { primary: '#123456' }, spacing: { md: 20 } },
    })

    expect(theme.colors).toEqual({ ...darkTheme.colors, primary: '#123456' })
    expect(theme.spacing).toEqual({ ...darkTheme.spacing, md: 20 })
    expect(theme.mode).toBe('dark')
  })

  it('merges font family overrides into the base theme', () => {
    const theme = themeFrom({ colorScheme: 'light', theme: { fontFamily: { bold: 'Poppins-Bold' } } })
    expect(theme.fontFamily).toEqual({ ...lightTheme.fontFamily, bold: 'Poppins-Bold' })
  })

  // Known bug, issue #31: radius, fontSize, fontWeight and lineHeight overrides
  // replace the whole section instead of merging into it.
  it.todo('keeps the other radius values when only one is overridden (#31)')
})
