import type { Theme } from '../../styles/theme'

/** Every property optional, at every level: what ThemeProvider's `theme` prop accepts. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const merge = (base: unknown, overrides: unknown): unknown => {
  if (overrides === undefined) return base
  if (!isPlainObject(base) || !isPlainObject(overrides)) return overrides

  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    result[key] = merge(base[key], value)
  }
  return result
}

/**
 * Returns a copy of `base` with `overrides` merged in at every level, so
 * `{ radius: { md: 6 } }` changes only radius.md and keeps sm, lg and full.
 * Sections and keys that aren't in the base theme are added. `undefined`
 * values are skipped, so they never erase a base value. `base` is not changed.
 */
export const mergeTheme = (base: Theme, overrides: DeepPartial<Theme>): Theme => merge(base, overrides) as Theme
