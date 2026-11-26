# Dazo UI

Cross-platform UI component library for React Native and React web.

Dazo UI provides reusable, theme-aware primitives and form controls that let teams ship consistent interfaces across mobile and web from a single component API.

## Why Dazo UI

- Cross-platform by design: same component API for React Native and web
- Reusable primitives: build layouts and flows quickly with composable building blocks
- Theme-aware: support light, dark, and custom theme overrides via ThemeProvider
- Practical defaults: predictable styling tokens for spacing, typography, and colors

## Included Components

- Button
- Checkbox
- Container
- FileInput
- Input
- Radio
- Select
- Table
- Text

## Installation

Install the package plus the peer dependencies for your platform.

### React Native (Expo)

```bash
pnpm add dazo-ui
```

If your Expo app also runs on web, add the web packages too:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

FileInput needs a picker on iOS and Android. dazo-ui doesn't install one, but it ships a ready-made adapter for `expo-document-picker`:

```bash
npx expo install expo-document-picker
```

```tsx
import * as DocumentPicker from 'expo-document-picker'
import { expoDocumentPicker, FileInput } from 'dazo-ui'

<FileInput multiple accept='image/*,application/pdf' customPicker={expoDocumentPicker(DocumentPicker)} />
```

Any other picker works too: `customPicker` receives `{ accept, multiple }` and resolves with the picked files, or `null` when cancelled.

### React Web (Vite/Next)

```bash
pnpm add dazo-ui react-native-web
```

For Next.js, add React Native aliasing in next.config.ts:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["dazo-ui"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
    },
    resolveExtensions: [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json"
    ]
  },
};

export default nextConfig;
```

## Quick Start

### 1) Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "dazo-ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider colorScheme="system">
      {children}
    </ThemeProvider>
  );
}
```

### 2) Use components

```tsx
import { Button, Container, Text } from "dazo-ui";

export function ExampleCard() {
  return (
    <Container padding={16} borderWidth={1} borderColor="border" borderRadius={16} gap={10}>
      <Text variant="subtitle">Welcome</Text>
      <Text color="foregroundMuted">Build once and ship on native and web.</Text>
      <Button label="Get Started" />
    </Container>
  );
}
```

### 3) Refs

Every component takes a `ref` (React 19 passes it as a normal prop):

| Component | `ref.current` is |
| --- | --- |
| Input | the `TextInput`, so you can `focus()` it |
| Button, Checkbox, Select, FileInput | the pressable field |
| Container | the `View`, or the `ScrollView` when `scrollable` |
| Text | the `Text` |
| RadioGroup, Table | the outer `View` |

```tsx
const password = useRef<TextInput>(null);

<Input placeholder="Email" onSubmitEditing={() => password.current?.focus()} />
<Input ref={password} placeholder="Password" secureTextEntry />
```

## ThemeProvider API

| Prop | Type | Default | Description |
|---|---|---|---|
| children | React.ReactNode | required | App subtree that receives theme context |
| theme | DeepPartial<Theme> | undefined | Optional theme overrides (colors, spacing, fontFamily, etc.) |
| colorScheme | "light" \| "dark" \| "system" | "system" | Chooses active mode or follows device preference |
| accent | "neutral" \| "blue" \| "green" \| "violet" \| "orange" \| AccentPalette | "neutral" | Color of primary actions, selected states and focus rings. Surfaces and text stay neutral |

## Design System

The default theme is monochrome: white and near-white surfaces in light mode, near-black and charcoal in dark mode, with neutral grays for text and borders. Components read **semantic roles** (`foreground`, `surface`, `primary`, …), never raw palette values, so changing a role changes it everywhere.

### Colors

| Role | Light | Dark | Used for |
|---|---|---|---|
| `background` | `#FFFFFF` | `#0A0A0A` | App background |
| `foreground` | `#171717` | `#FAFAFA` | Main text and icons |
| `surface` | `#FFFFFF` | `#171717` | Component surfaces |
| `surfaceMuted` | `#FAFAFA` | `#262626` | Table headers, stripes |
| `surfaceElevated` | `#FFFFFF` | `#262626` | Menus and popovers |
| `surfaceInverse` | `#171717` | `#FAFAFA` | Inverted surfaces |
| `foregroundMuted` | `#525252` | `#A3A3A3` | Labels, placeholders, captions |
| `foregroundSubtle` | `#737373` | `#737373` | Low-emphasis content |
| `border` | `#E5E5E5` | `#262626` | Dividers and containers |
| `borderStrong` | `#D4D4D4` | `#404040` | Emphasized borders |
| `input` | `#737373` | `#737373` | Edges of inputs, checkboxes, radios |
| `ring` | `#171717` | `#A3A3A3` | Keyboard focus ring |
| `primary` / `primaryForeground` | `#171717` / `#FFFFFF` | `#FAFAFA` / `#171717` | Main actions |
| `secondary` / `secondaryForeground` | `#F5F5F5` / `#171717` | `#262626` / `#FAFAFA` | Secondary actions |
| `danger` · `success` · `warning` · `info` | 600 shades | 400 shades | Status |

Any style prop that takes a color accepts these names (`backgroundColor="surfaceMuted"`, `<Text color="danger">`), and `useTheme().colors` returns them. The contrast of every text, focus-ring and field-edge pair is checked in the tests (WCAG 2.2 AA) for both modes and every accent. Note that `success` and `warning` reach only about 3.2:1 on white, enough for icons and borders but not for small text.

Choose an accent for primary actions, selected states and focus rings:

```tsx
<ThemeProvider accent="blue">…</ThemeProvider>

// or your own shades: light mode uses 700 (and 600 for the ring), dark mode uses 400
<ThemeProvider accent={{ 50: "#F0FDFA", 200: "#99F6E4", 400: "#2DD4BF", 600: "#0D9488", 700: "#0F766E" }}>…</ThemeProvider>
```

`palette` (the neutral grays) and `accentPalettes` are exported if you need the raw values.

### Typography

| Size | `xs` | `sm` | `base` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `5xl` |
|---|---|---|---|---|---|---|---|---|---|
| Font size | 12 | 14 | 16 | 18 | 20 | 24 | 30 | 36 | 48 |
| Line height (`leading`) | 16 | 20 | 24 | 28 | 28 | 32 | 36 | 40 | 53 |

Weights: `regular` 400, `medium` 500, `semibold` 600, `bold` 700. `<Text size="3xl">` sets both the size and its line height. Text variants: `default` (base), `title` (2xl, semibold), `subtitle` (lg, medium), `caption` (sm, muted).

The web font stack is `Inter, ui-sans-serif, system-ui, …, sans-serif`: Inter when your app loads it, otherwise the system font. iOS and Android use the system font. To use your own, set `theme={{ fontFamily: { regular, medium, semibold, bold } }}`.

### Spacing, radius and borders

- Spacing props take `xs` 4 · `sm` 8 · `md` 16 · `lg` 24 · `xl` 32 · `xxl` 48, or a number. The full 4px scale (2px half steps) is `useTheme().space`: `space[1.5]` is 6, `space[3]` is 12.
- Radius: `none` 0 · `xs` 2 · `sm` 4 · `md` 8 (inputs, buttons) · `lg` 12 (cards, menus) · `xl` 16 · `2xl` 20 · `3xl` 24 · `full`.
- Border widths: `borderWidth="thin"` (1) or `"medium"` (2), or a number.

### Sizes, elevation and motion

- Buttons, inputs, selects and file inputs take `size`: `sm` 32 · `md` 40 (default) · `lg` 48 · `xl` 56. On iOS and Android, buttons and fields shorter than 44 get a larger touch area through `hitSlop`.
- `shadow="sm" | "md" | "lg" | "xl"` on any component adds an elevation level (shadows on iOS, `elevation` on Android, `box-shadow` on web). Prefer borders and surface colors; keep shadows for things that float, like menus.
- `useTheme().motion` has durations (`fast` 100ms, `normal` 180ms, `slow` 250ms, …) and easing curves. `useReducedMotion()` is true when the user asked the system for less motion; components skip their animations then.

### Interaction states

- **Hover** (web only): buttons, select fields, file inputs and menu options change their surface. Touch screens never show hover.
- **Focus**: on web, a 2px ring in the `ring` color appears when focus comes from the keyboard, not after a click. Text fields show it whenever they have focus. iOS and Android use their own focus indicators.
- **Pressed**: slightly lower opacity.
- **Disabled**: every control keeps its look at 50% opacity.
- **Selected**: checkboxes, radios and menu options use `primary`, and the selected Select option also has a checkmark, so color isn't the only signal.
- **Invalid**: `<Input invalid />` draws a `danger` edge and sets `aria-invalid`.

### Renamed in 1.1

The old names still work. They always equal the new name, and overriding either one changes both, but they are deprecated:

| Old | New |
|---|---|
| `backgroundSurface` | `surface` |
| `backgroundSunken` | `surfaceMuted` |
| `textPrimary` | `foreground` |
| `textSecondary` | `foregroundMuted` |
| `textDisabled` | `foregroundSubtle` |
| `textInverse` | `primaryForeground` |
| `primaryLight`, `primaryDark` | `primary` |
| `fontSize.md` | `fontSize.base` |
| `fontSize.xxl` | `fontSize['2xl']` |

Some values changed: `primary` is now near-black (white in dark mode) instead of purple, `radius.sm`/`md`/`lg` are 4/8/12 (were 2/4/8), body text is 16 (was 15), and controls are 40 high by default (inputs were 48).

## Monorepo Development

This repository is a pnpm workspace managed with Turbo.

### Workspace layout

- src: publishable package (dazo-ui)
- apps/mobile: Expo playground
- apps/web: Vite playground
- apps/storybook: Storybook docs and visual testing

### Root commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

### Package build (library only)

```bash
pnpm --filter dazo-ui build
```

### Run individual apps

```bash
pnpm --filter mobile dev
pnpm --filter web dev
pnpm --filter storybook storybook
```

## Peer Dependencies

| Package | Version | Needed on |
|---|---|---|
| react | >= 19.0.0 | All platforms |
| react-native | >= 0.81.5 | All platforms (web apps alias it to react-native-web, but the type definitions still use its types) |
| react-native-web | >= 0.19.0 | Web only (optional peer) |

Optional peers aren't installed or checked automatically, so web apps need to install `react-native-web` as shown in [Installation](#installation).

## Icons

Dazo UI doesn't ship an icon set. Components that show icons (`leftIcon`, `rightIcon`, `icon`) accept any React node, so you can pass icons from any library or your own components.

## Notes

- For best consistency, wrap the full application tree once with ThemeProvider.
