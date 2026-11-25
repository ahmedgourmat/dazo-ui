import type { CSSProperties, JSX } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
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
  const labelTextStyle = StyleSheet.flatten([computed.label, labelStyle])
  const resolvedLeftIcon = leftIcon ?? icon
  const resolvedRightIcon = rightIcon

  return (
    <button
      // Without this, a button inside a <form> submits the form when clicked.
      type='button'
      onClick={onPress}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
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
        // Hidden from screen readers: the button itself is announced as busy,
        // and an unnamed spinner would be read out as an empty progress bar.
        <span aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }}>
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
          ...labelTextStyle as CSSProperties,
          // React Native line heights are in pixels, but a unitless CSS
          // line-height is a multiplier: 14.95 would mean 14.95 × the font size.
          lineHeight: typeof labelTextStyle.lineHeight === 'number' ? `${labelTextStyle.lineHeight}px` : undefined,
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
