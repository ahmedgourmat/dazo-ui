import type { CSSProperties, JSX } from 'react'
import { ActivityIndicator } from 'react-native'
import { useButtonStyles } from './button.hooks'
import type { ButtonProps } from './button.type'
import { useCommonStyles } from '../../hooks/common.hooks'

// Web version of Button. The web build picks this file over button.tsx,
// so this DOM code never ships in iOS/Android bundles.
export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  icon,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  style,
  labelStyle,
  ...commonProps
}: ButtonProps): JSX.Element => {

  const computed = useButtonStyles({ variant, size, disabled, fullWidth })
  const commonStyles = useCommonStyles(commonProps)
  const resolvedLeftIcon = leftIcon ?? icon
  const resolvedRightIcon = rightIcon

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{
        ...computed.container as CSSProperties,
        ...commonStyles as CSSProperties,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        ...(style as object),
      }}
    >
      {loading && (
        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }}>
          <ActivityIndicator size='small' color={computed.indicator} />
        </span>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', opacity: loading ? 0 : 1 }}>
        {resolvedLeftIcon ? (
          <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
            {resolvedLeftIcon}
          </span>
        ) : null}
        <span style={{
          ...computed.label as CSSProperties,
          ...(labelStyle as object),
        }}>
          {label}
        </span>
        {resolvedRightIcon ? (
          <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>
            {resolvedRightIcon}
          </span>
        ) : null}
      </span>
    </button>
  )
}
