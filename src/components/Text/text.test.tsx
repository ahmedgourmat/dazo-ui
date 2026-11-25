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

  // Known bug, issue #38: `lines` splits words across lines with "\n" instead
  // of limiting how many lines are shown.
  it.todo('treats `lines` as a maximum number of lines (#38)')
})
