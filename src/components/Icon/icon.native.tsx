import * as LucideIcons from 'lucide-react-native'
import { useTheme } from '../../providers'
import type { IconProps } from './icon.type'
import { useCommonStyles } from 'hooks/common.hooks'
import { resolveLucideIcon } from './icon.utils'

export const Icon = ({
  name,
  size = 20,
  color,
  strokeWidth = 1.75,
  style,
  ...commonProps
}: IconProps) => {

  const theme = useTheme()

  // resolve color — fallback to theme primary
  const commonStyles = useCommonStyles(commonProps)
  const resolvedColor = color ?? theme.colors.textSecondary

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
      style={[commonStyles, style]}
    />
  )
}
