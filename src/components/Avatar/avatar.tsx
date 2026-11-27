import { useState, type JSX } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useCommonStyles } from '../../hooks/common.hooks'
import { useTheme } from '../../providers'
import type { AvatarProps } from './avatar.type'

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 } as const

/**
 * The first letter of the first and last word, upper-cased: "Ada Lovelace" → "AL",
 * "Plato" → "P". Array.from keeps letters made of two UTF-16 units whole.
 */
export const initialsOf = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = Array.from(words[0])[0]
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : ''
  return `${first}${last}`.toLocaleUpperCase()
}

export const Avatar = ({
  ref,
  testID,
  name,
  src,
  size = 'md',
  shape = 'circle',
  style,
  labelStyle,
  ...commonProps
}: AvatarProps): JSX.Element => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  // The URL that failed, so a new `src` gets its own chance to load.
  const [failedSrc, setFailedSrc] = useState<string>()
  const dimension = SIZES[size]
  const showImage = Boolean(src) && failedSrc !== src
  const initials = name ? initialsOf(name) : ''

  return (
    <View
      ref={ref}
      testID={testID}
      // One element for screen readers, named by the person's name.
      {...(name ? { accessible: true, role: 'img' as const, 'aria-label': name } : { 'aria-hidden': true })}
      style={[
        styles.box,
        {
          width: dimension,
          height: dimension,
          borderRadius: shape === 'circle' ? dimension / 2 : Math.min(theme.radius.md, dimension / 4),
          backgroundColor: theme.colors.secondary,
        },
        commonStyles,
        style,
      ]}
    >
      {/* The initials sit under the image, so they show while it loads and if it fails. */}
      {initials ? (
        <Text
          aria-hidden
          // The circle doesn't grow with the system text size, so the letters don't either.
          maxFontSizeMultiplier={1}
          style={[
            {
              color: theme.colors.secondaryForeground,
              fontSize: Math.round(dimension * 0.4),
              fontFamily: theme.fontFamily.semibold,
              fontWeight: theme.fontWeight.semibold,
            },
            labelStyle,
          ]}
        >
          {initials}
        </Text>
      ) : null}
      {showImage ? (
        <Image
          aria-hidden
          source={{ uri: src }}
          onError={() => setFailedSrc(src)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
