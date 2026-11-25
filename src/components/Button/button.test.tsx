import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Button } from './index'

describe('Button', () => {
  it('shows its label and calls onPress when clicked', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress while disabled', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} disabled />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).not.toHaveBeenCalled()
  })

  it('does not call onPress while loading, and shows a spinner', () => {
    const onPress = vi.fn()
    renderWithTheme(<Button label='Save' onPress={onPress} loading />)

    fireEvent.click(screen.getByText('Save'))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  it('renders left and right icons, and `icon` as the left icon', () => {
    renderWithTheme(
      <>
        <Button label='A' leftIcon={<span>left</span>} rightIcon={<span>right</span>} />
        <Button label='B' icon={<span>legacy</span>} />
      </>,
    )

    expect(screen.getByText('left')).toBeTruthy()
    expect(screen.getByText('right')).toBeTruthy()
    expect(screen.getByText('legacy')).toBeTruthy()
  })

  it('prefers leftIcon over icon when both are given', () => {
    renderWithTheme(<Button label='A' leftIcon={<span>left</span>} icon={<span>legacy</span>} />)

    expect(screen.getByText('left')).toBeTruthy()
    expect(screen.queryByText('legacy')).toBeNull()
  })
})
