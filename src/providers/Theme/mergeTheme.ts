import { COLOR_ALIASES, FONT_SIZE_ALIASES, syncAliases, type Theme } from '../../styles/theme'

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
 * An override of a deprecated name (colors.textPrimary, fontSize.md, …) also
 * applies to the name that replaced it, unless that one is overridden too.
 * Components read the new names, so old overrides keep working.
 */
const liftAliases = (
  section: Record<string, unknown> | undefined,
  aliases: Readonly<Record<string, string>>,
): Record<string, unknown> | undefined => {
  if (!section) return section
  const lifted = { ...section }
  for (const [alias, name] of Object.entries(aliases)) {
    if (lifted[alias] !== undefined && lifted[name] === undefined) lifted[name] = lifted[alias]
  }
  return lifted
}

const liftOverrides = (overrides: DeepPartial<Theme>): DeepPartial<Theme> => {
  const fontFamily = overrides.fontFamily
  return {
    ...overrides,
    colors: liftAliases(overrides.colors, COLOR_ALIASES),
    fontSize: liftAliases(overrides.fontSize, FONT_SIZE_ALIASES),
    leading: liftAliases(overrides.leading, FONT_SIZE_ALIASES),
    // semibold is newer than the other weights: apps that load their own
    // font files set regular/medium/bold, and headings now use semibold.
    // Until semibold gets its own family, it uses the bold one.
    fontFamily: fontFamily?.bold !== undefined && fontFamily.semibold === undefined
      ? { ...fontFamily, semibold: fontFamily.bold }
      : fontFamily,
  } as DeepPartial<Theme>
}

/**
 * Returns a copy of `base` with `overrides` merged in at every level, so
 * `{ radius: { md: 6 } }` changes only radius.md and keeps the other radii.
 * Sections and keys that aren't in the base theme are added. `undefined`
 * values are skipped, so they never erase a base value. `base` is not changed.
 * Deprecated names (colors.textPrimary, …) always end up equal to the names
 * that replaced them, whichever of the two was overridden.
 */
export const mergeTheme = (base: Theme, overrides: DeepPartial<Theme>): Theme =>
  syncAliases(merge(base, liftOverrides(overrides)) as Theme)
