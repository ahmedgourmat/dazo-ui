import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Checkbox, Icon } from 'dazo-ui'

const meta = {
  title: 'Library/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checkedColor: {
      control: 'color',
    },
    uncheckedColor: {
      control: 'color',
    },
    checkmarkColor: {
      control: 'color',
    },
    textColor: {
      control: 'color',
    },
    checkboxSize: {
      control: { type: 'number', min: 14, max: 32, step: 1 },
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
    label: 'Accept terms and conditions',
    checked: true,
    disabled: false,
    checkboxSize: 20,
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(Boolean(args.checked))

    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(nextChecked) => {
          setChecked(nextChecked)
          args.onChange?.(nextChecked)
        }}
        icon={<Icon name="Check" size={14} />}
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Notifications disabled',
  },
}