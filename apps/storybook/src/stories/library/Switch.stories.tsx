import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Container, Switch } from 'dazo-ui'

const meta = {
  title: 'Library/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Push notifications', defaultChecked: true, size: 'md', labelPosition: 'start', onChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container width={360}>
      <Switch {...args} />
    </Container>
  ),
}

export const SettingsList: Story = {
  render: () => (
    <Container width={360} gap='md'>
      <Switch label='Push notifications' defaultChecked />
      <Switch label='Email digest' />
      <Switch label='Location services' disabled />
      <Switch label='Compact mode' size='sm' labelPosition='end' />
    </Container>
  ),
}
