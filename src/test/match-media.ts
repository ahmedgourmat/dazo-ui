// jsdom has no window.matchMedia. react-native-web creates its
// "(prefers-color-scheme: dark)" and "(prefers-reduced-motion: reduce)" queries
// the moment it loads, and reads `.matches` whenever it needs them. So this
// file must run before anything imports react-native-web: it is the first
// import in test/setup.ts, and it imports nothing itself.

export type Scheme = 'light' | 'dark'
type Listener = (event: { matches: boolean }) => void

/** A fake OS setting behind one media query, with the listeners react-native-web adds. */
const fakeQuery = (media: string) => {
  let matches = false
  const listeners = new Set<Listener>()
  const query = {
    media,
    get matches(): boolean {
      return matches
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
  const set = (next: boolean): void => {
    matches = next
    listeners.forEach((listener) => listener({ matches: next }))
  }
  const reset = (): void => {
    matches = false
  }
  return { query, set, reset }
}

const dark = fakeQuery('(prefers-color-scheme: dark)')
const reducedMotion = fakeQuery('(prefers-reduced-motion: reduce)')
const queries = new Map([dark, reducedMotion].map((fake) => [fake.query.media, fake.query]))

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (media: string) => queries.get(media) ?? fakeQuery(media).query,
})

/** Change the fake OS setting and notify react-native-web. Wrap in act() when components are mounted. */
export const changeSystemScheme = (scheme: Scheme): void => dark.set(scheme === 'dark')

/** Turn the fake OS "reduce motion" setting on or off. Wrap in act() when components are mounted. */
export const changeReducedMotion = (reduce: boolean): void => reducedMotion.set(reduce)

/** Back to the defaults (light, motion allowed) without notifying anyone. */
export const resetSystemColorScheme = (): void => {
  dark.reset()
  reducedMotion.reset()
}
