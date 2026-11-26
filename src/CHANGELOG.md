# Changelog

All notable changes to dazo-ui are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [2.0.0] - Unreleased

The first version built on the Dazo UI design system, with a new monochrome
look, design tokens, accessibility built in, and a much smaller package. See
[Upgrading from 1.x](#upgrading-from-1x) below.

### Breaking changes

- **`Icon` is removed**, together with the `lucide-react`, `lucide-react-native`
  and `react-native-svg` peer dependencies. It loaded every Lucide icon at startup
  ([#35](https://github.com/ahmedgourmat/dazo-ui/issues/35)) and forced web apps to
  install the native icon package ([#25](https://github.com/ahmedgourmat/dazo-ui/issues/25)).
  Components that show icons (`leftIcon`, `rightIcon`, `icon`) accept any React node.
- **New default look.** `primary` is near-black (near-white in dark mode) instead
  of purple; radius `sm` / `md` / `lg` are 4 / 8 / 12 (were 2 / 4 / 8); the type
  scale is 12 / 14 / 16 / 18 / 20 / 24 (was 11 / 13 / 15 / 17 / 20 / 24); inputs,
  selects and file inputs are 40 high (were 48); buttons and tables use borders
  instead of shadows.
- **Only the built package is published**, with an `exports` map. Deep imports
  such as `dazo-ui/components/Button` no longer resolve; import from `dazo-ui`.
  Web and native builds are separate and chosen by your bundler
  ([#24](https://github.com/ahmedgourmat/dazo-ui/issues/24),
  [#28](https://github.com/ahmedgourmat/dazo-ui/issues/28),
  [#52](https://github.com/ahmedgourmat/dazo-ui/issues/52)).
- **`Text` `lines` limits lines** instead of splitting the text into words
  ([#38](https://github.com/ahmedgourmat/dazo-ui/issues/38)).
- **`Checkbox` is a plain function component** taking `ref` as a prop (it was a
  `forwardRef` component). This matters only for code that refers to its type.

### Deprecated

These names still work and always equal their replacements; overriding either
one changes both. They will be removed in a future major version.

| Deprecated | Use instead |
|---|---|
| `colors.backgroundSurface` | `colors.surface` |
| `colors.backgroundSunken` | `colors.surfaceMuted` |
| `colors.textPrimary` | `colors.foreground` |
| `colors.textSecondary` | `colors.foregroundMuted` |
| `colors.textDisabled` | `colors.foregroundSubtle` |
| `colors.textInverse` | `colors.primaryForeground` |
| `colors.primaryLight`, `colors.primaryDark` | `colors.primary` |
| `fontSize.md` | `fontSize.base` |
| `fontSize.xxl` | `fontSize['2xl']` |

### Added

- **Design tokens:**
  - 20 semantic color roles for light and dark mode, and contrast checked against WCAG 2.2 AA in the tests.
  - A type scale with matching line heights (`leading`), a `semibold` weight, and the full 4px spacing scale (`space`).
  - Tokens for radius, border width, control height, icon size, shadow levels and motion.
- **Accent palettes:** `<ThemeProvider accent="blue" | "green" | "violet" | "orange">`,
  or your own shades. The raw values are exported as `palette` and `accentPalettes`.
- **Style props:** `shadow="sm" | "md" | "lg" | "xl"` on every component, and
  `borderWidth="thin" | "medium"`. `<Text color="danger">` accepts theme color names.
- **Button:** a `secondary` variant and an `xl` size.
- **Input, Select and FileInput:** a `size` prop (`sm` 32 · `md` 40 · `lg` 48 · `xl` 56).
- **Input:** an `invalid` prop, which draws a danger edge and sets `aria-invalid`.
- **Refs:** every component takes a `ref`. Input's ref is the TextInput, so you can
  `focus()` the next field ([#48](https://github.com/ahmedgourmat/dazo-ui/issues/48)).
- **FileInput:**
  - An `expoDocumentPicker` adapter for iOS and Android.
  - `PickedFile.file`, the browser `File`, on web.
  - The `FilePicker` and `FilePickerOptions` types ([#40](https://github.com/ahmedgourmat/dazo-ui/issues/40)).
- **RadioGroup:** an `accessibilityLabel` prop.
- **`useReducedMotion()`:** components skip their animations when the user asks for less motion.
- **Accessibility** ([#33](https://github.com/ahmedgourmat/dazo-ui/issues/33),
  [#34](https://github.com/ahmedgourmat/dazo-ui/issues/34)):
  - Roles and states on every control, and Space activates checkboxes and radios on web.
  - A keyboard focus ring on web, and 44-point touch areas on iOS and Android.
  - The selected Select option has a checkmark, so color isn't the only signal.
- **Interaction states:** hover on web, pressed, and a consistent disabled look (50% opacity).
- **Exported types:** `Theme`, `ThemeColors`, `ThemeMode`, `ThemeAccent`, `AccentName`,
  `AccentPalette`, `ControlSize`, `FontSizeKey`, `ShadowKey` and `SpaceStep`.

### Changed

- **Peer dependencies:** `react` is now `>=19.0.0` (was `>=19.2.4`), and `expo-document-picker`
  is no longer a peer dependency ([#26](https://github.com/ahmedgourmat/dazo-ui/issues/26)).
- **Button:** one implementation for every platform. On web it still renders a real
  `<button>`, and it no longer ships web-only code to iOS and Android
  ([#30](https://github.com/ahmedgourmat/dazo-ui/issues/30)).
- **Style props** are resolved once per theme and cached ([#36](https://github.com/ahmedgourmat/dazo-ui/issues/36)).
- **Web font stack:** `Inter, ui-sans-serif, system-ui, …, sans-serif`. iOS and Android use the
  system font.
- **Package size:** 1.0.2 shipped 609 files (17.9 MB unpacked, including the source code).
  2.0.0 ships only the built files, about 8.5 kB minified and brotlied for the whole library.

### Fixed

- Button sizes fit their padding and text ([#29](https://github.com/ahmedgourmat/dazo-ui/issues/29)).
- A partial `theme` override no longer wipes the rest of its section ([#31](https://github.com/ahmedgourmat/dazo-ui/issues/31)).
- Checkbox applies all style props and resolves theme tokens ([#32](https://github.com/ahmedgourmat/dazo-ui/issues/32)).
- Every Select option can be reached, not only the first six or so ([#27](https://github.com/ahmedgourmat/dazo-ui/issues/27)).
- Input no longer passes layout props to the TextInput ([#39](https://github.com/ahmedgourmat/dazo-ui/issues/39)).
- FileInput works on iOS and Android, and frees the object URLs it creates on web ([#40](https://github.com/ahmedgourmat/dazo-ui/issues/40)).
- The default font family is a real system font instead of the invalid `'system'` ([#41](https://github.com/ahmedgourmat/dazo-ui/issues/41)).
- `require('dazo-ui')` on web loads the web build ([#24](https://github.com/ahmedgourmat/dazo-ui/issues/24)).

### Upgrading from 1.x

1. **If you used `Icon`:** import icons from your icon library directly and pass them to `leftIcon`, `rightIcon` or `icon`:
   ```tsx
   import { Plus } from 'lucide-react-native' // or lucide-react on web, or any other icon library
   <Button label="Add" leftIcon={<Plus size={16} />} />
   ```
   You can then remove `react-native-svg` and the Lucide packages if nothing else uses them.
2. **If you deep-imported files** (`dazo-ui/components/...`): import from `dazo-ui` instead.
3. **To keep the old purple primary color:**
   ```tsx
   <ThemeProvider theme={{ colors: { primary: '#9333EA' } }}>
   ```
   Or pick an accent with `accent="violet"`.
4. **Old color and font-size names keep working.** Move to the new names when convenient (see Deprecated above).

## [1.0.2] - 2026-04-11

### Added

- Documentation in the README.
- `Text` accepts a `fontSize` prop.

## [1.0.1] - 2026-04-10

### Added

- More style props on `Container` and `Text`: position, size, flex, border and
  shadow props, all resolved through the shared style-props hook.

### Changed

- The package and every import use the name `dazo-ui` (was `dazo`).

## [1.0.0] - 2026-04-06

### Added

- First release, with these components: `Button`, `Checkbox`, `Container`,
  `FileInput`, `Icon`, `Input`, `RadioGroup`, `Select`, `Table` and `Text`.
- `ThemeProvider` with light, dark and system color schemes and theme overrides,
  plus `useTheme`, `lightTheme` and `darkTheme`.
- Style props (`padding="md"`, `backgroundColor="primary"`, …) that resolve theme tokens.

[2.0.0]: https://github.com/ahmedgourmat/dazo-ui/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/ahmedgourmat/dazo-ui/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ahmedgourmat/dazo-ui/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ahmedgourmat/dazo-ui/releases/tag/v1.0.0
