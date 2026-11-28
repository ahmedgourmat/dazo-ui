// `next` is an optional peer dependency of dazo-ui/next and isn't installed
// here. This declares the one function it uses, so the library compiles
// without pulling in Next.js. The app's own `next` provides it at runtime.
declare module 'next/navigation' {
  import type { ReactNode } from 'react'

  export function useServerInsertedHTML(callback: () => ReactNode): void
}
