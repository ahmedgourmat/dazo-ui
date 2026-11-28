# Contributing to Dazo UI

Thanks for helping. Issues and pull requests are welcome: bug fixes, new components, docs and tests.

- [Getting started](#getting-started)
- [Repository layout](#repository-layout)
- [Tests](#tests)
- [Component standard](#component-standard)
- [Adding a component](#adding-a-component)
- [Pull requests](#pull-requests)
- [Releasing (maintainers)](#releasing-maintainers)

## Getting started

You need Node 24 and pnpm 9.

```bash
pnpm install
pnpm --filter dazo-ui test          # library tests, run for the web and the native build
pnpm --filter native-tests test     # the native build, rendered by React Native itself
pnpm --filter visual test:visual    # screenshots of every component (see Tests below)
pnpm --filter web dev               # web showcase (Vite)
pnpm --filter mobile dev            # Expo showcase
pnpm --filter storybook storybook   # Storybook
```

Before opening a pull request, run what CI runs:

```bash
pnpm turbo run typecheck lint test build check:package size
```

## Repository layout

| Folder | Contents |
|---|---|
| `src` | The `dazo-ui` package |
| `src/components/<Name>` | One folder per component |
| `src/styles` | Tokens (`tokens.ts`), the theme (`theme.ts`), shadows, interaction helpers |
| `src/hooks` | Shared hooks: style props, field styles, focus ring, reduced motion, keyboard |
| `src/test` | Test setup, helpers and cross-component tests (accessibility, design system) |
| `apps/web`, `apps/mobile` | Showcases for the web and Expo |
| `apps/storybook` | Storybook |
| `apps/native-tests` | Jest tests of the native build, rendered by React Native |
| `apps/visual` | A page with every component and state, and its Playwright screenshot tests |

The package is built twice. The web build prefers `*.web.ts(x)` files and the native build prefers `*.native.ts(x)`. Use a platform file only when the code really differs; most components are a single file that works everywhere through react-native-web.

## Tests

There are three suites. CI runs all of them on every pull request.

| Suite | Where | What it catches |
|---|---|---|
| Library tests (Vitest) | `src/**/*.test.tsx` | Behavior, props, keyboard, accessibility (axe), refs. Renders through react-native-web in a simulated browser, so `Platform.OS` is always `web`. |
| Native tests (Jest) | `apps/native-tests/tests` | The native build (`dist/native`) rendered by React Native 0.81 with React Native Testing Library: roles and states as VoiceOver and TalkBack get them, and the iOS/Android-only code (FormField's labels and hints, `Animated` animations, shadows, the FileInput picker warning). |
| Screenshots (Playwright) | `apps/visual` | How everything looks: every component and state in light and dark, plus keyboard focus, hover and an open Select. |

### Native tests

```bash
pnpm turbo run test --filter=native-tests   # builds dazo-ui first
```

They load the built package, so after changing `src`, rebuild it (`pnpm --filter dazo-ui build`) or run them through Turbo as above. The first run compiles React Native and takes about half a minute.

### Screenshots

The page in `apps/visual/src/Fixtures.tsx` shows every component in every state. The tests take one screenshot per section and compare it with the reference in `apps/visual/tests/__screenshots__`.

```bash
npx playwright install chromium               # once
pnpm turbo run test:visual --filter=visual    # builds dazo-ui and the page, then compares
```

The references are made on Linux, in the Docker image CI uses (`mcr.microsoft.com/playwright:v1.65.1-noble`), because fonts and anti-aliasing differ between systems. On Windows and macOS the tests compare against a separate, git-ignored folder (`__screenshots__/win32`, `__screenshots__/darwin`): create it with `npx playwright test --update-snapshots` before your change, then run the tests after it to see what moved.

The CI screenshot job is off until the Linux references are committed. Once they are, set the repository variable `VISUAL_TESTS` to `true` (Settings → Secrets and variables → Actions → Variables) to turn it on.

**When a change is meant to look different,** update the references and commit them with the change:

- **With Docker:** `pnpm --filter visual test:visual:update`.
- **Without Docker:** run the **Update screenshots** workflow on your branch (Actions → Update screenshots → Run workflow), download its `screenshots` artifact, and copy the PNGs into `apps/visual/tests/__screenshots__`.

Review the new images before committing: they are what every later change is compared against.

**When CI fails on a screenshot,** download the `screenshot-diffs` artifact from the run and open `playwright-report/index.html`: it shows the expected, actual and difference images side by side.

**New component or state:** add it to `Fixtures.tsx` (in the right section, or a new section listed in `tests/components.spec.ts`), then update the references.

## Component standard

Every component, new or changed, meets all of the following. Issues for new components link here instead of repeating it, and reviews check it.

### 1. Platforms
- Works on **iOS, Android and the web** (through react-native-web). It's checked in the Expo app and the web showcase, not only in tests.
- Respects each platform's conventions: hover only on the web, `hitSlop` for small targets on touch screens, the Android back button for anything that opens.

### 2. API
- **Names match the existing components:**
  - `size`: `sm` · `md` · `lg` · `xl`, following `theme.controlHeight`.
  - Also `variant`, `disabled`, `label`, `leftIcon` / `rightIcon`, `style`, and `<part>Style` for inner parts (`labelStyle`).
- **Controlled and uncontrolled:** `value` with `onChange`, or `defaultValue` alone (`checked` / `defaultChecked` for toggles).
  - Build it with `useControllableState(value, defaultValue, onChange)` from `hooks/controllable`, so every component behaves the same.
  - `undefined` means uncontrolled. A component where nothing can be selected (Select, RadioGroup) also takes `null`: controlled, with nothing selected, so a form can clear it.
- **`ref`:** a normal prop (React 19, no `forwardRef`), passed to the element that matters most. Document what `ref.current` is.
- **`testID`:** passed to the same element as the `ref`.
- **Style props:** accepts the shared style props (`CommonProps`) and resolves them with `useCommonStyles`. A component that also passes props to a native element (like Input) splits them first with `splitCommonProps`.
- **Docs in the types:** every prop has a JSDoc comment, and the defaults are stated.
- **Form controls read the FormField around them** with `useFormField()`:
  - merge its `invalid` and `disabled` with their own props;
  - spread `formFieldProps(field, kind)` on the element screen readers focus, so it's named by the label and described by the helper text or error.
- **No new runtime dependencies.** Native integrations, such as a date picker, are optional adapters passed in by the app, like `FileInput`'s `customPicker` / `expoDocumentPicker`.

### 3. Theming
- **Semantic tokens only:** `theme.colors.*`, `space`, `radius`, `fontSize` / `leading`, `controlHeight`, `shadow`, `motion`. No hex colors or magic numbers that a token covers.
- **Light and dark:** looks right in both themes and with every accent (`accent="blue"`, …).
- **Theme overrides:** follows `ThemeProvider` overrides, because it reads everything through `useTheme()`.

### 4. Accessibility
- **Roles and states:** the right `role` and `aria-*` states (checked, selected, expanded, disabled, busy, invalid, modal, …), named by its visible label.
- **Web keyboard:** follows the matching [ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/): Tab order, Enter and Space, arrow keys, Escape to close. Use `spaceKeyActivates` where react-native-web doesn't handle Space.
- **Focus ring:** visible keyboard focus with `isFocusVisible` + `focusRing(theme)`, and `useFocusVisibleTracking()` once in the component.
- **Touch targets:** at least 44 points on iOS and Android.
- **Not color alone:** color is never the only signal; pair it with text, an icon or a shape.
- **Reduced motion:** animations are skipped when `useReducedMotion()` is true.
- **Overlays:** move focus in when they open and back when they close, and keep it inside while open.

### 5. States
- **Shared looks:** hover (web), pressed, focus, disabled (`DISABLED_OPACITY`), and, where they apply, loading, invalid, selected and read-only.
- **How to get them:** hover and focus come from Pressable's style callback (`InteractionState`). React Native only passes `pressed`, so hover never shows on touch screens.
- **Skeleton mode:** inside `<Skeleton loading>`, the component draws a placeholder in its exact size and shape.
  - **How:** export it as `withSkeleton(NameBase, NameSkeleton)`. The placeholder uses `SkeletonBox` with the same layout styles and tokens as the real component, and applies the style props.
  - **Text:** where a size depends on text (labels, values), render that text in `HIDDEN_TEXT`, so the width matches.
  - **No layout jump:** check that the loading and loaded versions have the same height.
  - **Exceptions:** pure layout components (Container, Divider) render as they are.

### 6. Performance and size
- **Styles:** static styles in `StyleSheet.create`, and theme-dependent styles in `useMemo` keyed on the theme.
- **Long lists** use `FlatList` / virtualization, never one element per row of data.
- **Size budget:** add a `"<Component> only"` entry to `src/.size-limit.json` for web and native. Raising the whole-library limit is a deliberate decision, made in the pull request.

### 7. Tests
- **Behavior:** `<name>.test.tsx` in the component folder covers rendering, every prop, controlled and uncontrolled use, keyboard and the callbacks. Tests run in both the `web` and `native` projects.
- **Accessibility:** the component's main states are added to `src/test/accessibility.test.tsx` (axe-core).
- **Ref:** added to `src/components/refs.test.tsx`.
- **Native:** its roles, states and any iOS/Android-only code are covered in `apps/native-tests`.
- **Visual:** every state that looks different is on the screenshot page (`apps/visual/src/Fixtures.tsx`), and the reference screenshots are updated. See [Screenshots](#screenshots).

### 8. Documentation
- **Library:** exported from `src/index.ts` along with its prop types.
- **Showcases and README:** added to Storybook (`apps/storybook/src/stories/library`), both showcases, and the README's Components section.
- **CHANGELOG:** an entry under `## [Unreleased]` in `src/CHANGELOG.md`.
- **Docs site:** a docs page in the docs site.

## Adding a component

```
src/components/Switch/
  index.tsx          export { Switch } from './switch'
  switch.tsx         the component
  switch.type.ts     SwitchProps, with JSDoc on every prop
  switch.hooks.ts    useSwitchStyles(): theme-dependent styles (optional)
  switch.test.tsx    behavior tests
```

1. Read the issue and the [component standard](#component-standard). If the proposed API needs to change, discuss it in the issue first.
2. Build the component, using an existing one with similar behavior as a model, e.g. Checkbox for a toggle, Select for something that opens.
3. Add the tests, stories, showcase entries, README section and CHANGELOG entry.
4. Run the CI command above.

## Pull requests

- **Branch** off `main` and keep each pull request to one issue. Write `Closes #<number>` in the description.
- **Commit messages** use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`.
- **Breaking changes** to the public API are called out in the description and in the CHANGELOG, and they wait for the next major version.
- **Visual changes** come with updated reference screenshots (see [Screenshots](#screenshots)); the diff in the pull request shows the before and after.

## Releasing (maintainers)

1. **CHANGELOG:** move the `[Unreleased]` entries under a new version heading with the date, and update the comparison links at the bottom.
2. **Version:** set it in `src/package.json`, following semver (breaking → major, new component → minor, fix → patch).
3. **Merge to `main`,** then tag and push: `git tag -a vX.Y.Z -m "dazo-ui X.Y.Z"` and `git push origin vX.Y.Z`.
4. **Publish** from a clean `main` after a fresh build: `pnpm --filter dazo-ui build`, then `cd src && npm publish`. The `prepack` script copies the root README and LICENSE into the package.
5. **GitHub release:** create one from the tag, with the CHANGELOG entry as notes.
