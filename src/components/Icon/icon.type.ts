import { CommonProps } from "styles/commonStyling.type"


export type IconName = string // lucide exports by name

export interface IconProps {
  name:         IconName
  size?:        number
  color?:       string
  strokeWidth?: number
  style?:       CommonProps['style']
}