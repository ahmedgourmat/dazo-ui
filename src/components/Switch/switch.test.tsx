import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, isDisabled, renderWithTheme } from '../../test/utils'
import { Switch } from './index'

const toggle = (name: string) => screen.getByRole('switch', { name })
const track = (name: string) => {
  const children = Array.from(toggle(name).children) as HTMLElement[]
  return getComputedStyle(children.find((child) => child.textContent === '') as HTMLElement)
}

describe('Switch', () => {
  it('is announced as a switch with its label, off by default', () => {
    renderWithTheme(<Switch label='Notifications' />)

    expect(toggle('Notifications').getAttribute('aria-checked')).toBe('false')
  })

  it('uncontrolled: toggles itself and reports the new state', () => {
    const onChange = vi.fn()
    renderWithTheme(<Switch label='Notifications' onChange={onChange} />)

    fireEvent.click(toggle('Notifications'))

    expect(toggle('Notifications').getAttribute('aria-checked')).toBe('true')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('uncontrolled: starts from defaultChecked', () => {
    renderWithTheme(<Switch label='Dark mode' defaultChecked />)

    expect(toggle('Dark mode').getAttribute('aria-checked')).toBe('true')
  })

  it('controlled: shows `checked` and only reports changes', () => {
    const onChange = vi.fn()
    const { rerender } = renderWithTheme(<Switch label='Wi-Fi' checked={false} onChange={onChange} />)

    fireEvent.click(toggle('Wi-Fi'))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(toggle('Wi-Fi').getAttribute('aria-checked')).toBe('false')

    rerender(<Switch label='Wi-Fi' checked onChange={onChange} />)
    expect(toggle('Wi-Fi').getAttribute('aria-checked')).toBe('true')
  })

  it('toggles with the Space key', () => {
    const onChange = vi.fn()
    renderWithTheme(<Switch label='Bluetooth' onChange={onChange} />)

    fireEvent.keyDown(toggle('Bluetooth'), { key: ' ' })

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does nothing while disabled, and says so', () => {
    const onChange = vi.fn()
    renderWithTheme(<Switch label='Airplane mode' onChange={onChange} disabled />)

    fireEvent.click(toggle('Airplane mode'))
    fireEvent.keyDown(toggle('Airplane mode'), { key: ' ' })

    expect(onChange).not.toHaveBeenCalled()
    expect(isDisabled(toggle('Airplane mode'))).toBe(true)
  })

  it('takes a name for screen readers when there is no visible label', () => {
    renderWithTheme(<Switch accessibilityLabel='Location' />)

    expect(toggle('Location')).toBeTruthy()
  })

  it('draws the track in `input` when off and `primary` when on', () => {
    renderWithTheme(
      <>
        <Switch label='Off' />
        <Switch label='On' defaultChecked />
      </>,
    )

    expect(track('Off').backgroundColor).toBe(hexToRgb(lightTheme.colors.input))
    expect(track('On').backgroundColor).toBe(hexToRgb(lightTheme.colors.primary))
  })

  it('puts the label first by default, and after the switch with labelPosition="end"', () => {
    renderWithTheme(
      <>
        <Switch label='Start' />
        <Switch label='End' labelPosition='end' />
      </>,
    )

    const labelFirst = (name: string) => toggle(name).firstElementChild?.textContent === name
    expect(labelFirst('Start')).toBe(true)
    expect(labelFirst('End')).toBe(false)
    // Side by side. Label first spreads them apart (a settings row); switch first keeps them together.
    expect(getComputedStyle(toggle('End')).flexDirection).toBe('row')
    expect(getComputedStyle(toggle('Start')).justifyContent).toBe('space-between')
    expect(getComputedStyle(toggle('End')).justifyContent).toBe('flex-start')
  })

  it('sizes: md is a 44 × 24 track, sm a 32 × 18 track', () => {
    renderWithTheme(
      <>
        <Switch label='md' />
        <Switch label='sm' size='sm' />
      </>,
    )

    expect([track('md').width, track('md').height]).toEqual(['44px', '24px'])
    expect([track('sm').width, track('sm').height]).toEqual(['32px', '18px'])
  })
})
