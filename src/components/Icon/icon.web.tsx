import * as LucideIcons from 'lucide-react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../providers'
import type { IconProps } from './icon.type'
import { useCommonStyles } from 'hooks/common.hooks'
import { resolveLucideIcon } from './icon.utils'

export const Icon = ({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  style,
  ...commonProps
}: IconProps) => {

  const theme = useTheme()

  // resolve color — fallback to theme primary
  const commonStyles = useCommonStyles(commonProps)
  const mergedStyle = StyleSheet.flatten([commonStyles, style])
  const resolvedColor = color ?? theme.colors.textPrimary

  // dynamically get the icon component by name
  const LucideIcon = resolveLucideIcon(name, LucideIcons as Record<string, unknown>)

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in the Lucide icon set`)
    return null
  }

  return (
    <LucideIcon
      size={size}
      color={resolvedColor}
      strokeWidth={strokeWidth}
      style={mergedStyle as any}
    />
  )
}
