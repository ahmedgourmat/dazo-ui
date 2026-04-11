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
- Icon
- Input
- Radio
- Select
- Table
- Text

## Installation

Install the package and required peer dependencies.

### React Native (Expo)

```bash
pnpm add dazo-ui react-native-svg lucide-react-native
```

If your app uses FileInput with native document selection:

```bash
pnpm add expo-document-picker
```

### React Web (Vite/Next)

```bash
pnpm add dazo-ui react-native-web react-native-svg lucide-react
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

The package expects these peer dependencies in consumer apps:

- react >= 19.2.4
- react-native >= 0.81.5
- react-native-web >= 0.19.0
- react-native-svg ^15.15.4
- lucide-react-native >= 0.300.0
- lucide-react >= 0.300.0
- expo-document-picker ^14.0.8 (optional)

## Notes

- For FileInput on web-only projects, expo-document-picker is optional.
- For best consistency, wrap the full application tree once with ThemeProvider.
