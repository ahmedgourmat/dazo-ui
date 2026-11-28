import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, screen } from '@testing-library/react-native'
import { Avatar, Badge, Button, Checkbox, Container, Divider, FileInput, Input, Progress, RadioGroup, Select, Skeleton, Spinner, Switch, Table, Text, Textarea } from 'dazo-ui'
import { Animated } from 'react-native'
import { reduceMotion, renderWithTheme, styleOf } from './utils'

// Code paths that only exist on iOS and Android: the web build replaces them
// with CSS (animations, shadows, focus rings) or browser APIs (file picker).

afterEach(() => {
  jest.restoreAllMocks()
})

describe('animations use Animated, and stop with Reduce motion', () => {
  it('Switch slides its thumb with Animated.timing', async () => {
    const timing = jest.spyOn(Animated, 'timing')
    await renderWithTheme(<Switch label='Wi-Fi' />)
    timing.mockClear()

    await fireEvent.press(screen.getByRole('switch', { name: 'Wi-Fi' }))

    expect(timing).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1, useNativeDriver: true }))
  })

  it('Switch jumps without animating when Reduce motion is on', async () => {
    reduceMotion()
    const timing = jest.spyOn(Animated, 'timing')
    await renderWithTheme(<Switch label='Wi-Fi' />)
    timing.mockClear()

    await fireEvent.press(screen.getByRole('switch', { name: 'Wi-Fi' }))

    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeChecked()
    expect(timing).not.toHaveBeenCalled()
  })

  it('unknown Progress and Skeleton loop, unless Reduce motion is on', async () => {
    const loop = jest.spyOn(Animated, 'loop')
    await renderWithTheme(
      <>
        <Progress label='Syncing' />
        <Skeleton width={120} height={16} />
      </>,
    )
    expect(loop).toHaveBeenCalledTimes(2)
  })

  it('with Reduce motion, every loop is stopped once the setting arrives', async () => {
    reduceMotion()
    // The system setting arrives asynchronously, as on a device, so a loop can
    // start on the first frame. What matters is that none keeps running.
    const stops: jest.Mock[] = []
    const loop = Animated.loop
    jest.spyOn(Animated, 'loop').mockImplementation((...args: Parameters<typeof Animated.loop>) => {
      const animation = loop(...args)
      stops.push(jest.spyOn(animation, 'stop') as unknown as jest.Mock)
      return animation
    })
    await renderWithTheme(
      <>
        <Progress label='Syncing' />
        <Skeleton width={120} height={16} />
      </>,
    )
    await act(async () => {})

    expect(stops.length).toBeGreaterThan(0)
    for (const stop of stops) expect(stop).toHaveBeenCalled()
  })
})

describe('native styles', () => {
  it('shadows use shadow* on iOS and elevation on Android, not CSS', async () => {
    await renderWithTheme(<Container testID='card' shadow='md' />)
    const style = styleOf(screen.getByTestId('card'))

    expect(style.elevation).toBe(3)
    expect(style.shadowOpacity).toBeGreaterThan(0)
    expect(style).not.toHaveProperty('boxShadow')
  })

  it('Select rows are a full touch target (48), not the web\'s 40', async () => {
    await renderWithTheme(<Select label='Plan' options={[{ label: 'Pro', value: 'pro' }]} />)
    await fireEvent.press(screen.getByRole('button', { name: /Plan/ }))

    expect(styleOf(screen.getByRole('radio', { name: 'Pro' })).minHeight).toBe(48)
  })
})

describe('FileInput without a picker', () => {
  it('warns how to add one, instead of failing silently', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    await renderWithTheme(<FileInput label='Attachment' />)

    await fireEvent.press(screen.getByRole('button', { name: /Attachment/ }))

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('customPicker'))
  })
})

describe('testID reaches the native view (Detox, Maestro)', () => {
  const options = [{ label: 'Pro', value: 'pro' }]
  const all = (
    <>
      <Avatar testID='avatar' name='Ada' />
      <Badge testID='badge'>New</Badge>
      <Button testID='button' label='Save' />
      <Checkbox testID='checkbox' label='Terms' />
      <Container testID='container' />
      <Divider testID='divider' />
      <FileInput testID='file-input' label='File' />
      <Input testID='input' placeholder='Email' />
      <Progress testID='progress' value={10} />
      <RadioGroup testID='radio-group' options={options} />
      <Select testID='select' options={options} />
      <Spinner testID='spinner' />
      <Switch testID='switch' label='Wi-Fi' />
      <Table testID='table' columns={[{ key: 'name', title: 'Name' }]} data={[{ name: 'Ada' }]} />
      <Text testID='text'>Hello</Text>
      <Textarea testID='textarea' placeholder='Bio' />
    </>
  )

  it.each([
    'avatar', 'badge', 'button', 'checkbox', 'container', 'divider', 'file-input', 'input',
    'progress', 'radio-group', 'select', 'spinner', 'switch', 'table', 'text', 'textarea',
  ])('%s', async (id) => {
    await renderWithTheme(all)

    expect(screen.getByTestId(id, { includeHiddenElements: true })).toBeTruthy()
  })
})
