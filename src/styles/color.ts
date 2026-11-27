import type { Theme, ThemeColors } from './theme'

/** A theme color name ('foregroundMuted', 'danger', …) becomes that color; anything else is kept. */
export const resolveColor = (color: string, theme: Theme): string =>
  Object.prototype.hasOwnProperty.call(theme.colors, color) ? theme.colors[color as keyof ThemeColors] : color

/** The status tones shared by Badge and Progress (and later Alert and Toast). */
export type Tone = 'neutral' | 'danger' | 'success' | 'warning' | 'info'

/** A tone's color and the color of text placed on it. Neutral is the primary color. */
export const toneColors = (tone: Tone, theme: Theme): { color: string; foreground: string } => {
  const { colors } = theme
  if (tone === 'neutral') return { color: colors.primary, foreground: colors.primaryForeground }
  return { color: colors[tone], foreground: colors[`${tone}Foreground`] }
}
