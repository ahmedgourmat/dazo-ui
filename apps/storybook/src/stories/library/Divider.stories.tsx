import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container, Divider, Text } from 'dazo-ui'

const meta = {
  title: 'Library/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
  args: { orientation: 'horizontal' },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container width={320} gap='md'>
      <Text>Above</Text>
      <Divider {...args} />
      <Text>Below</Text>
    </Container>
  ),
}

export const WithLabel: Story = {
  args: { label: 'or' },
  render: (args) => (
    <Container width={320}>
      <Divider {...args} />
    </Container>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Container flexDirection='row' gap='md' height={24} alignItems='center'>
      <Text>Edit</Text>
      <Divider orientation='vertical' />
      <Text>Share</Text>
    </Container>
  ),
}
