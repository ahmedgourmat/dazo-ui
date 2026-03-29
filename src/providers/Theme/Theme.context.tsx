import { createContext, useContext } from 'react'
import { lightTheme, type Theme } from '../../styles/theme'

// the context — defaulting to lightTheme so it's never undefined
export const ThemeContext = createContext<Theme>(lightTheme)

// the hook every component will call
export const useTheme = (): Theme => {
  return useContext(ThemeContext)

}