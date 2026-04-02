import { useMemo } from 'react'
import { useTheme } from '../../providers'
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
}: UseCheckboxStylesParams) => {
  const theme = useTheme()

  return useMemo(() => {
    const baseBoxStyle = {
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: checked
        ? checkedColor || theme.colors.primary
        : uncheckedColor || 'transparent',
      borderColor: checked
        ? checkedColor || theme.colors.primary
        : disabled
          ? theme.colors.textDisabled
          : theme.colors.textSecondary,
      opacity: disabled ? 0.5 : 1,
    }

    const checkmarkStyle = {
      color: checkmarkColor || theme.colors.textInverse,
      fontSize: checkboxSize * 0.65,
      fontWeight: '700' as const,
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
}: UseCheckboxLabelStylesParams) => {
  const theme = useTheme()

  return useMemo(() => {
    return {
      color: textColor || theme.colors.textPrimary,
      opacity: disabled ? 0.5 : 1,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.md,
    }
  }, [disabled, textColor, theme])
}
