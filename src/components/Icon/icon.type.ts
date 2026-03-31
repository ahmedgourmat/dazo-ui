export interface TextProps {
    children: React.ReactNode
    variant?: 'default' | 'title' | 'subtitle' | 'caption'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    style?: any
}