import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox, FileInput, Input, RadioGroup, Select, Skeleton, Switch, Textarea } from '../../index'
import { lightTheme } from '../../styles/theme'
import { accessibilityProblems, hexToRgb, isDisabled, renderWithTheme } from '../../test/utils'
import { FormField, useFormField } from './index'

/** The text of the elements an aria-describedby / aria-labelledby points at. */
const textOf = (element: HTMLElement, attribute: 'aria-describedby' | 'aria-labelledby') =>
  (element.getAttribute(attribute) ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ')

describe('FormField', () => {
  it('shows the label above the control and the helper text under it', () => {
    renderWithTheme(
      <FormField label='Email' helperText="We'll never share it.">
        <Input placeholder='name@company.com' />
      </FormField>,
    )

    expect(screen.getByText('Email')).toBeTruthy()
    expect(screen.getByText("We'll never share it.")).toBeTruthy()
  })

  describe('Input and Textarea', () => {
    it('are named by the label and described by the helper text', () => {
      renderWithTheme(
        <FormField label='Email' helperText="We'll never share it.">
          <Input placeholder='name@company.com' />
        </FormField>,
      )

      const input = screen.getByRole('textbox', { name: 'Email' })
      expect(textOf(input, 'aria-describedby')).toBe("We'll never share it.")
    })

    it('an error replaces the helper text, in red, and marks the field invalid', () => {
      renderWithTheme(
        <FormField label='Email' helperText='Work email' error='Enter a valid email'>
          <Input placeholder='name@company.com' />
        </FormField>,
      )

      const input = screen.getByRole('textbox', { name: 'Email' })
      expect(screen.queryByText('Work email')).toBeNull()
      expect(getComputedStyle(screen.getByText('Enter a valid email')).color).toBe(hexToRgb(lightTheme.colors.danger))
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(textOf(input, 'aria-describedby')).toBe('Enter a valid email')
      // The input's edge turns red too.
      expect(getComputedStyle(input.parentElement as HTMLElement).borderTopColor).toBe(hexToRgb(lightTheme.colors.danger))
    })

    it('the error is in a live region that exists before it appears, so it is announced', () => {
      const { rerender } = renderWithTheme(
        <FormField label='Email'>
          <Input placeholder='name@company.com' />
        </FormField>,
      )
      const region = document.querySelector('[aria-live="polite"]')
      expect(region).toBeTruthy()

      rerender(
        <FormField label='Email' error='Required'>
          <Input placeholder='name@company.com' />
        </FormField>,
      )
      expect(document.querySelector('[aria-live="polite"]')).toBe(region)
      expect(region?.textContent).toBe('Required')
    })

    it('required: a star for the eye, aria-required for screen readers', () => {
      renderWithTheme(
        <FormField label='Email' required>
          <Input placeholder='name@company.com' />
        </FormField>,
      )

      const star = screen.getByText('*', { exact: false })
      expect(star.getAttribute('aria-hidden')).toBe('true')
      expect(screen.getByRole('textbox', { name: 'Email' }).getAttribute('aria-required')).toBe('true')
    })

    it('disabled makes the input read-only', () => {
      renderWithTheme(
        <FormField label='Email' disabled>
          <Input placeholder='name@company.com' />
        </FormField>,
      )

      expect((screen.getByRole('textbox', { name: 'Email' }) as HTMLInputElement).readOnly).toBe(true)
    })

    it('Textarea keeps its character count in the description', () => {
      renderWithTheme(
        <FormField label='Bio' helperText='A few words about you'>
          <Textarea defaultValue='Hi' maxLength={100} showCount />
        </FormField>,
      )

      const field = screen.getByRole('textbox', { name: 'Bio' })
      expect(textOf(field, 'aria-describedby')).toBe('A few words about you 2 / 100')
    })
  })

  it('Select and FileInput: named by the label and their value, with a red edge when invalid', () => {
    renderWithTheme(
      <>
        <FormField label='Plan' error='Pick a plan'>
          <Select value='pro' options={[{ label: 'Pro', value: 'pro' }]} />
        </FormField>
        <FormField label='Attachment'>
          <FileInput placeholder='Choose a file' />
        </FormField>
      </>,
    )

    const select = screen.getByRole('button', { name: 'Plan Pro' })
    expect(textOf(select, 'aria-describedby')).toBe('Pick a plan')
    expect(select.getAttribute('aria-invalid')).toBe('true')
    expect(getComputedStyle(select).borderTopColor).toBe(hexToRgb(lightTheme.colors.danger))
    expect(screen.getByRole('button', { name: 'Attachment Choose a file' })).toBeTruthy()
  })

  it('Checkbox and Switch keep their own label; the field describes them', () => {
    renderWithTheme(
      <>
        <FormField label='Terms' error='You must accept the terms' required>
          <Checkbox label='I accept the terms' />
        </FormField>
        <FormField label='Notifications' helperText='Sent at most once a day'>
          <Switch label='Daily digest' />
        </FormField>
      </>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'I accept the terms' })
    expect(textOf(checkbox, 'aria-describedby')).toBe('You must accept the terms')
    expect(checkbox.getAttribute('aria-required')).toBe('true')
    const toggle = screen.getByRole('switch', { name: 'Daily digest' })
    expect(textOf(toggle, 'aria-describedby')).toBe('Sent at most once a day')
    // aria-required isn't allowed on a switch.
    expect(toggle.hasAttribute('aria-required')).toBe(false)
  })

  it('RadioGroup: named by the label unless it has its own name', () => {
    renderWithTheme(
      <>
        <FormField label='Billing'>
          <RadioGroup options={[{ label: 'Monthly', value: 'm' }]} />
        </FormField>
        <FormField label='Visible label'>
          <RadioGroup accessibilityLabel='Own name' options={[{ label: 'A', value: 'a' }]} />
        </FormField>
      </>,
    )

    expect(screen.getByRole('radiogroup', { name: 'Billing' })).toBeTruthy()
    expect(screen.getByRole('radiogroup', { name: 'Own name' })).toBeTruthy()
  })

  it('disables every kind of control', () => {
    renderWithTheme(
      <>
        <FormField label='Plan' disabled>
          <Select options={[]} />
        </FormField>
        <FormField label='Terms' disabled>
          <Checkbox label='Accept' />
        </FormField>
        <FormField label='Digest' disabled>
          <Switch label='Daily' />
        </FormField>
      </>,
    )

    expect(isDisabled(screen.getByRole('button', { name: /^Plan/ }))).toBe(true)
    expect(isDisabled(screen.getByRole('checkbox', { name: 'Accept' }))).toBe(true)
    expect(isDisabled(screen.getByRole('switch', { name: 'Daily' }))).toBe(true)
  })

  it('controls outside a FormField are unchanged', () => {
    renderWithTheme(<Input placeholder='Search' aria-label='Search' />)

    const input = screen.getByRole('textbox', { name: 'Search' })
    expect(input.hasAttribute('aria-describedby')).toBe(false)
    expect(input.hasAttribute('aria-invalid')).toBe(false)
  })

  it('useFormField lets your own controls read the field', () => {
    const Custom = () => {
      const field = useFormField()
      return <span>{field ? `${field.label}|${field.description}|${field.invalid}` : 'none'}</span>
    }
    renderWithTheme(
      <>
        <FormField label='Color' error='Pick one'>
          <Custom />
        </FormField>
        <Custom />
      </>,
    )

    expect(screen.getByText('Color|Pick one|true')).toBeTruthy()
    expect(screen.getByText('none')).toBeTruthy()
  })

  it('draws a placeholder for the label and description inside a Skeleton', () => {
    renderWithTheme(
      <Skeleton>
        <FormField label='Email' helperText='Work email'>
          <Input placeholder='name@company.com' />
        </FormField>
      </Skeleton>,
    )

    expect(screen.queryByRole('textbox')).toBeNull()
    expect(getComputedStyle(screen.getByText('Email')).color).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(screen.getByText('Work email')).color).toBe('rgba(0, 0, 0, 0)')
  })

  it('passes the accessibility checks, valid and invalid', async () => {
    renderWithTheme(
      <>
        <FormField label='Email' helperText='Work email' required>
          <Input placeholder='name@company.com' />
        </FormField>
        <FormField label='Bio' error='Too short'>
          <Textarea showCount maxLength={100} />
        </FormField>
        <FormField label='Plan' error='Pick a plan'>
          <Select options={[{ label: 'Pro', value: 'pro' }]} />
        </FormField>
        <FormField label='Terms' error='Required' required>
          <Checkbox label='I accept' />
        </FormField>
        <FormField label='Digest' helperText='Daily'>
          <Switch label='Send me a digest' />
        </FormField>
        <FormField label='Billing' required>
          <RadioGroup options={[{ label: 'Monthly', value: 'm' }]} />
        </FormField>
      </>,
    )

    expect(await accessibilityProblems()).toEqual([])
  })
})
