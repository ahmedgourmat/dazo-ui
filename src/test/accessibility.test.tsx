import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Avatar,
  Badge,
  Divider,
  Progress,
  Spinner,
  Switch,
  Textarea,
  Button,
  Checkbox,
  Container,
  FileInput,
  Input,
  RadioGroup,
  Select,
  Table,
  Text,
} from '../index'
import { accessibilityProblems, finishModalAnimations, renderWithTheme } from './utils'

// Automated checks with axe-core: every component, in its main states, must
// have a valid role, an accessible name and valid ARIA. A failure prints
// which rule broke and on which element.
const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Legacy', value: 'legacy', disabled: true },
]

describe('automated accessibility checks (axe-core)', () => {
  it('Button: normal, disabled and loading', async () => {
    renderWithTheme(
      <>
        <Button label='Save' />
        <Button label='Delete' disabled variant='outline' />
        <Button label='Sending' loading variant='ghost' />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Checkbox: checked, unchecked, disabled and without a label', async () => {
    renderWithTheme(
      <>
        <Checkbox label='Remember me' checked />
        <Checkbox label='Newsletter' />
        <Checkbox label='Locked' disabled />
        <Checkbox value='terms' />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('RadioGroup: with a selected and a disabled option', async () => {
    renderWithTheme(<RadioGroup accessibilityLabel='Plan' options={options} value='pro' />)
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Select: closed, then open', async () => {
    renderWithTheme(<Select label='Plan' options={options} value='pro' />)
    expect(await accessibilityProblems()).toEqual([])

    fireEvent.click(screen.getByText('Pro'))
    // react-native-web gives the modal its dialog role once the fade-in ends,
    // which never happens on its own in jsdom.
    finishModalAnimations()
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Input: empty, filled and read-only', async () => {
    renderWithTheme(
      <>
        <Input placeholder='Email' aria-label='Email' />
        <Input value='hello' aria-label='Message' />
        <Input value='fixed' aria-label='Code' editable={false} />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('FileInput: empty and with picked files', async () => {
    renderWithTheme(
      <>
        <FileInput label='Attachment' />
        <FileInput label='Avatar' value='me.png' onClear={() => {}} />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Text, Container and Table', async () => {
    renderWithTheme(
      <Container padding='md'>
        <Text variant='title'>Team</Text>
        <Table
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'role', title: 'Role' },
          ]}
          data={[{ name: 'Ada', role: 'Admin' }]}
        />
      </Container>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Switch: off, on, disabled and without a visible label', async () => {
    renderWithTheme(
      <>
        <Switch label='Notifications' />
        <Switch label='Dark mode' defaultChecked />
        <Switch label='Airplane mode' disabled />
        <Switch accessibilityLabel='Location' />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Textarea: empty, with a count, and invalid', async () => {
    renderWithTheme(
      <>
        <Textarea aria-label='Bio' />
        <Textarea aria-label='Message' defaultValue='Hi' maxLength={100} showCount />
        <Textarea aria-label='Notes' invalid />
      </>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })

  it('Spinner, Progress (known and unknown), Avatar, Badge and Divider', async () => {
    renderWithTheme(
      <Container padding='md'>
        <Spinner />
        <Progress value={40} label='Uploading' />
        <Progress label='Syncing' />
        <Avatar name='Ada Lovelace' />
        <Avatar />
        <Badge tone='success'>Paid</Badge>
        <Badge tone='warning' variant='subtle'>Pending</Badge>
        <Divider />
        <Divider label='or' />
        <Divider decorative />
      </Container>,
    )
    expect(await accessibilityProblems()).toEqual([])
  })
})
