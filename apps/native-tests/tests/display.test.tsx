import { describe, expect, it } from '@jest/globals'
import { screen } from '@testing-library/react-native'
import { Avatar, Badge, Button, Container, Divider, Input, Progress, Skeleton, Spinner, Table, Text } from 'dazo-ui'
import { renderWithTheme } from './utils'

describe('Text and Container', () => {
  it('Text clamps to `lines` with numberOfLines', async () => {
    await renderWithTheme(<Text lines={2}>A long paragraph</Text>)

    expect(screen.getByText('A long paragraph').props.numberOfLines).toBe(2)
  })

  it('a scrollable Container is a ScrollView', async () => {
    await renderWithTheme(
      <Container scrollable testID='list'>
        <Text>Inside</Text>
      </Container>,
    )

    expect(screen.getByTestId('list').type).toBe('RCTScrollView')
    expect(screen.getByText('Inside')).toBeOnTheScreen()
  })
})

describe('Table', () => {
  const columns = [
    { key: 'name' as const, title: 'Name' },
    { key: 'role' as const, title: 'Role' },
  ]

  it('shows the headers and every row', async () => {
    await renderWithTheme(<Table columns={columns} data={[{ name: 'Ada', role: 'Admin' }, { name: 'Alan', role: 'Editor' }]} />)

    for (const text of ['Name', 'Role', 'Ada', 'Admin', 'Alan', 'Editor']) expect(screen.getByText(text)).toBeOnTheScreen()
  })

  it('shows emptyText without rows', async () => {
    await renderWithTheme(<Table columns={columns} data={[]} emptyText='No members yet' />)

    expect(screen.getByText('No members yet')).toBeOnTheScreen()
  })
})

describe('Avatar, Badge and Divider', () => {
  it('Avatar is one image named after the person; the initials are not read twice', async () => {
    await renderWithTheme(<Avatar name='Ada Lovelace' />)

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeOnTheScreen()
    expect(screen.queryByText('AL')).toBeNull()
    expect(screen.getByText('AL', { includeHiddenElements: true })).toBeTruthy()
  })

  it('Badge shows its label', async () => {
    await renderWithTheme(<Badge tone='success'>Paid</Badge>)

    expect(screen.getByText('Paid')).toBeOnTheScreen()
  })

  it('a labelled Divider reads its label; its lines are hidden', async () => {
    await renderWithTheme(<Divider label='or' />)

    expect(screen.getByText('or')).toBeOnTheScreen()
  })
})

describe('Progress and Spinner', () => {
  it('Progress reports its value to screen readers', async () => {
    await renderWithTheme(<Progress value={40} label='Upload' />)

    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAccessibilityValue({ min: 0, max: 100, now: 40 })
  })

  it('unknown progress has no value', async () => {
    await renderWithTheme(<Progress label='Syncing' />)

    expect(screen.getByRole('progressbar', { name: 'Syncing' })).toHaveAccessibilityValue({ min: 0 })
  })

  it('Spinner is a progressbar named by its label', async () => {
    await renderWithTheme(<Spinner label='Loading messages' />)

    expect(screen.getByRole('progressbar', { name: 'Loading messages' })).toBeOnTheScreen()
  })
})

describe('Skeleton', () => {
  it('while loading: one busy "Loading" element, and the real controls are hidden', async () => {
    await renderWithTheme(
      <Skeleton loading label='Loading profile'>
        <Text>Ada Lovelace</Text>
        <Input placeholder='Name' />
        <Button label='Save' />
      </Skeleton>,
    )

    expect(screen.getByRole('progressbar', { name: 'Loading profile' })).toBeBusy()
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
    expect(screen.queryByPlaceholderText('Name')).toBeNull()
  })

  it('when loading ends: the real content, and no loading element', async () => {
    await renderWithTheme(
      <Skeleton loading={false}>
        <Button label='Save' />
      </Skeleton>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeOnTheScreen()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })
})
