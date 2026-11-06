import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from 'dazo-ui'

const meta = {
  title: 'Library/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    backgroundColor: {
      control: 'color',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  args: {
    onPress: fn(),
    label: 'Launch app',
    variant: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    backgroundColor: '#3B82F6',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Button
      {...args}
    />
  ),
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Secondary action',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    label: 'Learn more',
    backgroundColor: 'transparent',
  },
}