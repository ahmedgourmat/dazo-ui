import { useMemo } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../providers'
import { DISABLED_OPACITY } from '../../styles/interaction'

export type CheckboxStyles = {
  boxStyle: ViewStyle
  checkmarkStyle: TextStyle
}
import type { CheckboxProps } from './checkbox.type'

type UseCheckboxStylesParams = Pick<
  CheckboxProps,
  'checked' | 'disabled' | 'checkedColor' | 'uncheckedColor' | 'checkmarkColor' | 'checkboxSize'
>

export const useCheckboxStyles = ({
  checked = false,
  disabled = false,
  checkedColor,
  uncheckedColor,
  checkmarkColor,
  checkboxSize = 20,
}: UseCheckboxStylesParams): CheckboxStyles => {
  const theme = useTheme()

  return useMemo(() => {
    const baseBoxStyle: ViewStyle = {
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: theme.radius.sm,
      borderWidth: theme.borderWidth.thin,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: checked
        ? checkedColor || theme.colors.primary
        : uncheckedColor || theme.colors.surface,
      // `input` has 3:1 contrast, so an unchecked box is still easy to see.
      borderColor: checked
        ? checkedColor || theme.colors.primary
        : theme.colors.input,
      opacity: disabled ? DISABLED_OPACITY : 1,
    }

    const checkmarkStyle: TextStyle = {
      color: checkmarkColor || theme.colors.primaryForeground,
      fontSize: checkboxSize * 0.65,
      lineHeight: checkboxSize * 0.8,
      fontWeight: theme.fontWeight.bold,
    }

    return {
      boxStyle: baseBoxStyle,
      checkmarkStyle,
    }
  }, [checked, disabled, checkedColor, uncheckedColor, checkmarkColor, checkboxSize, theme])
}

type UseCheckboxLabelStylesParams = Pick<CheckboxProps, 'disabled' | 'textColor'>

export const useCheckboxLabelStyles = ({
  disabled = false,
  textColor,
}: UseCheckboxLabelStylesParams): TextStyle => {
  const theme = useTheme()

  return useMemo(() => {
    return {
      color: textColor || theme.colors.foreground,
      opacity: disabled ? DISABLED_OPACITY : 1,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.base,
      lineHeight: theme.leading.base,
    }
  }, [disabled, textColor, theme])
}
