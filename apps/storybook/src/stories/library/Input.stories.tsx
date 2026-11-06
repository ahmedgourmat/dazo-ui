import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Input } from 'dazo-ui'

const meta = {
  title: 'Library/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
    },
    editable: {
      control: 'boolean',
    },
    textColor: {
      control: 'color',
    },
  },
  args: {
    onChangeText: fn(),
    value: 'hello@dazo-ui.dev',
    placeholder: 'Enter your email',
    variant: 'outline',
    editable: true,
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(String(args.value ?? ''))

    return (
      <Input
        {...args}
        value={value}
        onChangeText={(nextValue) => {
          setValue(nextValue)
          args.onChangeText?.(nextValue)
        }}
      />
    )
  },
}

export const Password: Story = {
  args: {
    value: '••••••••',
    placeholder: 'Password',
    secureTextEntry: true,
    variant: 'solid',
  },
}