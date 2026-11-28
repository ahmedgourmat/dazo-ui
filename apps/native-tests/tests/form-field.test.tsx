import { describe, expect, it } from '@jest/globals'
import { screen } from '@testing-library/react-native'
import { Checkbox, FormField, Input, Select } from 'dazo-ui'
import { renderWithTheme } from './utils'

// On iOS and Android there is no aria-labelledby / aria-describedby, so
// FormField names the control with its label and puts the helper text or the
// error in the accessibility hint. This branch never runs in the web build.

describe('FormField on iOS and Android', () => {
  it('names a text field with its label and describes it with the helper text', async () => {
    await renderWithTheme(
      <FormField label='Email' helperText='We never share it'>
        <Input placeholder='you@example.com' />
      </FormField>,
    )
    const input = screen.getByPlaceholderText('you@example.com')

    expect(input).toHaveAccessibleName('Email')
    expect(input.props.accessibilityHint).toBe('We never share it')
  })

  it('says "required", and the error replaces the helper text', async () => {
    await renderWithTheme(
      <FormField label='Email' helperText='We never share it' error='Enter a valid email' required>
        <Input placeholder='you@example.com' />
      </FormField>,
    )
    const input = screen.getByPlaceholderText('you@example.com')

    expect(input).toHaveAccessibleName('Email, required')
    expect(input.props.accessibilityHint).toBe('Enter a valid email')
    expect(screen.getByText('Enter a valid email')).toBeOnTheScreen()
  })

  it('names a Select with its label and value', async () => {
    await renderWithTheme(
      <FormField label='Plan'>
        <Select options={[{ label: 'Pro', value: 'pro' }]} defaultValue='pro' />
      </FormField>,
    )

    expect(screen.getByRole('button', { name: 'Plan, Pro' })).toBeOnTheScreen()
  })

  it('disables the control inside', async () => {
    await renderWithTheme(
      <FormField label='Updates' disabled>
        <Checkbox label='Send me product updates' />
      </FormField>,
    )

    expect(screen.getByRole('checkbox', { name: 'Send me product updates' })).toBeDisabled()
  })
})
