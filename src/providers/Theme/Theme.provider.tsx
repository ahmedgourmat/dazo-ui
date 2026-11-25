import { useMemo, type JSX } from 'react'
import { useColorScheme } from 'react-native'
import { lightTheme, darkTheme, type Theme } from '../../styles/theme'
import { ThemeContext } from './Theme.context'
import { mergeTheme, type DeepPartial } from './mergeTheme'

type ThemeProviderProps = {
  children: React.ReactNode
  // consumer can override any part of the theme
  theme?: DeepPartial<Theme>
  // consumer can force a mode instead of following device setting
  colorScheme?: 'light' | 'dark' | 'system'
}


export const ThemeProvider = ({
  children,
  theme: overrides,
  colorScheme = 'system',
}: ThemeProviderProps): JSX.Element => {
  const deviceScheme = useColorScheme()

  const resolvedTheme = useMemo(() => {
    // decide which base theme to use
    const isDark =
      colorScheme === 'dark' ||
      (colorScheme === 'system' && deviceScheme === 'dark')

    const base = isDark ? darkTheme : lightTheme

    // if consumer passed overrides, deep merge them on top of the base
    if (!overrides) return base

    // Every section (colors, spacing, radius, fontSize, fontWeight, fontFamily,
    // lineHeight, and any you add) keeps the values you don't override.
    return mergeTheme(base, overrides)
  }, [deviceScheme, colorScheme, overrides])

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  )
}