import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from 'dazo'

const meta = {
  title: 'Library/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 1 },
    },
    color: {
      control: 'color',
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 4, step: 0.25 },
    },
  },
  args: {
    name: 'Sparkles',
    size: 24,
    strokeWidth: 2,
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Search: Story = {
  args: {
    name: 'Search',
  },
}

export const Large: Story = {
  args: {
    name: 'ArrowRight',
    size: 40,
    strokeWidth: 1.5,
  },
}