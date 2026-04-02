import type * as LucideIcons from 'lucide-react-native'
import { CommonProps } from 'styles/commonStyling.type'

export type LucideIconName = keyof typeof LucideIcons
export type IconName = LucideIconName | (string & {})

export interface IconProps extends CommonProps {
  name:         IconName
  size?:        number
  color?:       string
  strokeWidth?: number
  style?:       CommonProps['style']
}