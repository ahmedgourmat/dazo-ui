import { useCallback, useState } from 'react'

/**
 * State that a component owns unless the app controls it: with `value`
 * (controlled) the app's value is used and changes only go to `onChange`;
 * with only `defaultValue` (uncontrolled) the component keeps the value itself.
 */
export const useControllableState = <T,>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] => {
  const [own, setOwn] = useState(defaultValue)
  const controlled = value !== undefined

  const set = useCallback((next: T) => {
    if (!controlled) setOwn(next)
    onChange?.(next)
  }, [controlled, onChange])

  return [controlled ? value : own, set]
}
