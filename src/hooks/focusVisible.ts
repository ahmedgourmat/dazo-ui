// iOS and Android draw their own focus indicators for keyboard and switch
// users, so there is no extra ring. The web build uses focusVisible.web.ts.

/** Call once in a component that draws a focus ring. */
export const useFocusVisibleTracking = (): void => {}

/** Whether a focused element should show the focus ring: never on iOS and Android. */
export const isFocusVisible: (focused: boolean | undefined) => boolean = () => false
