import { useMemo, type JSX } from 'react'
import { useColorScheme } from 'react-native'
import { buildTheme, darkTheme, lightTheme, type Theme, type ThemeAccent, type ThemeMode } from '../../styles/theme'
import { ThemeContext } from './Theme.context'
import { mergeTheme, type DeepPartial } from './mergeTheme'

type ThemeProviderProps = {
  children: React.ReactNode
  // consumer can override any part of the theme
  theme?: DeepPartial<Theme>
  // consumer can force a mode instead of following device setting
  colorScheme?: 'light' | 'dark' | 'system'
  /**
   * Color for primary actions, selected states and focus rings: 'blue',
   * 'green', 'violet', 'orange' or your own shades ({ 50, 200, 400, 600, 700 }).
   * Surfaces and text stay neutral. Default: 'neutral' (monochrome).
   */
  accent?: ThemeAccent
}

// Built-in accents are built once per mode and shared.
const builtThemes = new Map<string, Theme>()
const baseTheme = (mode: ThemeMode, accent: ThemeAccent): Theme => {
  if (accent === 'neutral') return mode === 'dark' ? darkTheme : lightTheme
  if (typeof accent !== 'string') return buildTheme(mode, accent)
  const key = `${mode}:${accent}`
  let theme = builtThemes.get(key)
  if (!theme) {
    theme = buildTheme(mode, accent)
    builtThemes.set(key, theme)
  }
  return theme
}

export const ThemeProvider = ({
  children,
  theme: overrides,
  colorScheme = 'system',
  accent = 'neutral',
}: ThemeProviderProps): JSX.Element => {
  const deviceScheme = useColorScheme()

  const resolvedTheme = useMemo(() => {
    // decide which base theme to use
    const isDark =
      colorScheme === 'dark' ||
      (colorScheme === 'system' && deviceScheme === 'dark')

    const base = baseTheme(isDark ? 'dark' : 'light', accent)

    // if consumer passed overrides, deep merge them on top of the base
    if (!overrides) return base

    // Every section (colors, spacing, radius, fontSize, …, and any you add)
    // keeps the values you don't override.
    return mergeTheme(base, overrides)
  }, [deviceScheme, colorScheme, overrides, accent])

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  )
}
