import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { Progress } from './index'

const bar = (track: HTMLElement) => getComputedStyle(track.firstElementChild as HTMLElement)

describe('Progress', () => {
  it('is announced as a progress bar with its label and value', () => {
    renderWithTheme(<Progress value={40} label='Uploading' />)

    const progress = screen.getByRole('progressbar', { name: 'Uploading' })
    expect(progress.getAttribute('aria-valuenow')).toBe('40')
    expect(progress.getAttribute('aria-valuemin')).toBe('0')
    expect(progress.getAttribute('aria-valuemax')).toBe('100')
  })

  it('fills the share of the track that is done', () => {
    renderWithTheme(<Progress value={3} max={5} label='Step 3 of 5' />)

    expect(bar(screen.getByRole('progressbar')).width).toBe('60%')
  })

  it('keeps values inside 0 and max', () => {
    renderWithTheme(
      <>
        <Progress value={150} label='Over' />
        <Progress value={-5} label='Under' />
      </>,
    )

    expect(screen.getByRole('progressbar', { name: 'Over' }).getAttribute('aria-valuenow')).toBe('100')
    expect(bar(screen.getByRole('progressbar', { name: 'Over' })).width).toBe('100%')
    expect(screen.getByRole('progressbar', { name: 'Under' }).getAttribute('aria-valuenow')).toBe('0')
  })

  it('has no value when the progress is unknown', () => {
    renderWithTheme(<Progress label='Syncing' />)

    const progress = screen.getByRole('progressbar', { name: 'Syncing' })
    expect(progress.hasAttribute('aria-valuenow')).toBe(false)
    expect(progress.hasAttribute('aria-valuemax')).toBe(false)
  })

  it('uses the primary color, a tone, and the secondary surface for the track', () => {
    renderWithTheme(
      <>
        <Progress value={10} label='Default' />
        <Progress value={10} label='Danger' tone='danger' />
      </>,
    )
    const { colors } = lightTheme

    expect(getComputedStyle(screen.getByRole('progressbar', { name: 'Default' })).backgroundColor).toBe(hexToRgb(colors.secondary))
    expect(bar(screen.getByRole('progressbar', { name: 'Default' })).backgroundColor).toBe(hexToRgb(colors.primary))
    expect(bar(screen.getByRole('progressbar', { name: 'Danger' })).backgroundColor).toBe(hexToRgb(colors.danger))
  })

  it('sizes: sm is 4 high, md is 8 high', () => {
    renderWithTheme(
      <>
        <Progress value={1} label='sm' size='sm' />
        <Progress value={1} label='md' />
      </>,
    )

    expect(getComputedStyle(screen.getByRole('progressbar', { name: 'sm' })).height).toBe('4px')
    expect(getComputedStyle(screen.getByRole('progressbar', { name: 'md' })).height).toBe('8px')
  })
})
