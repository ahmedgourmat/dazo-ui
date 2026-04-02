import { StyleSheet, TextInput, View } from 'react-native'
import { useCommonStyles } from 'hooks/common.hooks'
import type { InputProps } from './input.type'
import { useInputStyles } from './input.hooks'

export const Input = ({
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
  ...commonAndNativeProps
}: InputProps) => {
  const commonStyles = useCommonStyles(commonAndNativeProps)
  const selectedVariant = useInputStyles({ variant, editable, textColor })

  return (
    <View
      style={[
        styles.container,
        selectedVariant.container,
        { opacity: editable ? 1 : 0.7 },
        commonStyles,
        style,
      ]}
    >
      {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

      <TextInput
        {...commonAndNativeProps}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
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
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 0,
  },
  noFocusRing: {
    outlineStyle: 'none',
  } as any,
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