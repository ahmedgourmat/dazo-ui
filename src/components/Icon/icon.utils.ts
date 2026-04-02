import type { ComponentType } from 'react'

const normalizeIconName = (name: string) => {
  const normalized = name
    .replace(/[-_\s]+(.)?/g, (_, character: string | undefined) => (character ? character.toUpperCase() : ''))
    .replace(/[^a-zA-Z0-9]/g, '')

  if (!normalized) {
    return ''
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export const resolveLucideIcon = (
  name: string,
  icons: Record<string, unknown>,
): ComponentType<any> | null => {
  const directMatch = icons[name]

  if (directMatch) {
    return directMatch as ComponentType<any>
  }

  const normalizedName = normalizeIconName(name)

  if (normalizedName && icons[normalizedName]) {
    return icons[normalizedName] as ComponentType<any>
  }

  const caseInsensitiveMatch = Object.keys(icons).find(
    (iconName) => iconName.toLowerCase() === name.toLowerCase(),
  )

  if (caseInsensitiveMatch) {
    return icons[caseInsensitiveMatch] as ComponentType<any>
  }

  return null
}