import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FileInput, Icon } from 'dazo'

const meta = {
  title: 'Library/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    autoOpenPicker: {
      control: 'boolean',
    },
    multiple: {
      control: 'boolean',
    },
    accept: {
      control: 'text',
    },
  },
  args: {
    onFilesSelected: fn(),
    onPress: fn(),
    onClear: fn(),
    label: 'Upload document',
    placeholder: 'Choose a PDF or image',
    accept: 'application/pdf,image/*',
    autoOpenPicker: false,
    multiple: false,
    disabled: false,
    value: 'proposal.pdf',
  },
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <FileInput
      {...args}
      leftIcon={<Icon name="Upload" size={16} />}
      rightIcon={<Icon name="FileText" size={16} />}
    />
  ),
}

export const MultipleFiles: Story = {
  args: {
    label: 'Project assets',
    placeholder: 'Choose one or more files',
    multiple: true,
    value: 'brand-guidelines.pdf, logo.svg',
  },
}