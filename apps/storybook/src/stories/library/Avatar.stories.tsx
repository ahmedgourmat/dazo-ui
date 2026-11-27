import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Container } from 'dazo-ui'

const meta = {
  title: 'Library/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    src: { control: 'text' },
  },
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <Container flexDirection='row' gap='sm' alignItems='center'>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} name='Grace Hopper' size={size} />
      ))}
    </Container>
  ),
}

export const BrokenImage: Story = {
  args: { name: 'Alan Turing', src: 'https://invalid.example/missing.png' },
}
