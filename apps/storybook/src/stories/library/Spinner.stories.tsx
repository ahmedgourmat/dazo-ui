import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container, Spinner } from 'dazo-ui'

const meta = {
  title: 'Library/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'text' },
  },
  args: { size: 'md', label: 'Loading' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <Container flexDirection='row' gap='md' alignItems='center'>
      <Spinner size='sm' />
      <Spinner size='md' />
      <Spinner size='lg' />
      <Spinner color='primary' />
    </Container>
  ),
}
