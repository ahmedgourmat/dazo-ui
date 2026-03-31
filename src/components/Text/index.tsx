import { StyleSheet, Text as RNText } from 'react-native'
import { useMemo } from 'react'
import { useTheme } from 'providers'
import { useCommonStyles } from 'hooks/common.hooks'
import type { TextProps } from './text.type'

export const Text = ({
  children,
  variant = 'default',
  size,
  color,
  style,
  ...commonProps
}: TextProps) => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)

  const computedTextStyle = useMemo(() => {
    const variantStyles = {
      default: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textPrimary,
        fontWeight: theme.fontWeight.regular,
      },
      title: {
        fontSize: theme.fontSize.xl,
        color: theme.colors.textPrimary,
        fontWeight: theme.fontWeight.bold,
      },
      subtitle: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
      },
      caption: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.regular,
      },
    } as const

    return {
      ...variantStyles[variant],
      ...(size && { fontSize: theme.fontSize[size] }),
      ...(color && { color }),
    }
  }, [theme, variant, size, color])

  return (
    <RNText style={[styles.base, commonStyles, computedTextStyle, style]}>
      {children}
    </RNText>
  )
}

export default Text

const styles = StyleSheet.create({
  base: {},
})