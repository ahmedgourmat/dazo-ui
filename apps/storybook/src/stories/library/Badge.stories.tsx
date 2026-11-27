import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Container } from 'dazo-ui'

const tones = ['neutral', 'danger', 'success', 'warning', 'info'] as const

const meta = {
  title: 'Library/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    variant: { control: 'inline-radio', options: ['solid', 'subtle', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { children: 'New', tone: 'neutral', variant: 'solid', size: 'md' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllTones: Story = {
  render: () => (
    <Container gap='sm'>
      {(['solid', 'subtle', 'outline'] as const).map((variant) => (
        <Container key={variant} flexDirection='row' gap='sm'>
          {tones.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>{tone}</Badge>
          ))}
        </Container>
      ))}
    </Container>
  ),
}
