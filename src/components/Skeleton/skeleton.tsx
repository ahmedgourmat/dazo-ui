import { useMemo, type JSX } from 'react'
import { Platform, View } from 'react-native'
import { useCommonStyles } from '../../hooks/common.hooks'
import { useReducedMotion } from '../../hooks/motion'
import { useTheme } from '../../providers'
import { SkeletonBox } from './skeleton-box'
import { SkeletonContext, usePulse } from './skeleton.context'
import type { SkeletonProps } from './skeleton.type'

/**
 * Two uses:
 *
 * - **Wrapper:** `<Skeleton loading={isLoading}>…your screen…</Skeleton>`.
 *   While loading, every dazo-ui component inside draws a placeholder in its
 *   own size and shape, and screen readers hear one "Loading".
 * - **Block:** `<Skeleton width={120} height={16} />`, `<Skeleton circle size={40} />`
 *   or `<Skeleton lines={3} />`, for content that isn't a dazo-ui component.
 */
export const Skeleton = ({
  ref,
  testID,
  children,
  loading = true,
  label = 'Loading',
  circle = false,
  size = 40,
  lines,
  textSize = 'base',
  style,
  ...commonProps
}: SkeletonProps): JSX.Element => {
  const theme = useTheme()
  const reduceMotion = useReducedMotion()
  const commonStyles = useCommonStyles(commonProps)
  const wrapper = children !== undefined
  // One pulse for every placeholder in the wrapper, so they move together.
  const pulse = usePulse(wrapper && loading && Platform.OS !== 'web' && !reduceMotion)
  const state = useMemo(() => ({ loading, pulse }), [loading, pulse])

  if (wrapper) {
    return (
      <View
        ref={ref}
        testID={testID}
        // While loading the placeholders are hidden from screen readers; this
        // one element tells them the content is on its way.
        {...(loading ? { accessible: true, role: 'progressbar' as const, 'aria-label': label, 'aria-busy': true } : null)}
        style={[commonStyles, style]}
      >
        <SkeletonContext.Provider value={state}>{children}</SkeletonContext.Provider>
      </View>
    )
  }

  if (lines !== undefined) {
    // Bars as high as the text, spaced like its lines; the last one shorter.
    const fontSize = theme.fontSize[textSize]
    const gap = theme.leading[textSize] - fontSize
    return (
      <View ref={ref} testID={testID} aria-hidden style={[{ gap, alignSelf: 'stretch' }, commonStyles, style]}>
        {Array.from({ length: Math.max(1, lines) }, (_, index) => (
          <SkeletonBox
            key={index}
            style={{
              height: fontSize,
              width: index === lines - 1 && lines > 1 ? '60%' : '100%',
              borderRadius: theme.radius.sm,
            }}
          />
        ))}
      </View>
    )
  }

  return (
    <SkeletonBox
      ref={ref}
      testID={testID}
      style={[
        circle
          ? { width: size, height: size, borderRadius: size / 2, alignSelf: 'flex-start' }
          : { height: 16, borderRadius: theme.radius.sm, alignSelf: 'stretch' },
        commonStyles,
        style,
      ]}
    />
  )
}
