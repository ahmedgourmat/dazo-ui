import { screen } from '@testing-library/react'
import { useState } from 'react'
import { Text as RNText } from 'react-native'
import { describe, expect, it } from 'vitest'
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Divider,
  FileInput,
  Input,
  Progress,
  RadioGroup,
  Select,
  Spinner,
  Switch,
  Table,
  Text,
  Textarea,
} from '../../index'
import type { TableColumn } from '../Table'
import { darkTheme, lightTheme } from '../../styles/theme'
import { accessibilityProblems, hexToRgb, renderWithTheme } from '../../test/utils'
import { Skeleton, useSkeleton } from './index'

const style = (id: string) => getComputedStyle(screen.getByTestId(id))
const placeholderColor = hexToRgb(lightTheme.colors.border)

describe('Skeleton block', () => {
  it('is a 16px bar by default, hidden from screen readers', () => {
    renderWithTheme(<Skeleton testID='bar' />)

    expect(style('bar').height).toBe('16px')
    expect(style('bar').backgroundColor).toBe(placeholderColor)
    expect(screen.getByTestId('bar').getAttribute('aria-hidden')).toBe('true')
  })

  it('takes a size through the style props', () => {
    renderWithTheme(<Skeleton testID='bar' width={120} height={24} borderRadius='md' />)

    expect([style('bar').width, style('bar').height, style('bar').borderTopLeftRadius]).toEqual(['120px', '24px', '8px'])
  })

  it('can be a circle', () => {
    renderWithTheme(<Skeleton testID='dot' circle size={48} />)

    expect([style('dot').width, style('dot').height, style('dot').borderTopLeftRadius]).toEqual(['48px', '48px', '24px'])
  })

  it('can stand for lines of text, the last one shorter', () => {
    renderWithTheme(<Skeleton testID='lines' lines={3} textSize='sm' />)

    const bars = Array.from(screen.getByTestId('lines').children).map((bar) => getComputedStyle(bar))
    expect(bars).toHaveLength(3)
    expect(bars.map((bar) => bar.height)).toEqual(['14px', '14px', '14px'])
    expect(bars.map((bar) => bar.width)).toEqual(['100%', '100%', '60%'])
    expect(style('lines').gap).toBe('6px') // 20px lines minus 14px text
  })
})

describe('placeholder color', () => {
  it('stands out from every surface in both modes', () => {
    const differs = (theme: typeof lightTheme, color: string) =>
      [theme.colors.background, theme.colors.surface, theme.colors.surfaceMuted, theme.colors.surfaceElevated].every(
        (surface) => surface.toLowerCase() !== color.toLowerCase(),
      )
    expect(differs(lightTheme, lightTheme.colors.border)).toBe(true)
    expect(differs(darkTheme, darkTheme.colors.borderStrong)).toBe(true)
  })
})

describe('Skeleton wrapper', () => {
  it('announces one "Loading" and hides the real controls while loading', () => {
    renderWithTheme(
      <Skeleton loading>
        <Button label='Save' />
        <Switch label='Wi-Fi' />
        <Checkbox label='Terms' />
        <Input placeholder='Email' />
      </Skeleton>,
    )

    const wrapper = screen.getByRole('progressbar', { name: 'Loading' })
    expect(wrapper.getAttribute('aria-busy')).toBe('true')
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('switch')).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.queryByPlaceholderText('Email')).toBeNull()
  })

  it('shows the real content, and nothing else, when not loading', () => {
    renderWithTheme(
      <Skeleton loading={false}>
        <Button label='Save' />
      </Skeleton>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('swaps placeholders for the real components when loading ends, without errors', () => {
    const { rerender } = renderWithTheme(
      <Skeleton loading>
        <Switch label='Wi-Fi' defaultChecked />
        <Textarea placeholder='Bio' defaultValue='Hi' showCount />
      </Skeleton>,
    )

    rerender(
      <Skeleton loading={false}>
        <Switch label='Wi-Fi' defaultChecked />
        <Textarea placeholder='Bio' defaultValue='Hi' showCount />
      </Skeleton>,
    )

    expect(screen.getByRole('switch', { name: 'Wi-Fi' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText('2')).toBeTruthy()
  })

  it('takes its own label and the style props', () => {
    renderWithTheme(
      <Skeleton label='Loading profile' padding='md' testID='wrapper'>
        <Text>Name</Text>
      </Skeleton>,
    )

    expect(screen.getByRole('progressbar', { name: 'Loading profile' })).toBeTruthy()
    expect(style('wrapper').paddingTop).toBe('16px')
  })

  it('a nested Skeleton with loading={false} shows its content', () => {
    renderWithTheme(
      <Skeleton>
        <Text>Loading part</Text>
        <Skeleton loading={false}>
          <Button label='Always ready' />
        </Skeleton>
      </Skeleton>,
    )

    expect(screen.getByRole('button', { name: 'Always ready' })).toBeTruthy()
  })

  it('lets your own components draw a placeholder with useSkeleton()', () => {
    const Price = () => <RNText>{useSkeleton() ? 'placeholder' : '$42'}</RNText>
    const { rerender } = renderWithTheme(<Skeleton><Price /></Skeleton>)
    expect(screen.getByText('placeholder')).toBeTruthy()

    rerender(<Skeleton loading={false}><Price /></Skeleton>)
    expect(screen.getByText('$42')).toBeTruthy()
  })

  it('passes the accessibility checks while loading', async () => {
    renderWithTheme(
      <Skeleton>
        <Avatar name='Ada Lovelace' />
        <Text variant='title'>Ada Lovelace</Text>
        <Badge tone='success'>Active</Badge>
        <Input placeholder='Email' />
        <Select label='Plan' options={[{ label: 'Pro', value: 'pro' }]} />
        <Switch label='Wi-Fi' />
        <Button label='Save' />
      </Skeleton>,
    )

    expect(await accessibilityProblems()).toEqual([])
  })
})

describe('each placeholder has its component’s size and shape', () => {
  const { space, leading, borderWidth, controlHeight, radius } = lightTheme

  it('Button: its height, padding and radius, as wide as its label', () => {
    renderWithTheme(
      <Skeleton>
        <Button label='Save changes' size='lg' marginTop='sm' />
      </Skeleton>,
    )
    const label = screen.getByText('Save changes')
    const box = getComputedStyle(label.parentElement as HTMLElement)

    expect([box.minHeight, box.paddingLeft, box.borderTopLeftRadius, box.marginTop]).toEqual([`${controlHeight.lg}px`, '20px', '8px', '8px'])
    expect(box.backgroundColor).toBe(placeholderColor)
    // The label keeps its size but is invisible.
    expect(getComputedStyle(label).color).toBe('rgba(0, 0, 0, 0)')
  })

  it('Switch: a pill the size of its track, next to the label', () => {
    renderWithTheme(
      <Skeleton>
        <Switch label='Wi-Fi' size='sm' />
      </Skeleton>,
    )
    const track = screen.getByText('Wi-Fi').parentElement?.nextElementSibling as HTMLElement

    expect([getComputedStyle(track).width, getComputedStyle(track).height, getComputedStyle(track).borderTopLeftRadius]).toEqual(['32px', '18px', '9px'])
  })

  it('Avatar: its size and shape', () => {
    renderWithTheme(
      <Skeleton>
        <Avatar testID='round' name='A' size='lg' />
      </Skeleton>,
    )
    const avatar = document.querySelector('[aria-hidden="true"]') as HTMLElement

    expect([getComputedStyle(avatar).width, getComputedStyle(avatar).borderTopLeftRadius]).toEqual(['48px', '24px'])
  })

  it('Text: a block as big as the text, in its font', () => {
    renderWithTheme(
      <Skeleton>
        <Text variant='title'>Ada Lovelace</Text>
      </Skeleton>,
    )
    const text = getComputedStyle(screen.getByText('Ada Lovelace'))

    expect([text.fontSize, text.lineHeight, text.color]).toEqual(['24px', '32px', 'rgba(0, 0, 0, 0)'])
    expect(getComputedStyle(screen.getByText('Ada Lovelace').parentElement as HTMLElement).backgroundColor).toBe(placeholderColor)
  })

  it('Badge: a pill as wide as its label', () => {
    renderWithTheme(
      <Skeleton>
        <Badge size='sm'>Paid</Badge>
      </Skeleton>,
    )
    const pill = getComputedStyle(screen.getByText('Paid').parentElement as HTMLElement)

    expect([pill.minHeight, pill.borderTopLeftRadius]).toEqual(['20px', `${radius.full}px`])
  })

  it('fields: the height of Input, Textarea, Select and FileInput', () => {
    renderWithTheme(
      <Skeleton>
        <Input testID='input' size='lg' />
        <Textarea rows={2} showCount />
        <Select label='Plan' options={[]} />
        <FileInput />
      </Skeleton>,
    )
    const heights = Array.from(document.querySelectorAll('[aria-hidden="true"]')).map((box) => getComputedStyle(box).minHeight)

    expect(heights).toEqual([
      `${controlHeight.lg}px`,
      `${2 * leading.base + 2 * space[2] + 2 * borderWidth.thin + space[1] + leading.xs}px`,
      `${2 * space[1.5] + leading.xs + leading.base + 2 * borderWidth.thin}px`,
      `${controlHeight.md}px`,
    ])
  })

  it('Checkbox and RadioGroup: a box or circle for each, and the labels’ width', () => {
    renderWithTheme(
      <Skeleton>
        <Checkbox label='Terms' />
        <RadioGroup options={[{ label: 'Monthly', value: 'm' }, { label: 'Yearly', value: 'y' }]} />
      </Skeleton>,
    )

    expect(screen.getByText('Terms')).toBeTruthy()
    expect(screen.getByText('Monthly')).toBeTruthy()
    expect(screen.getByText('Yearly')).toBeTruthy()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('Progress and Spinner: the track and a circle', () => {
    renderWithTheme(
      <Skeleton>
        <Progress value={50} size='sm' />
        <Spinner size='lg' />
      </Skeleton>,
    )
    const [track, circle] = Array.from(document.querySelectorAll('[aria-hidden="true"]')).map((box) => getComputedStyle(box))

    expect([track.height, circle.width, circle.borderTopLeftRadius]).toEqual(['4px', '36px', '18px'])
  })

  it('Table: the header and a row of bars for each row, or three while there is no data', () => {
    const columns: TableColumn<{ name: string; role: string }>[] = [{ key: 'name', title: 'Name' }, { key: 'role', title: 'Role' }]
    const { rerender } = renderWithTheme(
      <Skeleton>
        <Table columns={columns} data={[]} />
      </Skeleton>,
    )
    const table = () => document.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(table().children).toHaveLength(1 + 3)

    rerender(
      <Skeleton>
        <Table columns={columns} data={[{ name: 'Ada', role: 'Owner' }]} />
      </Skeleton>,
    )
    expect(table().children).toHaveLength(1 + 1)
    expect(screen.queryByText('Ada')).toBeNull()
  })

  it('Divider and Container are drawn as they are', () => {
    renderWithTheme(
      <Skeleton>
        <Divider />
      </Skeleton>,
    )

    expect(screen.getByRole('separator')).toBeTruthy()
  })
})

describe('skeleton mode keeps state working', () => {
  it('a controlled component shows its value again when loading ends', () => {
    const Form = ({ loading }: { loading: boolean }) => {
      const [on, setOn] = useState(true)
      return (
        <Skeleton loading={loading}>
          <Switch label='Wi-Fi' checked={on} onChange={setOn} />
        </Skeleton>
      )
    }
    const { rerender } = renderWithTheme(<Form loading />)
    rerender(<Form loading={false} />)

    expect(screen.getByRole('switch', { name: 'Wi-Fi' }).getAttribute('aria-checked')).toBe('true')
  })
})
