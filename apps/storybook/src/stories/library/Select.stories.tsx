import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Icon, Select } from 'dazo-ui'

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Marketing', value: 'marketing' },
] as const

const meta = {
  title: 'Library/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
  args: {
    onChange: fn(),
    label: 'Team',
    placeholder: 'Choose a team',
    value: 'engineering',
    options: [...options],
    disabled: false,
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(String(args.value ?? ''))

    return (
      <Select
        {...args}
        value={value}
        leftIcon={<Icon name="Layers3" size={16} />}
        rightIcon={<Icon name="ChevronDown" size={16} />}
        onChange={(nextValue) => {
          setValue(nextValue)
          args.onChange?.(nextValue)
        }}
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'design',
  },
}