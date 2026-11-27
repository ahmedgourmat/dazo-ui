import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Container, Textarea } from 'dazo-ui'

const meta = {
  title: 'Library/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'solid', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    rows: { control: { type: 'number', min: 1, max: 10 } },
    maxRows: { control: { type: 'number', min: 1, max: 20 } },
    invalid: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  args: {
    placeholder: 'Tell us about yourself',
    rows: 3,
    maxRows: 8,
    maxLength: 280,
    showCount: true,
    onChangeText: fn(),
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container width={420}>
      <Textarea {...args} />
    </Container>
  ),
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'Too short' },
  render: (args) => (
    <Container width={420}>
      <Textarea {...args} />
    </Container>
  ),
}
