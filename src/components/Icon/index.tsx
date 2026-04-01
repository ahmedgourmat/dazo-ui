import * as LucideIcons from 'lucide-react-native'
import { useTheme } from '../../providers'
import type { IconProps } from './icon.type'

export const Icon = ({
  name,
  size        = 24,
  color,
  strokeWidth = 2,
  style,
}: IconProps) => {

  const theme = useTheme()

  // resolve color — fallback to theme primary
  const resolvedColor = color ?? theme.colors.textPrimary

  // dynamically get the icon component by name
  const LucideIcon = (LucideIcons as Record<string, any>)[name]

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react-native`)
    return null
  }

  return (
    <LucideIcon
      size={size}
      color={resolvedColor}
      strokeWidth={strokeWidth}
      style={style}
    />
  )
}
