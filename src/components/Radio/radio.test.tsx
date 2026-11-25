import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { RadioGroup } from './index'

const options = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer', disabled: true },
]

describe('RadioGroup', () => {
  it('shows every option', () => {
    renderWithTheme(<RadioGroup options={options} />)

    for (const option of options) expect(screen.getByText(option.label)).toBeTruthy()
  })

  it('calls onChange with the value of the clicked option', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} value='admin' onChange={onChange} />)

    fireEvent.click(screen.getByText('Editor'))

    expect(onChange).toHaveBeenCalledWith('editor')
  })

  it('ignores clicks on a disabled option', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} onChange={onChange} />)

    fireEvent.click(screen.getByText('Viewer'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('ignores clicks on every option when the group is disabled', () => {
    const onChange = vi.fn()
    renderWithTheme(<RadioGroup options={options} onChange={onChange} disabled />)

    fireEvent.click(screen.getByText('Admin'))
    fireEvent.click(screen.getByText('Editor'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders option icons', () => {
    renderWithTheme(<RadioGroup options={[{ label: 'Admin', value: 'admin', icon: <span>shield</span> }]} />)

    expect(screen.getByText('shield')).toBeTruthy()
  })
})
