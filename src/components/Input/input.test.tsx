import { fireEvent, screen } from '@testing-library/react'
import { createElement, forwardRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { Input } from './index'

// Records the props each TextInput receives, then renders the real one.
// react-native-web drops unknown props before they reach the page, so the DOM
// alone can't show what iOS and Android would have been given.
const textInputProps = vi.hoisted(() => [] as Record<string, unknown>[])
vi.mock('react-native', async (importOriginal) => {
  const rn = await importOriginal<typeof import('react-native')>()
  const TextInput = forwardRef((props: Record<string, unknown>, ref) => {
    textInputProps.push(props)
    return createElement(rn.TextInput as React.ElementType, { ...props, ref })
  })
  return { ...rn, TextInput }
})
const lastTextInputProps = () => textInputProps[textInputProps.length - 1]

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

  describe('style props (#39)', () => {
    const styleProps = {
      padding: 'md',
      marginTop: 'lg',
      width: 240,
      backgroundColor: 'primaryLight',
      borderRadius: 'lg',
      opacity: 0.9,
    } as const

    it('styles the field box with them, using theme tokens', () => {
      renderWithTheme(<Input placeholder='Email' {...styleProps} />)

      const box = getComputedStyle(screen.getByPlaceholderText('Email').parentElement as HTMLElement)
      expect(box.paddingTop).toBe(`${lightTheme.spacing.md}px`)
      expect(box.marginTop).toBe(`${lightTheme.spacing.lg}px`)
      expect(box.width).toBe('240px')
      expect(box.backgroundColor).toBe(hexToRgb(lightTheme.colors.primaryLight))
      expect(box.borderTopLeftRadius).toBe(`${lightTheme.radius.lg}px`)
      expect(box.opacity).toBe('0.9')
    })

    it('does not pass them to the TextInput', () => {
      renderWithTheme(<Input placeholder='Email' {...styleProps} />)

      const received = Object.keys(lastTextInputProps())
      for (const name of Object.keys(styleProps)) expect(received).not.toContain(name)
    })

    it('still passes every TextInput prop through', () => {
      const onSubmitEditing = vi.fn()
      renderWithTheme(
        <Input
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          testID='email'
          onSubmitEditing={onSubmitEditing}
          padding='md'
        />,
      )

      expect(lastTextInputProps()).toMatchObject({
        placeholder: 'Email',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        testID: 'email',
        onSubmitEditing,
      })
    })
  })

  describe('focus ring (#34)', () => {
    // The ring is drawn on the field's box, which wraps the text box itself.
    const field = () => screen.getByPlaceholderText('Email').parentElement as HTMLElement

    it("shows a ring in the theme's ring color while the field has focus, and hides it after", () => {
      renderWithTheme(<Input placeholder='Email' />)
      expect(field().style.outlineStyle).toBe('')

      fireEvent.focus(screen.getByPlaceholderText('Email'))
      expect(field().style.outlineStyle).toBe('solid')
      expect(field().style.outlineWidth).toBe('2px')
      expect(field().style.outlineColor).toBe(hexToRgb(lightTheme.colors.ring))

      fireEvent.blur(screen.getByPlaceholderText('Email'))
      expect(field().style.outlineStyle).toBe('')
    })

    // Otherwise the browser draws its own second ring around the bare text box.
    // jsdom has no browser focus ring to compare against, so this checks the CSS
    // class react-native-web generates: it must set outline-style (Chrome's ring
    // ignores outline-width: 0, which was tried and still showed the ring).
    it("turns off the browser's own ring on the text box inside the field", () => {
      renderWithTheme(<Input placeholder='Email' />)

      expect(screen.getByPlaceholderText('Email').className).toMatch(/\br-outlineStyle-/)
    })

    it('shows the ring for every variant, even with a custom style', () => {
      for (const variant of ['solid', 'outline', 'ghost'] as const) {
        const { unmount } = renderWithTheme(<Input placeholder='Email' variant={variant} style={{ borderWidth: 0 }} />)
        fireEvent.focus(screen.getByPlaceholderText('Email'))
        expect(field().style.outlineStyle).toBe('solid')
        unmount()
      }
    })

    it('still calls your onFocus and onBlur', () => {
      const onFocus = vi.fn()
      const onBlur = vi.fn()
      renderWithTheme(<Input placeholder='Email' onFocus={onFocus} onBlur={onBlur} />)

      fireEvent.focus(screen.getByPlaceholderText('Email'))
      fireEvent.blur(screen.getByPlaceholderText('Email'))

      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledTimes(1)
    })
  })

  it('renders left and right icons', () => {
    renderWithTheme(<Input placeholder='Search' leftIcon={<span>search</span>} rightIcon={<span>clear</span>} />)

    expect(screen.getByText('search')).toBeTruthy()
    expect(screen.getByText('clear')).toBeTruthy()
  })
})
