import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Container } from './index'

describe('Container', () => {
  it('renders its children', () => {
    renderWithTheme(
      <Container padding='md'>
        <span>inside</span>
      </Container>,
    )

    expect(screen.getByText('inside')).toBeTruthy()
  })

  it('renders its children inside a scroll view when scrollable', () => {
    const { container } = renderWithTheme(
      <Container scrollable>
        <span>scrolled</span>
      </Container>,
    )

    expect(screen.getByText('scrolled')).toBeTruthy()
    // react-native-web draws ScrollView as an element that scrolls vertically.
    const scrollers = [...container.querySelectorAll<HTMLElement>('*')].filter((el) =>
      el.className.includes('r-overflowY') || el.style.overflowY === 'auto',
    )
    expect(scrollers.length).toBeGreaterThan(0)
  })
})
