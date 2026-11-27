import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container, Progress } from 'dazo-ui'

const meta = {
  title: 'Library/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    tone: { control: 'inline-radio', options: ['neutral', 'danger', 'success', 'warning', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { value: 40, max: 100, label: 'Uploading', size: 'md', tone: 'neutral' },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container width={320}>
      <Progress {...args} />
    </Container>
  ),
}

export const Unknown: Story = {
  args: { value: undefined, label: 'Syncing' },
  render: (args) => (
    <Container width={320}>
      <Progress {...args} />
    </Container>
  ),
}
