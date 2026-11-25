import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Text } from './index'

describe('Text', () => {
  it('renders string, number and element children', () => {
    renderWithTheme(
      <>
        <Text>Hello</Text>
        <Text>{42}</Text>
        <Text>
          <span>nested</span>
        </Text>
      </>,
    )

    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText('42')).toBeTruthy()
    expect(screen.getByText('nested')).toBeTruthy()
  })

  it('cuts text longer than `letters` and adds an ellipsis', () => {
    renderWithTheme(<Text letters={5}>Hello world</Text>)

    expect(screen.getByText('Hello...')).toBeTruthy()
  })

  it('leaves text that already fits within `letters` alone', () => {
    renderWithTheme(<Text letters={20}>Short</Text>)

    expect(screen.getByText('Short')).toBeTruthy()
  })

  it('ignores invalid `letters` values', () => {
    renderWithTheme(
      <>
        <Text letters={0}>Zero letters</Text>
        <Text letters={-3}>Negative letters</Text>
      </>,
    )

    expect(screen.getByText('Zero letters')).toBeTruthy()
    expect(screen.getByText('Negative letters')).toBeTruthy()
  })

  describe('`lines` is a maximum number of lines (#38)', () => {
    // react-native-web turns numberOfLines into CSS line clamping; jsdom has no
    // layout, so these check the CSS instead of measuring lines.
    const clamp = (el: HTMLElement) => getComputedStyle(el).getPropertyValue('-webkit-line-clamp')

    it('keeps the text as written, without inserting line breaks', () => {
      renderWithTheme(<Text lines={3}>Hello there world</Text>)

      const text = screen.getByText('Hello there world')
      expect(text.textContent).toBe('Hello there world')
      expect(clamp(text)).toBe('3')
    })

    it('cuts a single line with an ellipsis when `lines` is 1', () => {
      renderWithTheme(<Text lines={1}>One line only</Text>)

      const style = getComputedStyle(screen.getByText('One line only'))
      expect(style.whiteSpace).toBe('nowrap')
      expect(style.textOverflow).toBe('ellipsis')
    })

    it('allows more lines than there are words', () => {
      renderWithTheme(<Text lines={4}>Two words</Text>)

      expect(clamp(screen.getByText('Two words'))).toBe('4')
    })

    it('works together with `letters`', () => {
      renderWithTheme(
        <Text lines={2} letters={11}>
          Hello world, again and again
        </Text>,
      )

      const text = screen.getByText('Hello world...')
      expect(clamp(text)).toBe('2')
    })

    it('ignores invalid values', () => {
      renderWithTheme(
        <>
          <Text lines={0}>Zero lines</Text>
          <Text lines={-2}>Negative lines</Text>
        </>,
      )

      expect(clamp(screen.getByText('Zero lines'))).toBe('')
      expect(clamp(screen.getByText('Negative lines'))).toBe('')
    })
  })
})
