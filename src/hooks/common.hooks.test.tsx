import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '../providers'
import type { CommonProps } from '../styles/commonStyling.type'
import { darkTheme, lightTheme } from '../styles/theme'
import { useCommonStyles } from './common.hooks'

const resolve = (props: CommonProps, colorScheme: 'light' | 'dark' = 'light') =>
  renderHook(() => useCommonStyles(props), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider colorScheme={colorScheme}>{children}</ThemeProvider>
    ),
  }).result.current

const { spacing, radius, colors } = lightTheme

describe('useCommonStyles', () => {
  it('returns an empty style when no style props are given', () => {
    expect(resolve({})).toEqual({})
  })

  it('ignores props that are not styles', () => {
    expect(resolve({ children: 'hi', scrollable: true, style: { padding: 3 } })).toEqual({})
  })

  describe('spacing', () => {
    it('resolves spacing tokens and keeps numbers as they are', () => {
      expect(resolve({ padding: 'md', margin: 7, gap: 'xs', rowGap: 'sm', columnGap: 3 })).toEqual({
        padding: spacing.md,
        margin: 7,
        gap: spacing.xs,
        rowGap: spacing.sm,
        columnGap: 3,
      })
    })

    it('expands horizontal and vertical shorthands into each side', () => {
      expect(resolve({ paddingHorizontal: 'lg', paddingVertical: 'xs', marginHorizontal: 2, marginVertical: 'xl' })).toEqual({
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
        paddingTop: spacing.xs,
        paddingBottom: spacing.xs,
        marginLeft: 2,
        marginRight: 2,
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
      })
    })

    it('lets a single side win over its shorthand', () => {
      expect(resolve({ paddingHorizontal: 'md', paddingLeft: 1, marginVertical: 'sm', marginBottom: 'xxl' })).toEqual({
        paddingLeft: 1,
        paddingRight: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.xxl,
      })
    })

    it('keeps zero values', () => {
      expect(resolve({ padding: 0, margin: 0, gap: 0 })).toEqual({ padding: 0, margin: 0, gap: 0 })
    })
  })

  describe('radius', () => {
    it('resolves radius tokens on the whole box and on each corner', () => {
      expect(
        resolve({
          borderRadius: 'lg',
          borderTopLeftRadius: 'full',
          borderTopRightRadius: 3,
          borderBottomLeftRadius: 'sm',
          borderBottomRightRadius: 0,
        }),
      ).toEqual({
        borderRadius: radius.lg,
        borderTopLeftRadius: radius.full,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: radius.sm,
        borderBottomRightRadius: 0,
      })
    })
  })

  describe('colors', () => {
    it('resolves theme color names and keeps raw colors as they are', () => {
      expect(
        resolve({
          backgroundColor: 'backgroundSurface',
          borderColor: '#ff0000',
          borderTopColor: 'primary',
          borderBottomColor: 'transparent',
          borderLeftColor: 'danger',
          borderRightColor: 'rgb(1, 2, 3)',
        }),
      ).toEqual({
        backgroundColor: colors.backgroundSurface,
        borderColor: '#ff0000',
        borderTopColor: colors.primary,
        borderBottomColor: 'transparent',
        borderLeftColor: colors.danger,
        borderRightColor: 'rgb(1, 2, 3)',
      })
    })

    it('uses the colors of the active theme', () => {
      expect(resolve({ backgroundColor: 'background', borderColor: 'border' }, 'dark')).toEqual({
        backgroundColor: darkTheme.colors.background,
        borderColor: darkTheme.colors.border,
      })
    })

    it('leaves out empty color strings', () => {
      expect(resolve({ backgroundColor: '', borderColor: '' })).toEqual({})
    })
  })

  describe('caching (#36)', () => {
    it('returns the same style object for the same props, across renders and components', () => {
      const first = renderHook(() => useCommonStyles({ padding: 'md', backgroundColor: 'primary' }))
      const second = renderHook(() => useCommonStyles({ backgroundColor: 'primary', padding: 'md' }))
      const before = first.result.current

      first.rerender()

      expect(first.result.current).toBe(before)
      expect(second.result.current).toBe(before)
    })

    it('returns a new style when a prop changes', () => {
      const { result, rerender } = renderHook(({ padding }: CommonProps) => useCommonStyles({ padding }), {
        initialProps: { padding: 'sm' },
      })
      const before = result.current

      rerender({ padding: 'lg' })

      expect(result.current).not.toBe(before)
      expect(result.current).toEqual({ padding: spacing.lg })
    })

    it('keeps the number 10 and the string "10" apart', () => {
      expect(resolve({ width: 10 })).toEqual({ width: 10 })
      expect(resolve({ width: '10' })).toEqual({ width: '10' })
    })

    it('keeps styles from different themes apart', () => {
      expect(resolve({ backgroundColor: 'background' }, 'light')).toEqual({ backgroundColor: lightTheme.colors.background })
      expect(resolve({ backgroundColor: 'background' }, 'dark')).toEqual({ backgroundColor: darkTheme.colors.background })
    })

    it('shares one empty style between components without style props', () => {
      expect(resolve({})).toBe(resolve({ children: 'x' }))
    })

    it('treats props that are not theme color names, like toString, as raw colors', () => {
      expect(resolve({ backgroundColor: 'toString' })).toEqual({ backgroundColor: 'toString' })
    })
  })

  describe('everything else', () => {
    it('passes layout, size and position values straight through', () => {
      const props: CommonProps = {
        position: 'absolute',
        top: 1,
        bottom: '10%',
        left: 0,
        right: 4,
        zIndex: 2,
        width: '50%',
        height: 20,
        aspectRatio: 1.5,
        minWidth: 10,
        maxWidth: '100%',
        minHeight: 5,
        maxHeight: 500,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow: 2,
        flexShrink: 0,
        flexBasis: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        alignContent: 'flex-start',
      }
      expect(resolve(props)).toEqual(props)
    })

    it('passes visual and border values straight through', () => {
      const props: CommonProps = {
        opacity: 0,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderStyle: 'dashed',
        borderWidth: 1,
        borderTopWidth: 2,
        borderBottomWidth: 0,
        borderLeftWidth: 3,
        borderRightWidth: 4,
        transform: [{ rotate: '45deg' }, { scale: 2 }],
      }
      expect(resolve(props)).toEqual(props)
    })
  })
})
