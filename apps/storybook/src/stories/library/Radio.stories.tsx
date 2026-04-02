import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Icon, RadioGroup } from 'dazo'

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
] as const

const meta = {
  title: 'Library/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['column', 'row'],
    },
    disabled: {
      control: 'boolean',
    },
    textColor: {
      control: 'color',
    },
    circleColor: {
      control: 'color',
    },
  },
  args: {
    onChange: fn(),
    options: [...options],
    value: 'growth',
    direction: 'column',
    disabled: false,
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(String(args.value ?? ''))

    return (
      <RadioGroup
        {...args}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue)
          args.onChange?.(nextValue)
        }}
      />
    )
  },
}

export const RowLayout: Story = {
  args: {
    direction: 'row',
    value: 'starter',
    options: [
      { label: 'Daily', value: 'daily', icon: <Icon name="CalendarDays" size={14} /> },
      { label: 'Weekly', value: 'weekly', icon: <Icon name="CalendarRange" size={14} /> },
      { label: 'Monthly', value: 'monthly', icon: <Icon name="CalendarClock" size={14} /> },
    ],
  },
}