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

  describe('partial overrides keep the rest of every section (#31)', () => {
    it('radius', () => {
      const theme = themeFrom({ colorScheme: 'light', theme: { radius: { md: 6 } } })
      expect(theme.radius).toEqual({ ...lightTheme.radius, md: 6 })
    })

    it('fontSize, fontWeight and lineHeight', () => {
      const theme = themeFrom({
        colorScheme: 'light',
        theme: { fontSize: { lg: 19 }, fontWeight: { bold: '800' }, lineHeight: { tight: 1.2 } },
      })
      expect(theme.fontSize).toEqual({ ...lightTheme.fontSize, lg: 19 })
      expect(theme.fontWeight).toEqual({ ...lightTheme.fontWeight, bold: '800' })
      expect(theme.lineHeight).toEqual({ ...lightTheme.lineHeight, tight: 1.2 })
    })

    it('leaves sections you did not override exactly as they were', () => {
      const theme = themeFrom({ colorScheme: 'dark', theme: { radius: { md: 6 } } })
      expect(theme.colors).toEqual(darkTheme.colors)
      expect(theme.spacing).toEqual(darkTheme.spacing)
      expect(theme.fontSize).toEqual(darkTheme.fontSize)
    })

    it('ignores undefined values instead of erasing the base value', () => {
      const theme = themeFrom({ colorScheme: 'light', theme: { radius: { md: undefined }, colors: undefined } })
      expect(theme.radius).toEqual(lightTheme.radius)
      expect(theme.colors).toEqual(lightTheme.colors)
    })

    it('adds new color names next to the built-in ones', () => {
      const theme = themeFrom({ colorScheme: 'light', theme: { colors: { brand: '#ff6600' } as never } })
      expect(theme.colors).toEqual({ ...lightTheme.colors, brand: '#ff6600' })
    })

    it('never changes the built-in light and dark themes', () => {
      const before = JSON.stringify([lightTheme, darkTheme])
      themeFrom({ colorScheme: 'light', theme: { radius: { md: 99 }, colors: { primary: '#000' } } })
      themeFrom({ colorScheme: 'dark', theme: { spacing: { md: 99 } } })
      expect(JSON.stringify([lightTheme, darkTheme])).toBe(before)
    })
  })
})
