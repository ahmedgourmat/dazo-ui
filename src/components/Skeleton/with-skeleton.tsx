import type { JSX } from 'react'
import { useSkeleton } from './skeleton.context'

/**
 * A component that draws `Placeholder` inside `<Skeleton loading>` and `Real`
 * everywhere else. They are two separate components, so the real one's hooks
 * and state start fresh when loading ends.
 */
export const withSkeleton = <P extends object>(
  Real: (props: P) => JSX.Element,
  Placeholder: (props: P) => JSX.Element,
): ((props: P) => JSX.Element) => {
  const WithSkeleton = (props: P): JSX.Element =>
    useSkeleton() ? <Placeholder {...props} /> : <Real {...props} />
  return WithSkeleton
}
