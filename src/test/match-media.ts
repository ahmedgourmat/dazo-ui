// jsdom has no window.matchMedia. react-native-web creates one
// "(prefers-color-scheme: dark)" query the moment it loads, and reads `.matches`
// whenever useColorScheme() renders. So this file must run before anything
// imports react-native-web: it is the first import in test/setup.ts, and it
// imports nothing itself.

export type Scheme = 'light' | 'dark'
type Listener = (event: { matches: boolean }) => void

let systemScheme: Scheme = 'light'
const listeners = new Set<Listener>()
const DARK_QUERY = '(prefers-color-scheme: dark)'

const darkQuery = {
  media: DARK_QUERY,
  get matches(): boolean {
    return systemScheme === 'dark'
  },
  onchange: null,
  addListener: (listener: Listener): void => {
    listeners.add(listener)
  },
  removeListener: (listener: Listener): void => {
    listeners.delete(listener)
  },
  addEventListener: (_type: string, listener: Listener): void => {
    listeners.add(listener)
  },
  removeEventListener: (_type: string, listener: Listener): void => {
    listeners.delete(listener)
  },
  dispatchEvent: (): boolean => false,
}

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => (query === DARK_QUERY ? darkQuery : { ...darkQuery, media: query, matches: false }),
})

/** Change the fake OS setting and notify react-native-web. Wrap in act() when components are mounted. */
export const changeSystemScheme = (scheme: Scheme): void => {
  systemScheme = scheme
  listeners.forEach((listener) => listener({ matches: scheme === 'dark' }))
}

export const resetSystemColorScheme = (): void => {
  systemScheme = 'light'
}
