import { StyleSheet, Text as RNText } from 'react-native'
import { useCommonStyles } from 'hooks/common.hooks'
import type { TextProps } from './text.type'
import { useTextContent, useTextStyles } from './text.hooks'

export const Text = ({
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
}: TextProps) => {

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
      style={[styles.base, commonStyles, computedTextStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode='tail'
    >
      {displayText}
    </RNText>
  )
}

export default Text

const styles = StyleSheet.create({
  base: {},
})