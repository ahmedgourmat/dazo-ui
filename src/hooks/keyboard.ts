import { Platform } from 'react-native'

type KeyEventLike = { key: string; preventDefault: () => void }

/**
 * Props that make the Space key activate a checkbox or radio on web.
 *
 * react-native-web activates any Pressable with Enter, but only buttons with
 * Space, while ARIA expects Space to toggle checkboxes and pick radios too.
 * Spread the result onto those Pressables. It returns nothing on iOS and
 * Android, where there is no such key event (screen readers activate controls
 * directly), and nothing while disabled.
 */
export const spaceKeyActivates = (onActivate: () => void, disabled = false): object => {
  if (Platform.OS !== 'web' || disabled) return {}
  return {
    onKeyDown: (event: KeyEventLike) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault() // stop the page from scrolling
        onActivate()
      }
    },
  }
}
