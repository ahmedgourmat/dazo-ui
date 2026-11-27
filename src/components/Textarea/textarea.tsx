import { useId, useState, type JSX } from 'react'
import { StyleSheet, Text, TextInput, View, type TextStyle } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import { useControllableState } from '../../hooks/controllable'
import { useTheme } from '../../providers'
import { useInputStyles } from '../Input/input.hooks'
import type { TextareaProps } from './textarea.type'

// The line height that matches each size's text (Input: sm 14, md/lg 16, xl 18).
const LINE_STEP = { sm: 'sm', md: 'base', lg: 'base', xl: 'lg' } as const

export const Textarea = ({
  ref,
  value,
  defaultValue,
  onChangeText,
  textColor,
  variant = 'outline',
  size = 'md',
  invalid = false,
  rows = 3,
  maxRows,
  showCount = false,
  maxLength,
  style,
  inputStyle,
  placeholderTextColor,
  editable = true,
  onFocus,
  onBlur,
  onContentSizeChange,
  ...rest
}: TextareaProps): JSX.Element => {
  // Style props (padding, width, margin, …) style the field's box;
  // only the remaining TextInput props go to the TextInput.
  const [styleProps, nativeProps] = splitCommonProps(rest)
  const commonStyles = useCommonStyles(styleProps)
  const theme = useTheme()
  const field = useInputStyles({ variant, size, editable, invalid, textColor })
  const [focused, setFocused] = useState(false)
  const [text, setText] = useControllableState(value, defaultValue ?? '', onChangeText)
  const countId = useId()

  // Between `rows` and `maxRows` lines the field follows its text, then scrolls.
  const lineHeight = theme.leading[LINE_STEP[size]]
  const minHeight = rows * lineHeight
  const maxHeight = Math.max(rows, maxRows ?? rows) * lineHeight
  const [contentHeight, setContentHeight] = useState(minHeight)
  const height = Math.min(maxHeight, Math.max(minHeight, contentHeight))

  return (
    <View
      style={[
        field.container,
        styles.box,
        { paddingVertical: theme.space[2] },
        commonStyles,
        style,
        // Last, so a custom `style` can't hide which field has focus.
        focused && field.focusRing,
      ]}
    >
      <TextInput
        {...nativeProps}
        ref={ref}
        multiline
        // The rows of the <textarea> on web, and the minimum lines on Android.
        numberOfLines={rows}
        value={text}
        onChangeText={setText}
        maxLength={maxLength}
        editable={editable}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onContentSizeChange={(event) => {
          setContentHeight(event.nativeEvent.contentSize.height)
          onContentSizeChange?.(event)
        }}
        placeholderTextColor={placeholderTextColor ?? field.placeholderColor}
        // The count is the field's description on web. React Native's types
        // don't list aria-describedby, and iOS and Android ignore it.
        {...(showCount ? ({ 'aria-describedby': countId } as object) : null)}
        {...(invalid ? ({ 'aria-invalid': true } as object) : null)}
        style={[
          field.input,
          styles.input,
          styles.noFocusRing,
          { lineHeight, height, minHeight: undefined },
          inputStyle,
        ]}
      />
      {showCount ? (
        <Text
          nativeID={countId}
          style={{
            alignSelf: 'flex-end',
            marginTop: theme.space[1],
            color: maxLength !== undefined && text.length >= maxLength ? theme.colors.danger : theme.colors.foregroundMuted,
            fontSize: theme.fontSize.xs,
            lineHeight: theme.leading.xs,
            fontFamily: theme.fontFamily.regular,
          }}
        >
          {maxLength !== undefined ? `${text.length} / ${maxLength}` : text.length}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    // Android centers multiline text unless told otherwise.
    textAlignVertical: 'top',
  },
  // The field's box draws the focus ring instead of the browser (see Input).
  noFocusRing: {
    outlineStyle: 'none',
  } as unknown as TextStyle,
})
