import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Button, Checkbox, Input, Select, Text, ThemeProvider, useReducedMotion, useTheme } from '../index'
import { useCommonStyles } from '../hooks/common.hooks'
import { buildTheme, darkTheme, lightTheme, type Theme, type ThemeAccent, type ThemeMode } from '../styles/theme'
import { accentPalettes, palette } from '../styles/tokens'
import { hexToRgb, renderWithTheme, setReducedMotion } from './utils'

// The design system (Dazo UI Design System 0.1.0): its tokens, the contrast
// its colors must reach, and how components use them.

/** WCAG 2.x contrast ratio between two #RRGGBB colors. */
const contrast = (a: string, b: string): number => {
  const luminance = (hex: string) => {
    const n = Number.parseInt(hex.slice(1), 16)
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((channel) => {
      const c = channel / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

const renderIn = (ui: ReactElement, props: { colorScheme?: 'light' | 'dark'; accent?: ThemeAccent; theme?: object } = {}) =>
  render(<ThemeProvider colorScheme={props.colorScheme ?? 'light'} accent={props.accent} theme={props.theme}>{ui}</ThemeProvider>)

const themeFrom = (props: Omit<Parameters<typeof ThemeProvider>[0], 'children'>): Theme =>
  renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider {...props}>{children}</ThemeProvider>,
  }).result.current

describe('tokens follow the design system', () => {
  it('neutral palette', () => {
    expect(palette.gray).toEqual({
      50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3', 500: '#737373',
      600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0A0A0A',
    })
  })

  // Section 4.3 and 4.4. One deliberate change: `input` is gray 500 in both
  // modes instead of #E5E5E5 / #404040, which reach only 1.3:1 and 1.9:1
  // against the page; a field's edge needs 3:1 (WCAG 1.4.11).
  const spec = {
    light: {
      background: '#FFFFFF', foreground: '#171717', surface: '#FFFFFF', surfaceMuted: '#FAFAFA',
      surfaceElevated: '#FFFFFF', surfaceInverse: '#171717', foregroundMuted: '#525252', foregroundSubtle: '#737373',
      border: '#E5E5E5', borderStrong: '#D4D4D4', input: '#737373', ring: '#171717', primary: '#171717',
      primaryForeground: '#FFFFFF', secondary: '#F5F5F5', secondaryForeground: '#171717', danger: '#DC2626',
      success: '#16A34A', warning: '#D97706', info: '#2563EB',
    },
    dark: {
      background: '#0A0A0A', foreground: '#FAFAFA', surface: '#171717', surfaceMuted: '#262626',
      surfaceElevated: '#262626', surfaceInverse: '#FAFAFA', foregroundMuted: '#A3A3A3', foregroundSubtle: '#737373',
      border: '#262626', borderStrong: '#404040', input: '#737373', ring: '#A3A3A3', primary: '#FAFAFA',
      primaryForeground: '#171717', secondary: '#262626', secondaryForeground: '#FAFAFA', danger: '#F87171',
      success: '#4ADE80', warning: '#FBBF24', info: '#60A5FA',
    },
  }

  it('light and dark semantic colors', () => {
    expect(lightTheme.colors).toMatchObject(spec.light)
    expect(darkTheme.colors).toMatchObject(spec.dark)
  })

  it('type scale, each size with its line height', () => {
    const scale = { xs: [12, 16], sm: [14, 20], base: [16, 24], lg: [18, 28], xl: [20, 28], '2xl': [24, 32], '3xl': [30, 36], '4xl': [36, 40], '5xl': [48, 53] }
    for (const [key, [size, leading]] of Object.entries(scale)) {
      expect([lightTheme.fontSize[key as 'xs'], lightTheme.leading[key as 'xs']]).toEqual([size, leading])
    }
    expect(lightTheme.fontWeight).toEqual({ regular: '400', medium: '500', semibold: '600', bold: '700' })
  })

  it('spacing, radius, border width, control and icon sizes, motion', () => {
    expect(lightTheme.space).toEqual({ 0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96 })
    // The names spacing props take are steps of that scale.
    expect(lightTheme.spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 })
    expect(lightTheme.radius).toEqual({ none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 20, '3xl': 24, full: 9999 })
    expect(lightTheme.borderWidth).toEqual({ none: 0, thin: 1, medium: 2 })
    expect(lightTheme.controlHeight).toEqual({ sm: 32, md: 40, lg: 48, xl: 56 })
    expect(lightTheme.iconSize).toEqual({ xs: 12, sm: 16, md: 20, lg: 24, xl: 32 })
    expect(lightTheme.motion.duration).toEqual({ instant: 0, fast: 100, normal: 180, slow: 250, slower: 350 })
    expect(Object.keys(lightTheme.shadow)).toEqual(['none', 'sm', 'md', 'lg', 'xl'])
  })
})

describe('contrast (WCAG 2.2 AA), measured rather than assumed', () => {
  const accents: ThemeAccent[] = ['neutral', 'blue', 'green', 'violet', 'orange']
  const modes: ThemeMode[] = ['light', 'dark']

  for (const mode of modes) {
    for (const accent of accents) {
      it(`${mode}, ${accent} accent`, () => {
        const c = buildTheme(mode, accent).colors
        const pages = [c.background, c.surface, c.surfaceMuted, c.surfaceElevated]
        // Text: 4.5:1.
        for (const page of pages) {
          expect(contrast(c.foreground, page)).toBeGreaterThanOrEqual(4.5)
          expect(contrast(c.foregroundMuted, page)).toBeGreaterThanOrEqual(4.5)
        }
        expect(contrast(c.primaryForeground, c.primary)).toBeGreaterThanOrEqual(4.5)
        expect(contrast(c.secondaryForeground, c.secondary)).toBeGreaterThanOrEqual(4.5)
        expect(contrast(c.danger, c.background)).toBeGreaterThanOrEqual(4.5)
        // Text on a status color (solid Badge, and later Alert and Toast).
        for (const tone of ['danger', 'success', 'warning', 'info'] as const) {
          expect(contrast(c[`${tone}Foreground`], c[tone])).toBeGreaterThanOrEqual(4.5)
        }
        // Focus rings, field edges and selected controls: 3:1.
        for (const page of pages) {
          expect(contrast(c.ring, page)).toBeGreaterThanOrEqual(3)
          expect(contrast(c.input, page)).toBeGreaterThanOrEqual(3)
          expect(contrast(c.primary, page)).toBeGreaterThanOrEqual(3)
        }
        expect(contrast(c.input, c.secondary)).toBeGreaterThanOrEqual(3) // a solid Input's bottom edge
      })
    }
  }
})

describe('accent palettes', () => {
  it('change only primary, primary-foreground and ring; surfaces and text stay neutral', () => {
    for (const mode of ['light', 'dark'] as const) {
      const neutral = buildTheme(mode).colors
      const blue = themeFrom({ colorScheme: mode, accent: 'blue' }).colors
      const changed = Object.keys(neutral).filter((key) => neutral[key as 'primary'] !== blue[key as 'primary'])
      // primaryForeground (and its old name textInverse) stays white in light mode.
      const accentRoles = ['primary', 'primaryDark', 'primaryForeground', 'primaryLight', 'ring', 'textInverse']
      expect(changed.filter((key) => !accentRoles.includes(key))).toEqual([])
      expect(changed).toContain('primary')
      expect(changed).toContain('ring')
    }
  })

  it('use the 700 shade in light mode and 400 in dark mode', () => {
    expect(themeFrom({ colorScheme: 'light', accent: 'violet' }).colors.primary).toBe(accentPalettes.violet[700])
    expect(themeFrom({ colorScheme: 'dark', accent: 'violet' }).colors.primary).toBe(accentPalettes.violet[400])
  })

  it('accept your own shades', () => {
    const teal = { 50: '#F0FDFA', 200: '#99F6E4', 400: '#2DD4BF', 600: '#0D9488', 700: '#0F766E' }
    expect(themeFrom({ colorScheme: 'light', accent: teal }).colors).toMatchObject({ primary: '#0F766E', ring: '#0D9488' })
  })

  it('are shared between providers, like the built-in themes', () => {
    expect(themeFrom({ colorScheme: 'light', accent: 'blue' })).toBe(themeFrom({ colorScheme: 'light', accent: 'blue' }))
    expect(themeFrom({ colorScheme: 'light', accent: 'neutral' })).toBe(lightTheme)
  })

  it('reach the components', () => {
    renderIn(<Button label='Save' />, { accent: 'blue' })
    expect(getComputedStyle(screen.getByRole('button', { name: 'Save' })).backgroundColor).toBe(hexToRgb(accentPalettes.blue[700]))
  })
})

describe('deprecated names keep working', () => {
  it('old color names always equal the roles that replaced them', () => {
    for (const theme of [lightTheme, darkTheme, buildTheme('dark', 'orange')]) {
      const c = theme.colors
      expect([c.backgroundSurface, c.backgroundSunken, c.textPrimary, c.textSecondary, c.textDisabled, c.textInverse])
        .toEqual([c.surface, c.surfaceMuted, c.foreground, c.foregroundMuted, c.foregroundSubtle, c.primaryForeground])
      expect([c.primaryLight, c.primaryDark]).toEqual([c.primary, c.primary])
    }
    expect([lightTheme.fontSize.md, lightTheme.fontSize.xxl]).toEqual([lightTheme.fontSize.base, lightTheme.fontSize['2xl']])
  })

  it('an override of an old name reaches the components, which read the new name', () => {
    const theme = themeFrom({ colorScheme: 'light', theme: { colors: { textPrimary: '#112233' }, fontSize: { md: 17 } } })
    expect([theme.colors.foreground, theme.colors.textPrimary]).toEqual(['#112233', '#112233'])
    expect([theme.fontSize.base, theme.fontSize.md]).toEqual([17, 17])

    renderIn(<Text>Body</Text>, { theme: { colors: { textPrimary: '#112233' } } })
    expect(getComputedStyle(screen.getByText('Body')).color).toBe(hexToRgb('#112233'))
  })

  it('an override of a new name also changes the old one', () => {
    const theme = themeFrom({ colorScheme: 'light', theme: { colors: { foreground: '#112233' } } })
    expect(theme.colors.textPrimary).toBe('#112233')
  })

  it('when both names are overridden, the new one wins', () => {
    const theme = themeFrom({ colorScheme: 'light', theme: { colors: { foreground: '#000001', textPrimary: '#000002' } } })
    expect([theme.colors.foreground, theme.colors.textPrimary]).toEqual(['#000001', '#000001'])
  })
})

describe('style props use the tokens', () => {
  const resolve = (props: Parameters<typeof useCommonStyles>[0]) =>
    renderHook(() => useCommonStyles(props), {
      wrapper: ({ children }: { children: ReactNode }) => <ThemeProvider colorScheme='light'>{children}</ThemeProvider>,
    }).result.current

  it('border widths by name or number', () => {
    expect(resolve({ borderWidth: 'thin', borderTopWidth: 'medium', borderLeftWidth: 3 })).toEqual({
      borderWidth: 1,
      borderTopWidth: 2,
      borderLeftWidth: 3,
    })
  })

  it('shadow levels, which shadow* props can adjust', () => {
    expect(resolve({ shadow: 'md' })).toEqual(lightTheme.shadow.md)
    expect(resolve({ shadow: 'lg', shadowOpacity: 0.3 })).toEqual({ ...lightTheme.shadow.lg, shadowOpacity: 0.3 })
  })
})

describe('components', () => {
  it('Text: a size brings its line height; theme color names work', () => {
    renderWithTheme(
      <>
        <Text size='3xl'>Heading</Text>
        <Text color='danger'>Error</Text>
        <Text fontSize={48}>Big</Text>
      </>,
    )
    const heading = getComputedStyle(screen.getByText('Heading'))
    expect([heading.fontSize, heading.lineHeight]).toEqual(['30px', '36px'])
    expect(getComputedStyle(screen.getByText('Error')).color).toBe(hexToRgb(lightTheme.colors.danger))
    // A custom size gets a line height that fits it instead of the variant's 24.
    expect(getComputedStyle(screen.getByText('Big')).lineHeight).toBe('67px')
  })

  it('Text: title is semibold on the 2xl step', () => {
    renderWithTheme(<Text variant='title'>Title</Text>)
    const title = getComputedStyle(screen.getByText('Title'))
    expect([title.fontSize, title.lineHeight, title.fontWeight]).toEqual(['24px', '32px', '600'])
  })

  it('Button: every variant uses its semantic colors; disabled is half opacity', () => {
    renderWithTheme(
      <>
        <Button label='Solid' />
        <Button label='Secondary' variant='secondary' />
        <Button label='Off' disabled />
      </>,
    )
    const { colors } = lightTheme
    const solid = getComputedStyle(screen.getByRole('button', { name: 'Solid' }))
    expect([solid.backgroundColor, solid.borderTopLeftRadius]).toEqual([hexToRgb(colors.primary), '8px'])
    expect(getComputedStyle(screen.getByText('Solid')).color).toBe(hexToRgb(colors.primaryForeground))
    expect(getComputedStyle(screen.getByRole('button', { name: 'Secondary' })).backgroundColor).toBe(hexToRgb(colors.secondary))
    expect(getComputedStyle(screen.getByRole('button', { name: 'Off' })).opacity).toBe('0.5')
  })

  it('Input: the edge uses `input`, and `invalid` shows a danger edge and aria-invalid', () => {
    renderWithTheme(
      <>
        <Input placeholder='Name' />
        <Input placeholder='Email' invalid />
      </>,
    )
    const edge = (placeholder: string) => getComputedStyle(screen.getByPlaceholderText(placeholder).parentElement as HTMLElement).borderTopColor
    expect(edge('Name')).toBe(hexToRgb(lightTheme.colors.input))
    expect(edge('Email')).toBe(hexToRgb(lightTheme.colors.danger))
    expect(screen.getByPlaceholderText('Email').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByPlaceholderText('Name').hasAttribute('aria-invalid')).toBe(false)
  })

  it('Input: sizes follow the control heights', () => {
    renderWithTheme(
      <>
        <Input placeholder='sm' size='sm' />
        <Input placeholder='xl' size='xl' />
      </>,
    )
    const height = (placeholder: string) => getComputedStyle(screen.getByPlaceholderText(placeholder).parentElement as HTMLElement).minHeight
    expect([height('sm'), height('xl')]).toEqual(['32px', '56px'])
  })

  it('Select: the selected option is marked by a checkmark as well as its color', () => {
    renderWithTheme(<Select label='Plan' options={[{ label: 'Pro', value: 'pro' }, { label: 'Team', value: 'team' }]} value='pro' />)
    fireEvent.click(screen.getByText('Pro'))
    expect(screen.getByRole('radio', { name: 'Pro' }).textContent).toBe('Pro✓')
    expect(screen.getByRole('radio', { name: 'Team' }).textContent).toBe('Team')
  })

  it('Checkbox: an unchecked box is drawn with the 3:1 `input` color', () => {
    renderWithTheme(<Checkbox label='Terms' />)
    const box = screen.getByRole('checkbox').firstElementChild?.firstElementChild as HTMLElement
    expect(getComputedStyle(box).borderTopColor).toBe(hexToRgb(lightTheme.colors.input))
  })
})

describe('keyboard focus ring (web)', () => {
  const ring = hexToRgb(lightTheme.colors.ring)

  it('shows after keyboard focus, not after a click', ({ task, skip }) => {
    // iOS and Android draw their own focus indicators.
    if (task.file.projectName !== 'web') skip()
    renderWithTheme(
      <>
        <Button label='Save' />
        <Checkbox label='Terms' />
      </>,
    )
    const button = screen.getByRole('button', { name: 'Save' })
    const checkbox = screen.getByRole('checkbox', { name: 'Terms' })

    for (const element of [button, checkbox]) {
      fireEvent.keyDown(document.body, { key: 'Tab' })
      act(() => element.focus())
      expect([element.style.outlineStyle, element.style.outlineColor]).toEqual(['solid', ring])
      act(() => element.blur())
      expect(element.style.outlineStyle).toBe('')

      fireEvent.mouseDown(element)
      act(() => element.focus())
      expect(element.style.outlineStyle).toBe('')
      act(() => element.blur())
    }
  })
})

describe('reduced motion', () => {
  it('useReducedMotion follows the system setting', async () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    setReducedMotion(true)
    await waitFor(() => expect(result.current).toBe(true))
    setReducedMotion(false)
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('Select opens its menu without the fade when motion is reduced', async () => {
    setReducedMotion(true)
    renderWithTheme(<Select label='Plan' options={[{ label: 'Pro', value: 'pro' }]} />)
    await act(async () => {}) // the setting is read asynchronously

    fireEvent.click(screen.getByText('Select an option'))
    // No finishModalAnimations(): there is no fade to wait for.
    expect(screen.getByRole('dialog', { name: 'Plan' })).toBeTruthy()
  })
})
