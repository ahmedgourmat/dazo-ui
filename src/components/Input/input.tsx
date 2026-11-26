import { useState, type JSX } from 'react'
import { StyleSheet, TextInput, View, type TextStyle } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import type { InputProps } from './input.type'
import { useInputStyles } from './input.hooks'

export const Input = ({
  ref,
  value,
  textColor,
  onChangeText,
  variant = 'outline',
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  placeholderTextColor,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: InputProps): JSX.Element => {
  // Style props (padding, width, backgroundColor, …) style the field's box;
  // only the remaining TextInput props go to the TextInput.
  const [styleProps, nativeProps] = splitCommonProps(rest)
  const commonStyles = useCommonStyles(styleProps)
  const selectedVariant = useInputStyles({ variant, editable, textColor })
  const [focused, setFocused] = useState(false)

  const handleFocus: NonNullable<InputProps['onFocus']> = (event) => {
    setFocused(true)
    onFocus?.(event)
  }
  const handleBlur: NonNullable<InputProps['onBlur']> = (event) => {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <View
      style={[
        styles.container,
        selectedVariant.container,
        { opacity: editable ? 1 : 0.7 },
        commonStyles,
        style,
        // Last, so a custom `style` can't hide which field has focus.
        focused && selectedVariant.focusRing,
      ]}
    >
      {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

      <TextInput
        {...nativeProps}
        ref={ref}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={placeholderTextColor ?? selectedVariant.placeholderColor}
        style={[
          styles.input,
          styles.noFocusRing,
          selectedVariant.input,
          inputStyle,
        ]}
      />

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 0,
    fontSize: 15,
  },
  // The browser's own ring would sit tightly around the bare text box inside the
  // field; the container draws focusRing around the whole field instead.
  // It must be outline-style none: Chrome's default ring ignores outline-width.
  // React Native's types don't list 'none', but react-native-web passes it to CSS.
  noFocusRing: {
    outlineStyle: 'none',
  } as unknown as TextStyle,
  leftIcon: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})