import type { Ref } from 'react'
import type { View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { Tone } from '../../styles/color'

export interface ProgressProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The track's View. */
  ref?: Ref<View>
  testID?: string
  /** How much is done, from 0 to `max`. Leave it out when the progress isn't known: the bar then moves back and forth. */
  value?: number
  /** Default 100. */
  max?: number
  /** What screen readers announce, e.g. "Uploading photo". */
  label?: string
  /** Bar color. Default neutral (the primary color). */
  tone?: Tone
  /** sm 4 high · md 8 high. Default md. */
  size?: 'sm' | 'md'
}
