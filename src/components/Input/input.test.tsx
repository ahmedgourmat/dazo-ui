import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Input } from './index'

describe('Input', () => {
  it('shows its value and placeholder', () => {
    renderWithTheme(<Input value='hello' placeholder='Email' />)

    const input = screen.getByPlaceholderText('Email') as HTMLInputElement
    expect(input.value).toBe('hello')
  })

  it('calls onChangeText with the typed text', () => {
    const onChangeText = vi.fn()
    renderWithTheme(<Input value='' placeholder='Email' onChangeText={onChangeText} />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.co' } })

    expect(onChangeText).toHaveBeenCalledWith('a@b.co')
  })

  it('is read-only when not editable', () => {
    renderWithTheme(<Input placeholder='Email' editable={false} />)

    expect((screen.getByPlaceholderText('Email') as HTMLInputElement).readOnly).toBe(true)
  })

  it('passes native TextInput props through', () => {
    renderWithTheme(<Input placeholder='Password' secureTextEntry maxLength={8} />)

    const input = screen.getByPlaceholderText('Password') as HTMLInputElement
    expect(input.type).toBe('password')
    expect(input.maxLength).toBe(8)
  })

  it('renders left and right icons', () => {
    renderWithTheme(<Input placeholder='Search' leftIcon={<span>search</span>} rightIcon={<span>clear</span>} />)

    expect(screen.getByText('search')).toBeTruthy()
    expect(screen.getByText('clear')).toBeTruthy()
  })
})
