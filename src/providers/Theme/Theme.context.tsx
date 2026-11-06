import { createContext, useContext, type Context } from 'react'
import { lightTheme, type Theme } from '../../styles/theme'

// the context — defaulting to lightTheme so it's never undefined
export const ThemeContext: Context<Theme> = createContext<Theme>(lightTheme)

// the hook every component will call
export const useTheme = (): Theme => {
  return useContext(ThemeContext)

}