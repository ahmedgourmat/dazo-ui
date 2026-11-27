import { useState, type JSX } from 'react'
import { StyleSheet, TextInput, View, type TextStyle } from 'react-native'
import { splitCommonProps, useCommonStyles } from '../../hooks/common.hooks'
import type { InputProps } from './input.type'
import { formFieldProps, useFormField } from '../FormField/form-field.context'
import { useInputStyles } from './input.hooks'
import { FieldSkeleton } from '../Skeleton/field-skeleton'
import { withSkeleton } from '../Skeleton/with-skeleton'
import { useTheme } from '../../providers'

const InputBase = ({
  ref,
  value,
  textColor,
  onChangeText,
  variant = 'outline',
  size = 'md',
  invalid: invalidProp = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  placeholderTextColor,
  editable: editableProp = true,
  onFocus,
  onBlur,
  ...rest
}: InputProps): JSX.Element => {
  // Style props (padding, width, backgroundColor, …) style the field's box;
  // only the remaining TextInput props go to the TextInput.
  const [styleProps, nativeProps] = splitCommonProps(rest)
  // A FormField around the input can mark it invalid or disabled too.
  const formField = useFormField()
  const invalid = invalidProp || Boolean(formField?.invalid)
  const editable = editableProp && !formField?.disabled
  const commonStyles = useCommonStyles(styleProps)
  const selectedVariant = useInputStyles({ variant, size, editable, invalid, textColor })
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
        // react-native-web puts this on the <input>; React Native's types
        // don't list it, and iOS and Android ignore it.
        {...(invalid ? { 'aria-invalid': true } as object : null)}
        {...formFieldProps(formField, 'text')}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  // The browser's own ring would sit tightly around the bare text box inside the
  // field; the container draws focusRing around the whole field instead.
  // It must be outline-style none: Chrome's default ring ignores outline-width.
  // React Native's types don't list 'none', but react-native-web passes it to CSS.
  noFocusRing: {
    outlineStyle: 'none',
  } as unknown as TextStyle,
  leftIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

// Inside <Skeleton loading>: the field's box at its height.
const InputSkeleton = (props: InputProps): JSX.Element => {
  const theme = useTheme()
  return <FieldSkeleton props={props} height={theme.controlHeight[props.size ?? 'md']} />
}

export const Input: (props: InputProps) => JSX.Element = withSkeleton(InputBase, InputSkeleton)
