import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from 'dazo'

const meta = {
  title: 'Library/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'title', 'subtitle', 'caption'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'color',
    },
    lines: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
    },
    letters: {
      control: { type: 'number', min: 1, max: 120, step: 1 },
    },
  },
  args: {
    children: 'A focused typographic system makes UI easier to scan and understand.',
    variant: 'default',
    size: 'md',
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Title: Story = {
  args: {
    variant: 'title',
    children: 'Build faster with consistent text styles',
  },
}

export const Truncated: Story = {
  args: {
    variant: 'caption',
    size: 'sm',
    lines: 2,
    letters: 72,
    children:
      'This copy is intentionally long so the story can demonstrate the lines and letters props together.',
  },
}