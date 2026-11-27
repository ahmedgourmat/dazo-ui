import type { Ref } from 'react'
import type { StyleProp, TextStyle, View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'

export interface AvatarProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The avatar's View. */
  ref?: Ref<View>
  testID?: string
  /**
   * The person's name. It names the avatar for screen readers, and its first
   * letters are shown when there is no image ("Ada Lovelace" → "AL").
   * Without a name the avatar is decorative and hidden from screen readers.
   */
  name?: string
  /** Image URL. If it is missing or fails to load, the initials are shown. */
  src?: string
  /** xs 24 · sm 32 · md 40 · lg 48 · xl 64. Default md. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Default circle. */
  shape?: 'circle' | 'rounded'
  labelStyle?: StyleProp<TextStyle>
}
