import { act, fireEvent, screen } from '@testing-library/react'
import { createElement, forwardRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../../styles/theme'
import { hexToRgb, renderWithTheme } from '../../test/utils'
import { Textarea } from './index'

// Records the props each TextInput receives, then renders the real one, so the
// tests can report a content size (jsdom has no layout to measure).
const textInputProps = vi.hoisted(() => [] as Record<string, unknown>[])
vi.mock('react-native', async (importOriginal) => {
  const rn = await importOriginal<typeof import('react-native')>()
  const TextInput = forwardRef((props: Record<string, unknown>, ref) => {
    textInputProps.push(props)
    return createElement(rn.TextInput as React.ElementType, { ...props, ref })
  })
  return { ...rn, TextInput }
})
const lastProps = () => textInputProps[textInputProps.length - 1]
const field = (placeholder: string) => screen.getByPlaceholderText(placeholder) as HTMLTextAreaElement

/** Pretend the text now takes `height` pixels, as React Native reports it. */
const reportContentHeight = (height: number) =>
  act(() => {
    const onContentSizeChange = lastProps().onContentSizeChange as (event: object) => void
    onContentSizeChange({ nativeEvent: { contentSize: { width: 200, height } } })
  })

describe('Textarea', () => {
  it('is a multiline field (a <textarea> on the web)', () => {
    renderWithTheme(<Textarea placeholder='Bio' />)

    expect(field('Bio').tagName).toBe('TEXTAREA')
  })

  it('uncontrolled: keeps its own text, starting from defaultValue', () => {
    const onChangeText = vi.fn()
    renderWithTheme(<Textarea placeholder='Bio' defaultValue='Hi' onChangeText={onChangeText} />)
    expect(field('Bio').value).toBe('Hi')

    fireEvent.change(field('Bio'), { target: { value: 'Hello there' } })

    expect(field('Bio').value).toBe('Hello there')
    expect(onChangeText).toHaveBeenCalledWith('Hello there')
  })

  it('controlled: shows `value` and only reports changes', () => {
    const onChangeText = vi.fn()
    renderWithTheme(<Textarea placeholder='Bio' value='Fixed' onChangeText={onChangeText} />)

    fireEvent.change(field('Bio'), { target: { value: 'Changed' } })

    expect(onChangeText).toHaveBeenCalledWith('Changed')
    expect(field('Bio').value).toBe('Fixed')
  })

  describe('height', () => {
    const lineHeight = lightTheme.leading.base // md text: 16px on 24px lines

    it('shows `rows` lines when empty', () => {
      renderWithTheme(<Textarea placeholder='Bio' rows={4} />)

      expect(getComputedStyle(field('Bio')).height).toBe(`${4 * lineHeight}px`)
    })

    it('grows with its text up to `maxRows`, then stops (and scrolls)', () => {
      renderWithTheme(<Textarea placeholder='Bio' rows={2} maxRows={5} />)

      reportContentHeight(3 * lineHeight)
      expect(getComputedStyle(field('Bio')).height).toBe(`${3 * lineHeight}px`)

      reportContentHeight(20 * lineHeight)
      expect(getComputedStyle(field('Bio')).height).toBe(`${5 * lineHeight}px`)
    })

    it('stays at `rows` without maxRows', () => {
      renderWithTheme(<Textarea placeholder='Bio' rows={3} />)

      reportContentHeight(10 * lineHeight)
      expect(getComputedStyle(field('Bio')).height).toBe(`${3 * lineHeight}px`)
    })

    it('still calls your onContentSizeChange', () => {
      const onContentSizeChange = vi.fn()
      renderWithTheme(<Textarea placeholder='Bio' onContentSizeChange={onContentSizeChange} />)

      reportContentHeight(48)
      // react-native-web also reports a size itself when the field mounts.
      expect(onContentSizeChange).toHaveBeenLastCalledWith({ nativeEvent: { contentSize: { width: 200, height: 48 } } })
    })
  })

  describe('count', () => {
    it('shows "length / maxLength", linked to the field as its description', () => {
      renderWithTheme(<Textarea placeholder='Bio' defaultValue='Hello' maxLength={280} showCount />)

      const count = screen.getByText('5 / 280')
      expect(field('Bio').getAttribute('aria-describedby')).toBe(count.id)
      expect(field('Bio').maxLength).toBe(280)
    })

    it('follows the text and turns `danger` at the limit', () => {
      renderWithTheme(<Textarea placeholder='Bio' maxLength={5} showCount />)

      fireEvent.change(field('Bio'), { target: { value: 'Hey' } })
      expect(getComputedStyle(screen.getByText('3 / 5')).color).toBe(hexToRgb(lightTheme.colors.foregroundMuted))

      fireEvent.change(field('Bio'), { target: { value: 'Hello' } })
      expect(getComputedStyle(screen.getByText('5 / 5')).color).toBe(hexToRgb(lightTheme.colors.danger))
    })

    it('shows just the length without maxLength', () => {
      renderWithTheme(<Textarea placeholder='Bio' defaultValue='abc' showCount />)

      expect(screen.getByText('3')).toBeTruthy()
    })
  })

  it('looks like Input: the `input` edge, and `invalid` sets a danger edge and aria-invalid', () => {
    renderWithTheme(
      <>
        <Textarea placeholder='Ok' />
        <Textarea placeholder='Bad' invalid />
      </>,
    )
    const edge = (placeholder: string) => getComputedStyle(field(placeholder).parentElement as HTMLElement).borderTopColor

    expect(edge('Ok')).toBe(hexToRgb(lightTheme.colors.input))
    expect(edge('Bad')).toBe(hexToRgb(lightTheme.colors.danger))
    expect(field('Bad').getAttribute('aria-invalid')).toBe('true')
  })

  it('styles the box with style props and keeps them off the TextInput', () => {
    renderWithTheme(<Textarea placeholder='Bio' marginTop='lg' width={300} testID='bio' />)

    expect(getComputedStyle(field('Bio').parentElement as HTMLElement).marginTop).toBe('24px')
    expect(Object.keys(lastProps())).not.toContain('marginTop')
    expect(lastProps().testID).toBe('bio')
  })
})
