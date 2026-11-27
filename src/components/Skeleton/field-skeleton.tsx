import type { JSX } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import { SkeletonBox } from './skeleton-box'

/**
 * The placeholder of a field (Input, Textarea, Select, FileInput): its box,
 * at the height the field would have, with the field's style props.
 */
export const FieldSkeleton = ({
  props,
  height,
}: {
  props: object & { style?: StyleProp<ViewStyle> }
  height: number
}): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])

  return <SkeletonBox style={[{ minHeight: height, borderRadius: theme.radius.md }, commonStyles, props.style]} />
}
