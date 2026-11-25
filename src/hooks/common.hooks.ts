import { StyleSheet, type ViewStyle } from 'react-native'
import { useTheme } from '../providers'
import type { CommonProps } from '../styles/commonStyling.type'
import type { Theme, ThemeColors } from '../styles/theme'
import type { RadiusKey, SpacingKey } from '../styles/tokens'

type StyleKey = Exclude<keyof CommonProps, 'children' | 'scrollable' | 'style'>

/**
 * How a style prop becomes a style:
 *   spacing  token ('md') → theme.spacing, numbers kept   (skipped when undefined)
 *   radius   token ('lg') → theme.radius, numbers kept    (skipped when undefined)
 *   color    theme color name → theme.colors, others kept (skipped when empty)
 *   value    copied as is                                 (skipped when undefined)
 *   truthy   copied as is                                 (skipped when empty)
 */
type Kind = 'spacing' | 'radius' | 'color' | 'value' | 'truthy'
type Rule = readonly [name: StyleKey, kind: Kind, targets?: readonly string[]]

/**
 * Every style prop, in the order it is applied. Later rules win, so a single
 * side (paddingLeft) overrides its shorthand (paddingHorizontal). The optional
 * third item lists the style keys a prop writes to, when they differ from its name.
 */
const RULES = [
    ['padding', 'spacing'],
    ['paddingHorizontal', 'spacing', ['paddingLeft', 'paddingRight']],
    ['paddingVertical', 'spacing', ['paddingTop', 'paddingBottom']],
    ['paddingTop', 'spacing'],
    ['paddingBottom', 'spacing'],
    ['paddingLeft', 'spacing'],
    ['paddingRight', 'spacing'],
    ['margin', 'spacing'],
    ['marginHorizontal', 'spacing', ['marginLeft', 'marginRight']],
    ['marginVertical', 'spacing', ['marginTop', 'marginBottom']],
    ['marginTop', 'spacing'],
    ['marginBottom', 'spacing'],
    ['marginLeft', 'spacing'],
    ['marginRight', 'spacing'],
    ['gap', 'spacing'],
    ['rowGap', 'spacing'],
    ['columnGap', 'spacing'],
    ['position', 'truthy'],
    ['top', 'value'],
    ['bottom', 'value'],
    ['left', 'value'],
    ['right', 'value'],
    ['zIndex', 'value'],
    ['width', 'value'],
    ['height', 'value'],
    ['aspectRatio', 'value'],
    ['minWidth', 'value'],
    ['maxWidth', 'value'],
    ['minHeight', 'value'],
    ['maxHeight', 'value'],
    ['flex', 'value'],
    ['display', 'truthy'],
    ['flexDirection', 'truthy'],
    ['flexWrap', 'truthy'],
    ['flexGrow', 'value'],
    ['flexShrink', 'value'],
    ['flexBasis', 'value'],
    ['alignItems', 'truthy'],
    ['justifyContent', 'truthy'],
    ['alignSelf', 'truthy'],
    ['alignContent', 'truthy'],
    ['backgroundColor', 'color'],
    ['opacity', 'value'],
    ['overflow', 'truthy'],
    ['elevation', 'value'],
    ['shadowColor', 'truthy'],
    ['shadowOpacity', 'value'],
    ['shadowRadius', 'value'],
    ['shadowOffset', 'truthy'],
    ['borderRadius', 'radius'],
    ['borderTopLeftRadius', 'radius'],
    ['borderTopRightRadius', 'radius'],
    ['borderBottomLeftRadius', 'radius'],
    ['borderBottomRightRadius', 'radius'],
    ['borderStyle', 'truthy'],
    ['borderWidth', 'value'],
    ['borderTopWidth', 'value'],
    ['borderBottomWidth', 'value'],
    ['borderLeftWidth', 'value'],
    ['borderRightWidth', 'value'],
    ['borderColor', 'color'],
    ['borderTopColor', 'color'],
    ['borderBottomColor', 'color'],
    ['borderLeftColor', 'color'],
    ['borderRightColor', 'color'],
    ['transform', 'value'],
] as const satisfies readonly Rule[]

// Fails the build if a style prop is added to CommonProps without a rule above.
type UnlistedStyleKey = Exclude<StyleKey, (typeof RULES)[number][0]>
const allStyleKeysListed: [UnlistedStyleKey] extends [never] ? true : UnlistedStyleKey = true
void allStyleKeysListed

const resolve = (kind: Kind, value: unknown, theme: Theme): unknown => {
    if (typeof value !== 'string') return value
    if (kind === 'spacing') return theme.spacing[value as SpacingKey]
    if (kind === 'radius') return theme.radius[value as RadiusKey]
    // A theme color name becomes that color; anything else (hex, 'transparent') is kept.
    if (kind === 'color' && Object.prototype.hasOwnProperty.call(theme.colors, value)) {
        return theme.colors[value as keyof ThemeColors] || value
    }
    return value
}

/** Turns the style props of a component into a React Native style, using the theme's tokens. */
const buildCommonStyles = (props: CommonProps, theme: Theme): ViewStyle => {
    const style: Record<string, unknown> = {}
    for (const [name, kind, targets] of RULES as readonly Rule[]) {
        const value = props[name]
        const skip = kind === 'color' || kind === 'truthy' ? !value : value === undefined
        if (skip) continue
        const resolved = resolve(kind, value, theme)
        for (const target of targets ?? [name]) style[target] = resolved
    }
    return style as ViewStyle
}

// Styles are built once per theme and per combination of style props, then
// shared by every component that uses the same combination. A theme switch
// starts a new cache; the old theme's entries are freed with the theme (WeakMap).
const EMPTY_STYLE: ViewStyle = Object.freeze({})
// Safety valve for props that change continuously (e.g. a width animated through
// state): past this many combinations in one theme, the cache starts over.
const MAX_CACHED_PER_THEME = 1000
const cache = new WeakMap<Theme, Map<string, ViewStyle>>()

/** Like useCommonStyles, for callers that already have the theme. Returns the same object for the same props and theme. */
export const resolveCommonStyles = (props: CommonProps, theme: Theme): ViewStyle => {
    let key = ''
    for (const [name] of RULES) {
        const value = props[name]
        // JSON keeps 10 and '10' apart and covers shadowOffset / transform objects.
        if (value !== undefined) key += `${name}=${JSON.stringify(value)};`
    }
    if (key === '') return EMPTY_STYLE

    let themeCache = cache.get(theme)
    if (!themeCache) {
        themeCache = new Map()
        cache.set(theme, themeCache)
    }

    let style = themeCache.get(key)
    if (!style) {
        if (themeCache.size >= MAX_CACHED_PER_THEME) themeCache.clear()
        // StyleSheet.create returns the same plain object; react-native-web also
        // compiles it to reusable CSS classes instead of inline styles.
        style = StyleSheet.create({ style: buildCommonStyles(props, theme) }).style
        themeCache.set(key, style)
    }
    return style
}

const STYLE_PROP_NAMES: ReadonlySet<string> = new Set(RULES.map(([name]) => name))

/**
 * Splits props into the style props above (padding, width, backgroundColor, …)
 * and everything else, so a component can forward only the rest to a native
 * component. React Native treats unknown props whose names match style keys as
 * styles on that component, so `padding="md"` would reach it as the string 'md'.
 */
export const splitCommonProps = <P extends object>(
    props: P,
): [styleProps: Pick<P, Extract<keyof P, StyleKey>>, rest: Omit<P, StyleKey>] => {
    const styleProps: Record<string, unknown> = {}
    const rest: Record<string, unknown> = {}
    for (const [name, value] of Object.entries(props)) {
        if (STYLE_PROP_NAMES.has(name)) styleProps[name] = value
        else rest[name] = value
    }
    return [styleProps as Pick<P, Extract<keyof P, StyleKey>>, rest as Omit<P, StyleKey>]
}

/** Resolves a component's style props (padding="md", backgroundColor="primary", …) against the current theme. */
export const useCommonStyles = (props: CommonProps): ViewStyle => resolveCommonStyles(props, useTheme())
