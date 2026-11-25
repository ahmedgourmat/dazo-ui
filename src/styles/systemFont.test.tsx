import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../components/Button'
import { Text } from '../components/Text'
import { renderWithTheme } from '../test/utils'
import { systemFont } from './systemFont'
import { systemFont as webSystemFont } from './systemFont.web'
import { lightTheme } from './theme'

// Issue #41: the token used to be 'system', which isn't a font on any platform
// (iOS only knows 'System', and CSS needs a real stack such as system-ui).
describe('default font family (#41)', () => {
  // `./systemFont` is systemFont.ts in the native run and systemFont.web.ts in the web run.
  it('is left unset on iOS and Android, so each uses its own system font', ({ task, skip }) => {
    if (task.file.projectName !== 'native') skip()
    expect(systemFont).toBeUndefined()
  })

  it('is a CSS system font stack on web, ending in a generic family', () => {
    expect(webSystemFont).toMatch(/^system-ui,/)
    expect(webSystemFont).toMatch(/, sans-serif$/)
  })

  it('is what the theme uses for every weight in this build', () => {
    expect(lightTheme.fontFamily).toEqual({ regular: systemFont, medium: systemFont, bold: systemFont })
  })

  // In the web run this is the stack above; in the native run the family is
  // unset, so react-native-web's own system stack applies.
  it("reaches the page as a system font stack, not the invalid family 'system'", () => {
    renderWithTheme(
      <>
        <Text>Body</Text>
        <Text variant='title'>Title</Text>
        <Button label='Save' />
      </>,
    )

    for (const text of ['Body', 'Title', 'Save']) {
      const family = getComputedStyle(screen.getByText(text)).fontFamily
      expect(family).not.toBe('system')
      expect(family).toMatch(/sans-serif$/)
    }
  })
})
