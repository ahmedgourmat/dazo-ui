import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, Container, FormField, Input, Select, Textarea } from 'dazo-ui'

const meta = {
  title: 'Library/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    error: { control: 'text' },
    helperText: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Email',
    helperText: "We'll never share it.",
    required: true,
    children: null,
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container width={380}>
      <FormField {...args}>
        <Input placeholder='name@company.com' />
      </FormField>
    </Container>
  ),
}

export const WithError: Story = {
  args: { error: 'Enter a valid email address' },
  render: (args) => (
    <Container width={380}>
      <FormField {...args}>
        <Input value='ada@' />
      </FormField>
    </Container>
  ),
}

export const EveryControl: Story = {
  render: () => (
    <Container width={380} gap='lg'>
      <FormField label='Plan' error='Pick a plan to continue'>
        <Select placeholder='Choose a plan' options={[{ label: 'Pro', value: 'pro' }]} />
      </FormField>
      <FormField label='About you' helperText='Optional'>
        <Textarea rows={2} maxLength={160} showCount />
      </FormField>
      <FormField label='Terms' error='You must accept the terms' required>
        <Checkbox label='I accept the terms of service' />
      </FormField>
    </Container>
  ),
}
