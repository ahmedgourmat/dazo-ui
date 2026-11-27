import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Spinner } from './index'

describe('Spinner', () => {
  it('is announced as a progress indicator named "Loading"', () => {
    renderWithTheme(<Spinner />)

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeTruthy()
  })

  it('takes its own label', () => {
    renderWithTheme(<Spinner label='Loading messages' />)

    expect(screen.getByRole('progressbar', { name: 'Loading messages' })).toBeTruthy()
  })

  it('is a single element for screen readers: the indicator inside is hidden', () => {
    renderWithTheme(<Spinner />)

    expect(screen.getAllByRole('progressbar')).toHaveLength(1)
  })

  it('scales the small indicator down for sm, and uses the large one for lg', () => {
    renderWithTheme(
      <>
        <Spinner testID='sm' size='sm' />
        <Spinner testID='lg' size='lg' />
      </>,
    )
    const indicator = (id: string) => screen.getByTestId(id).firstElementChild as HTMLElement

    expect(getComputedStyle(indicator('sm')).transform).toContain('scale(0.8)')
    expect(getComputedStyle(indicator('lg').firstElementChild as HTMLElement).width).toBe('36px')
  })

  it('accepts style props', () => {
    renderWithTheme(<Spinner testID='spinner' marginTop='md' />)

    expect(getComputedStyle(screen.getByTestId('spinner')).marginTop).toBe('16px')
  })
})
