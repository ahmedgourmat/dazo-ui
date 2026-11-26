import type { ViewStyle } from 'react-native'
import type { Theme } from './theme'

/** How every disabled control is shown: the same look, at half opacity. */
export const DISABLED_OPACITY = 0.5

/** The keyboard focus ring: 2px in the theme's `ring` color, 2px outside the element. */
export const focusRing = (theme: Theme): ViewStyle => ({
  outlineColor: theme.colors.ring,
  outlineStyle: 'solid',
  outlineWidth: 2,
  outlineOffset: 2,
})

/**
 * Pressable's style callback state. React Native passes only `pressed`;
 * react-native-web also passes `hovered` and `focused`, so hover styles
 * apply on web and never on touch screens.
 */
export type InteractionState = { pressed: boolean; hovered?: boolean; focused?: boolean }
