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

FileInput has no built-in native picker yet. On iOS and Android, pass your own picker through the `customPicker` prop, for example one built on `expo-document-picker`.

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
      <Text color="textSecondary">Build once and ship on native and web.</Text>
      <Button label="Get Started" />
    </Container>
  );
}
```

## ThemeProvider API

| Prop | Type | Default | Description |
|---|---|---|---|
| children | React.ReactNode | required | App subtree that receives theme context |
| theme | DeepPartial<Theme> | undefined | Optional theme overrides (colors, spacing, fontFamily, etc.) |
| colorScheme | "light" \| "dark" \| "system" | "system" | Chooses active mode or follows device preference |

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
