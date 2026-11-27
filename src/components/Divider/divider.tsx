import type { JSX } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import { resolveColor } from '../../styles/color'
import type { DividerProps } from './divider.type'

export const Divider = ({
  ref,
  testID,
  orientation = 'horizontal',
  label,
  decorative = false,
  color = 'border',
  style,
  labelStyle,
  ...commonProps
}: DividerProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const vertical = orientation === 'vertical'
  const line: ViewStyle = vertical
    ? { width: theme.borderWidth.thin, backgroundColor: resolveColor(color, theme) }
    : { height: theme.borderWidth.thin, backgroundColor: resolveColor(color, theme) }

  if (label && !vertical) {
    // The text is what screen readers read; the lines around it only decorate.
    return (
      <View ref={ref} testID={testID} style={[styles.labelled, { gap: theme.space[3] }, commonStyles, style]}>
        <View aria-hidden style={[styles.grow, line]} />
        <Text
          style={[
            {
              color: theme.colors.foregroundMuted,
              fontSize: theme.fontSize.sm,
              lineHeight: theme.leading.sm,
              fontFamily: theme.fontFamily.regular,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
        <View aria-hidden style={[styles.grow, line]} />
      </View>
    )
  }

  // React Native's types don't list aria-orientation; react-native-web passes it on.
  const semantics = decorative
    ? { 'aria-hidden': true }
    : { role: 'separator', 'aria-orientation': orientation }

  return (
    <View
      ref={ref}
      testID={testID}
      {...(semantics as object)}
      style={[styles.line, line, commonStyles, style]}
    />
  )
}

const styles = StyleSheet.create({
  line: {
    alignSelf: 'stretch',
  },
  labelled: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  grow: {
    flex: 1,
  },
})
