import type { ReactNode, Ref } from 'react'
import type { View } from 'react-native'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { FontSizeKey } from '../../styles/tokens'

export interface SkeletonProps extends Omit<CommonProps, 'children' | 'scrollable'> {
  /** The wrapper's View, or the block's. */
  ref?: Ref<View>
  testID?: string
  /**
   * Your real screen. While `loading`, every dazo-ui component inside draws a
   * placeholder in its own size and shape; when it turns false, the content
   * appears in the same place. Without children, Skeleton is a single block.
   */
  children?: ReactNode
  /** With children: whether they show as placeholders. Default true. */
  loading?: boolean
  /** What screen readers announce while loading. Default "Loading". */
  label?: string
  /** Block: a circle of this diameter. */
  circle?: boolean
  /** Block with `circle`: the diameter. Default 40. */
  size?: number
  /** Block: this many text lines (the last one shorter). */
  lines?: number
  /** Block with `lines`: the text size the lines stand for. Default base. */
  textSize?: FontSizeKey
}
