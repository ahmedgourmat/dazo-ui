import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { Badge } from './index'

const { colors } = lightTheme
const box = (id: string) => getComputedStyle(screen.getByTestId(id))
const text = (label: string) => getComputedStyle(screen.getByText(label))

describe('Badge', () => {
  it('shows its label', () => {
    renderWithTheme(<Badge>New</Badge>)

    expect(screen.getByText('New')).toBeTruthy()
  })

  it('solid: the tone fills it, with that tone’s foreground for the text', () => {
    renderWithTheme(
      <>
        <Badge testID='neutral'>Draft</Badge>
        <Badge testID='danger' tone='danger'>Failed</Badge>
        <Badge testID='success' tone='success'>Paid</Badge>
      </>,
    )

    expect([box('neutral').backgroundColor, text('Draft').color]).toEqual([hexToRgb(colors.primary), hexToRgb(colors.primaryForeground)])
    expect([box('danger').backgroundColor, text('Failed').color]).toEqual([hexToRgb(colors.danger), hexToRgb(colors.dangerForeground)])
    expect([box('success').backgroundColor, text('Paid').color]).toEqual([hexToRgb(colors.success), hexToRgb(colors.successForeground)])
  })

  it('subtle and outline: neutral text, and a dot in the tone’s color', () => {
    renderWithTheme(
      <>
        <Badge testID='subtle' tone='warning' variant='subtle'>Pending</Badge>
        <Badge testID='outline' tone='info' variant='outline'>Beta</Badge>
      </>,
    )
    const dot = (id: string) => getComputedStyle(screen.getByTestId(id).firstElementChild as HTMLElement)

    expect(box('subtle').backgroundColor).toBe(hexToRgb(colors.secondary))
    expect(text('Pending').color).toBe(hexToRgb(colors.foreground))
    expect(dot('subtle').backgroundColor).toBe(hexToRgb(colors.warning))
    expect(box('outline').borderTopColor).toBe(hexToRgb(colors.borderStrong))
    expect(dot('outline').backgroundColor).toBe(hexToRgb(colors.info))
  })

  it('has no dot when neutral, and an icon replaces the dot', () => {
    renderWithTheme(
      <>
        <Badge testID='neutral' variant='subtle'>Draft</Badge>
        <Badge testID='icon' tone='success' variant='subtle' icon={<span>★</span>}>Starred</Badge>
      </>,
    )

    expect(screen.getByTestId('neutral').children).toHaveLength(1)
    expect(screen.getByTestId('icon').children).toHaveLength(2)
    expect(screen.getByText('★')).toBeTruthy()
  })

  it('sizes: sm is 20 high with 12px text, md is 24 high with 14px text', () => {
    renderWithTheme(
      <>
        <Badge testID='sm' size='sm'>Small</Badge>
        <Badge testID='md'>Medium</Badge>
      </>,
    )

    expect([box('sm').minHeight, text('Small').fontSize]).toEqual(['20px', '12px'])
    expect([box('md').minHeight, text('Medium').fontSize]).toEqual(['24px', '14px'])
  })

  it('renders other content as it is', () => {
    renderWithTheme(<Badge><span>custom</span></Badge>)

    expect(screen.getByText('custom').tagName).toBe('SPAN')
  })
})
