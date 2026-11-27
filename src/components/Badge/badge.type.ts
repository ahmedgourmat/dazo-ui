import type { ReactNode, Ref } from 'react'
import type { StyleProp, TextStyle, View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { Tone } from '../../styles/color'

export interface BadgeProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The badge's View. */
  ref?: Ref<View>
  testID?: string
  /** The label: usually a short text such as "New" or "3". */
  children: ReactNode
  /** What the badge means: neutral · danger · success · warning · info. Default neutral. */
  tone?: Tone
  /**
   * solid: filled with the tone's color (default).
   * subtle: muted surface, with a dot in the tone's color.
   * outline: bordered, with a dot in the tone's color.
   */
  variant?: 'solid' | 'subtle' | 'outline'
  /** sm 20 high · md 24 high. Default md. */
  size?: 'sm' | 'md'
  /** Shown before the label, in place of the dot. */
  icon?: ReactNode
  labelStyle?: StyleProp<TextStyle>
}
