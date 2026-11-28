import type { JSX } from 'react'
import { StyleSheet, Text as RNText } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import type { TextProps } from './text.type'
import { useTextContent, useTextStyles } from './text.hooks'
import { HIDDEN_TEXT, SkeletonBox } from '../Skeleton/skeleton-box'
import { withSkeleton } from '../Skeleton/with-skeleton'
import { useTheme } from '../../providers'

const TextBase = ({
  ref,
  testID,
  children,
  variant = 'default',
  size,
  color,
  fontSize,
  fontWeight,
  fontFamily,
  fontStyle,
  lineHeight,
  textAlign,
  textTransform,
  textDecorationLine,
  letterSpacing,
  lines,
  letters,
  style,
  ...commonProps
}: TextProps): JSX.Element => {

  const commonStyles = useCommonStyles(commonProps)
  const computedTextStyle = useTextStyles({
    variant,
    size,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    fontStyle,
    lineHeight,
    textAlign,
    textTransform,
    textDecorationLine,
    letterSpacing,
  })
  const { displayText, numberOfLines } = useTextContent({
    children,
    lines,
    letters,
  })

  return (
    <RNText
      ref={ref}
      testID={testID}
      style={[styles.base, commonStyles, computedTextStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode='tail'
    >
      {displayText}
    </RNText>
  )
}


const styles = StyleSheet.create({
  base: {},
  skeleton: {
    alignSelf: 'flex-start',
  },
})

// Inside <Skeleton loading>: a block as big as the text, which stays invisible
// inside it. Pass placeholder text while the real text loads.
const TextSkeleton = (props: TextProps): JSX.Element => {
  const theme = useTheme()
  const textStyle = useTextStyles(props)
  const { displayText, numberOfLines } = useTextContent(props)
  const commonStyles = useCommonStyles(splitCommonProps(props)[0])

  return (
    <SkeletonBox style={[styles.skeleton, { borderRadius: theme.radius.sm }, commonStyles]}>
      <RNText style={[textStyle, props.style, HIDDEN_TEXT]} numberOfLines={numberOfLines}>
        {displayText}
      </RNText>
    </SkeletonBox>
  )
}

export const Text: (props: TextProps) => JSX.Element = withSkeleton(TextBase, TextSkeleton)
