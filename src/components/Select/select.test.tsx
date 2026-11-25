import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { finishModalAnimations, renderWithTheme } from '../../test/utils'
import { Select } from './index'

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Legacy', value: 'legacy', disabled: true },
]

const open = (triggerText: string) => fireEvent.click(screen.getByText(triggerText))

describe('Select', () => {
  it('shows the label and the placeholder when nothing is selected', () => {
    renderWithTheme(<Select label='Plan' options={options} />)

    expect(screen.getByText('Plan')).toBeTruthy()
    expect(screen.getByText('Select an option')).toBeTruthy()
  })

  it('shows the label of the selected option', () => {
    renderWithTheme(<Select options={options} value='pro' placeholder='Pick one' />)

    expect(screen.getByText('Pro')).toBeTruthy()
    expect(screen.queryByText('Pick one')).toBeNull()
  })

  it('keeps the options hidden until it is opened', () => {
    renderWithTheme(<Select options={options} />)
    expect(screen.queryByText('Starter')).toBeNull()

    open('Select an option')

    for (const option of options) expect(screen.getByText(option.label)).toBeTruthy()
  })

  it('calls onChange with the picked value and closes', () => {
    const onChange = vi.fn()
    renderWithTheme(<Select options={options} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Pro'))

    expect(onChange).toHaveBeenCalledWith('pro')
    finishModalAnimations()
    expect(screen.queryByText('Starter')).toBeNull()
  })

  it('ignores clicks on a disabled option', () => {
    const onChange = vi.fn()
    renderWithTheme(<Select options={options} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Legacy'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not open while disabled', () => {
    renderWithTheme(<Select options={options} disabled />)

    open('Select an option')

    expect(screen.queryByText('Starter')).toBeNull()
  })

  // Regression for #27: options after about the sixth could not be reached.
  it('renders every option of a long list', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ label: `Option ${i + 1}`, value: `o${i + 1}` }))
    const onChange = vi.fn()
    renderWithTheme(<Select options={many} onChange={onChange} />)

    open('Select an option')
    fireEvent.click(screen.getByText('Option 9'))

    expect(onChange).toHaveBeenCalledWith('o9')
  })
})
