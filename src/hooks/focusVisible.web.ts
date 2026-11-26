import { useEffect } from 'react'

// Like CSS :focus-visible, which inline styles can't use: the ring shows when
// focus came from the keyboard (Tab, arrows, or focus moved by a key press),
// not after a click or tap, which already shows where the user is.
let keyboard = false
let listening = false

// The library is built without DOM types, since it also runs on iOS and Android.
type KeyEvent = { metaKey: boolean; ctrlKey: boolean; altKey: boolean }
type EventTarget = { addEventListener: (type: string, listener: (event: KeyEvent) => void, capture: boolean) => void }

const onKeyDown = (event: KeyEvent): void => {
  if (!event.metaKey && !event.ctrlKey && !event.altKey) keyboard = true
}
const onPointer = (): void => {
  keyboard = false
}

const listen = (): void => {
  const doc = (globalThis as unknown as { document?: EventTarget }).document
  if (listening || !doc) return
  listening = true
  doc.addEventListener('keydown', onKeyDown, true)
  doc.addEventListener('pointerdown', onPointer, true)
  doc.addEventListener('mousedown', onPointer, true)
  doc.addEventListener('touchstart', onPointer, true)
}

/** Call once in a component that draws a focus ring: starts following the input method. */
export const useFocusVisibleTracking = (): void => {
  useEffect(listen, [])
}

/** Whether a focused element should show the focus ring: it is focused, by keyboard. */
export const isFocusVisible = (focused: boolean | undefined): boolean => Boolean(focused) && keyboard
