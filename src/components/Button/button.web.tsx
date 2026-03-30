import { ActivityIndicator } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'

export const Button = ({
  label,
  onPress,
  disabled  = false,
  loading   = false,
  variant   = 'solid',
  size      = 'md',
  fullWidth = false,
  style,
  labelStyle,
}: ButtonProps) => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{
        ...computed.container as React.CSSProperties,
        width:          fullWidth ? '100%' : 'auto',
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        fontFamily:     'inherit',
        border:         'none',
        ...(style as object),
      }}
    >
      {loading
        ? <ActivityIndicator size='small' color={computed.indicator} />
        : <span style={{
            ...computed.label as React.CSSProperties,
            ...(labelStyle as object),
          }}>
            {label}
          </span>
      }
    </button>
  )
}

export default Button