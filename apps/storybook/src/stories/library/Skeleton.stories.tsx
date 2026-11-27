import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, Badge, Button, Container, Input, Skeleton, Switch, Text } from 'dazo-ui'

const meta = {
  title: 'Library/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    loading: { control: 'boolean' },
  },
  args: { loading: true },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

// Toggle `loading` in the controls: the real content appears in the same place.
export const Wrapper: Story = {
  render: (args) => (
    <Skeleton {...args}>
      <Container gap='md' width={360}>
        <Container flexDirection='row' gap='sm' alignItems='center'>
          <Avatar name='Ada Lovelace' size='lg' />
          <Container gap='xs'>
            <Text variant='subtitle'>Ada Lovelace</Text>
            <Text variant='caption'>ada@analytical.engine</Text>
          </Container>
        </Container>
        <Badge tone='success'>Active</Badge>
        <Input value='Ada Lovelace' placeholder='Name' />
        <Switch label='Email notifications' defaultChecked />
        <Button label='Save changes' />
      </Container>
    </Skeleton>
  ),
}

export const Blocks: Story = {
  render: () => (
    <Container gap='md' width={320}>
      <Skeleton circle size={48} />
      <Skeleton width={160} height={20} />
      <Skeleton lines={3} />
    </Container>
  ),
}
