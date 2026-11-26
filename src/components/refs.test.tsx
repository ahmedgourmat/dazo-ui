import { fireEvent, screen } from '@testing-library/react'
import { createRef, useRef } from 'react'
import type { ScrollView, Text as RNText, TextInput, View } from 'react-native'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../test/utils'
import { Button, Checkbox, Container, FileInput, Input, RadioGroup, Select, Table, Text } from '../index'

// Issue #48. In React 19 `ref` is a normal prop, so every component takes one
// and hands it to the element that matters most. react-native-web makes that
// element's DOM node the ref, which is what these compare against.
describe('every component forwards its ref (#48)', () => {
  it('Input: the TextInput itself, so it can be focused', () => {
    const ref = createRef<TextInput>()
    const onFocus = vi.fn()
    renderWithTheme(<Input ref={ref} placeholder='Email' onFocus={onFocus} />)

    expect(ref.current).toBe(screen.getByPlaceholderText('Email'))
    ref.current?.focus()
    expect(document.activeElement).toBe(screen.getByPlaceholderText('Email'))
    expect(ref.current?.isFocused()).toBe(true)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('Input: moving to the next field on submit, the common form pattern', () => {
    const SignIn = () => {
      const password = useRef<TextInput>(null)
      return (
        <>
          <Input placeholder='Email' onSubmitEditing={() => password.current?.focus()} />
          <Input ref={password} placeholder='Password' secureTextEntry />
        </>
      )
    }
    renderWithTheme(<SignIn />)

    fireEvent.keyDown(screen.getByPlaceholderText('Email'), { key: 'Enter' })

    expect(document.activeElement).toBe(screen.getByPlaceholderText('Password'))
  })

  it('Input: callback refs get the element, and null on unmount', () => {
    const ref = vi.fn()
    const { unmount } = renderWithTheme(<Input ref={ref} placeholder='Email' />)

    expect(ref).toHaveBeenLastCalledWith(screen.getByPlaceholderText('Email'))
    unmount()
    expect(ref).toHaveBeenLastCalledWith(null)
  })

  it('Button: the pressable button, so it can be focused', () => {
    const ref = createRef<View>()
    renderWithTheme(<Button ref={ref} label='Save' />)

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }))
    ref.current?.focus()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Save' }))
  })

  it('Checkbox: the pressable checkbox', () => {
    const ref = createRef<View>()
    renderWithTheme(<Checkbox ref={ref} label='Remember me' />)

    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Remember me' }))
  })

  it('Select: the field that opens the menu', () => {
    const ref = createRef<View>()
    renderWithTheme(<Select ref={ref} label='Plan' placeholder='Pick a plan' options={[{ label: 'Pro', value: 'pro' }]} />)

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Plan Pick a plan' }))
  })

  it('FileInput: the picker field', () => {
    const ref = createRef<View>()
    renderWithTheme(<FileInput ref={ref} label='Attachment' placeholder='Pick' />)

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Attachment Pick' }))
  })

  it('RadioGroup: the group of options', () => {
    const ref = createRef<View>()
    renderWithTheme(<RadioGroup ref={ref} options={[{ label: 'Admin', value: 'admin' }]} />)

    expect(ref.current).toBe(screen.getByRole('radiogroup'))
  })

  it('Text: the text element', () => {
    const ref = createRef<RNText>()
    renderWithTheme(<Text ref={ref}>Hello</Text>)

    expect(ref.current).toBe(screen.getByText('Hello'))
  })

  it('Table: the table, with or without horizontal scrolling', () => {
    for (const horizontalScroll of [false, true]) {
      const ref = createRef<View>()
      const { unmount } = renderWithTheme(
        <Table ref={ref} horizontalScroll={horizontalScroll} columns={[{ key: 'name', title: 'Name' }]} data={[{ name: 'Ada' }]} />,
      )

      const table = ref.current as unknown as HTMLElement
      expect(table.textContent).toBe('NameAda')
      unmount()
    }
  })

  it('Container: the View', () => {
    const ref = createRef<View>()
    renderWithTheme(
      <Container ref={ref}>
        <Text>Inside</Text>
      </Container>,
    )

    expect(ref.current).toBe(screen.getByText('Inside').parentElement)
  })

  it('Container: the ScrollView when scrollable, with its scroll methods', () => {
    const ref = createRef<ScrollView>()
    renderWithTheme(
      <Container ref={ref} scrollable>
        <Text>Inside</Text>
      </Container>,
    )

    expect(typeof ref.current?.scrollTo).toBe('function')
    expect(typeof ref.current?.scrollToEnd).toBe('function')
  })
})
