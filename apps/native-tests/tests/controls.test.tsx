import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, screen } from '@testing-library/react-native'
import { Button, Checkbox, FileInput, Input, RadioGroup, Select, Switch, Textarea } from 'dazo-ui'
import { renderWithTheme } from './utils'

// The controls rendered by React Native itself: their roles and states are
// what VoiceOver and TalkBack read, and presses go through Pressable.

describe('Button', () => {
  it('is a button named by its label, and presses call onPress', async () => {
    const onPress = jest.fn()
    await renderWithTheme(<Button label='Save' onPress={onPress} />)

    await fireEvent.press(screen.getByRole('button', { name: 'Save' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('while loading: busy, disabled, and presses do nothing', async () => {
    const onPress = jest.fn()
    await renderWithTheme(<Button label='Save' loading onPress={onPress} />)
    const button = screen.getByRole('button', { name: 'Save' })

    await fireEvent.press(button)

    expect(button).toBeBusy()
    expect(button).toBeDisabled()
    expect(onPress).not.toHaveBeenCalled()
  })

  it('disabled: announced, and presses do nothing', async () => {
    const onPress = jest.fn()
    await renderWithTheme(<Button label='Save' disabled onPress={onPress} />)

    await fireEvent.press(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(onPress).not.toHaveBeenCalled()
  })
})

describe('Checkbox', () => {
  it('uncontrolled: toggles itself and reports the new state', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<Checkbox label='Remember me' onChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'Remember me' })
    expect(box).not.toBeChecked()

    await fireEvent.press(box)

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('controlled: shows `checked` and only reports changes', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<Checkbox label='Terms' checked={false} onChange={onChange} />)

    await fireEvent.press(screen.getByRole('checkbox', { name: 'Terms' }))

    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox', { name: 'Terms' })).not.toBeChecked()
  })

  it('disabled: announced, and does not change', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<Checkbox label='Terms' disabled onChange={onChange} />)

    await fireEvent.press(screen.getByRole('checkbox', { name: 'Terms' }))

    expect(screen.getByRole('checkbox', { name: 'Terms' })).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('Switch', () => {
  it('is a switch named by its label, and toggles', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<Switch label='Wi-Fi' onChange={onChange} />)

    await fireEvent.press(screen.getByRole('switch', { name: 'Wi-Fi' }))

    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('starts from defaultChecked', async () => {
    await renderWithTheme(<Switch label='Dark mode' defaultChecked />)

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked()
  })
})

describe('RadioGroup', () => {
  const options = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Lifetime', value: 'lifetime', disabled: true },
  ]

  it('its options are radios, checked when selected', async () => {
    await renderWithTheme(<RadioGroup accessibilityLabel='Billing' options={options} defaultValue='monthly' />)

    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Yearly' })).not.toBeChecked()
  })

  it('selects the pressed option, but not a disabled one', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<RadioGroup options={options} onChange={onChange} />)

    await fireEvent.press(screen.getByRole('radio', { name: 'Yearly' }))
    await fireEvent.press(screen.getByRole('radio', { name: 'Lifetime' }))

    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Lifetime' })).toBeDisabled()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('yearly')
  })
})

describe('Select', () => {
  const options = [
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
  ]

  it('opens a menu of radios, and picking one closes it and shows it', async () => {
    const onChange = jest.fn()
    await renderWithTheme(<Select label='Plan' options={options} onChange={onChange} />)
    const field = screen.getByRole('button', { name: /Plan/ })
    expect(field).toBeCollapsed()

    await fireEvent.press(field)
    expect(screen.getByRole('button', { name: /Plan/ })).toBeExpanded()
    await fireEvent.press(screen.getByRole('radio', { name: 'Pro' }))

    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.queryByRole('radio', { name: 'Pro' })).toBeNull()
    expect(screen.getByText('Pro')).toBeOnTheScreen()
  })

  it('disabled: does not open', async () => {
    await renderWithTheme(<Select label='Plan' options={options} disabled />)

    await fireEvent.press(screen.getByRole('button', { name: /Plan/ }))

    expect(screen.queryByRole('radio')).toBeNull()
  })
})

describe('Input and Textarea', () => {
  it('Input reports typed text', async () => {
    const onChangeText = jest.fn()
    await renderWithTheme(<Input placeholder='Email' onChangeText={onChangeText} />)

    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'ada@example.com')

    expect(onChangeText).toHaveBeenCalledWith('ada@example.com')
  })

  it('Textarea is multiline and counts the text it keeps', async () => {
    await renderWithTheme(<Textarea placeholder='Bio' maxLength={280} showCount />)
    const field = screen.getByPlaceholderText('Bio')

    await fireEvent.changeText(field, 'Hello')

    expect(field.props.multiline).toBe(true)
    expect(screen.getByText('5 / 280')).toBeOnTheScreen()
  })
})

describe('FileInput', () => {
  it('opens the app-provided picker and shows the picked files', async () => {
    const picker = jest.fn(async () => [{ name: 'report.pdf', uri: 'file:///report.pdf', size: 10, type: 'application/pdf' }])
    const onFilesSelected = jest.fn()
    await renderWithTheme(<FileInput label='Attachment' customPicker={picker} onFilesSelected={onFilesSelected} accept='application/pdf' />)

    await fireEvent.press(screen.getByRole('button', { name: /Attachment/ }))

    expect(picker).toHaveBeenCalledWith({ accept: 'application/pdf', multiple: false })
    expect(onFilesSelected).toHaveBeenCalledWith([expect.objectContaining({ name: 'report.pdf' })])
    expect(screen.getByText('report.pdf')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Clear Attachment' })).toBeOnTheScreen()
  })
})
