import { fireEvent, screen } from '@testing-library/react'
import { createRef, useRef, type JSX } from 'react'
import type { ScrollView, Text as RNText, TextInput, View } from 'react-native'
import { describe, expect, it, vi } from 'vitest'
import { renderWithTheme } from '../test/utils'
import { Avatar, Badge, Button, Checkbox, Container, Divider, FileInput, Input, Progress, RadioGroup, Select, Spinner, Switch, Table, Text, Textarea } from '../index'

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

  it('Textarea: the TextInput itself, so it can be focused', () => {
    const ref = createRef<TextInput>()
    renderWithTheme(<Textarea ref={ref} placeholder='Bio' />)

    expect(ref.current).toBe(screen.getByPlaceholderText('Bio'))
    ref.current?.focus()
    expect(document.activeElement).toBe(screen.getByPlaceholderText('Bio'))
  })

  it('Switch: the pressable switch, so it can be focused', () => {
    const ref = createRef<View>()
    renderWithTheme(<Switch ref={ref} label='Wi-Fi' />)

    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Wi-Fi' }))
    ref.current?.focus()
    expect(document.activeElement).toBe(screen.getByRole('switch', { name: 'Wi-Fi' }))
  })

  it('Spinner, Progress, Avatar, Badge and Divider: their outer View', () => {
    const spinner = createRef<View>()
    const progress = createRef<View>()
    const avatar = createRef<View>()
    const badge = createRef<View>()
    const divider = createRef<View>()
    renderWithTheme(
      <>
        <Spinner ref={spinner} label='Loading' />
        <Progress ref={progress} value={10} label='Upload' />
        <Avatar ref={avatar} name='Ada Lovelace' />
        <Badge ref={badge} testID='badge'>New</Badge>
        <Divider ref={divider} />
      </>,
    )

    expect(spinner.current).toBe(screen.getByRole('progressbar', { name: 'Loading' }))
    expect(progress.current).toBe(screen.getByRole('progressbar', { name: 'Upload' }))
    expect(avatar.current).toBe(screen.getByRole('img', { name: 'Ada Lovelace' }))
    expect(badge.current).toBe(screen.getByTestId('badge'))
    expect(divider.current).toBe(screen.getByRole('separator'))
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

// Issue #79. End-to-end tools (Detox, Maestro, Playwright) find elements by
// testID. Every component takes one and puts it on the element its ref points
// to; react-native-web renders it as data-testid.
describe('every component takes a testID, on the same element as its ref (#79)', () => {
  type Case = [name: string, render: (ref: { current: unknown }, testID: string) => JSX.Element]
  const options = [{ label: 'Pro', value: 'pro' }]
  const cases: Case[] = [
    ['Button', (ref, id) => <Button ref={ref as never} testID={id} label='Save' />],
    ['Checkbox', (ref, id) => <Checkbox ref={ref as never} testID={id} label='Remember me' />],
    ['Container', (ref, id) => <Container ref={ref as never} testID={id}><Text>Inside</Text></Container>],
    ['Container (scrollable)', (ref, id) => <Container ref={ref as never} testID={id} scrollable><Text>Inside</Text></Container>],
    ['FileInput', (ref, id) => <FileInput ref={ref as never} testID={id} label='Attachment' />],
    ['Input', (ref, id) => <Input ref={ref as never} testID={id} placeholder='Email' />],
    ['RadioGroup', (ref, id) => <RadioGroup ref={ref as never} testID={id} options={options} />],
    ['Select', (ref, id) => <Select ref={ref as never} testID={id} label='Plan' options={options} />],
    ['Table', (ref, id) => <Table ref={ref as never} testID={id} columns={[{ key: 'name', title: 'Name' }]} data={[{ name: 'Ada' }]} />],
    ['Table (no horizontal scroll)', (ref, id) => <Table ref={ref as never} testID={id} horizontalScroll={false} columns={[{ key: 'name', title: 'Name' }]} data={[{ name: 'Ada' }]} />],
    ['Text', (ref, id) => <Text ref={ref as never} testID={id}>Hello</Text>],
    ['Textarea', (ref, id) => <Textarea ref={ref as never} testID={id} placeholder='Bio' />],
    ['Switch', (ref, id) => <Switch ref={ref as never} testID={id} label='Wi-Fi' />],
    ['Spinner', (ref, id) => <Spinner ref={ref as never} testID={id} />],
    ['Progress', (ref, id) => <Progress ref={ref as never} testID={id} value={10} />],
    ['Avatar', (ref, id) => <Avatar ref={ref as never} testID={id} name='Ada Lovelace' />],
    ['Badge', (ref, id) => <Badge ref={ref as never} testID={id}>New</Badge>],
    ['Divider', (ref, id) => <Divider ref={ref as never} testID={id} />],
  ]

  it.each(cases)('%s', (_, render) => {
    const ref = createRef<unknown>()
    renderWithTheme(render(ref, 'target'))

    const element = screen.getByTestId('target')
    expect(element.getAttribute('data-testid')).toBe('target')
    expect(element).toBe(ref.current)
  })
})
