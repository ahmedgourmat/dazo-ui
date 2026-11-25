// Must stay the first import: it installs window.matchMedia before react-native-web loads.
import { resetSystemColorScheme } from './match-media'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount everything rendered by the previous test and reset the fake OS setting.
afterEach(() => {
  cleanup()
  resetSystemColorScheme()
})
