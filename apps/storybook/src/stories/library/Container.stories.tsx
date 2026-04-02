import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container, Text } from 'dazo'

const meta = {
  title: 'Library/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    padding: 'lg',
    margin: 'md',
    borderRadius: 'lg',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    width: '100%',
    minHeight: 240,
    gap: 'md',
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Container {...args}>
      <Text variant="title">Container content</Text>
      <Text>
        This story demonstrates padding, margin, sizing, border, and flex-related common props.
      </Text>
      <Text variant="caption" color="#6B7280">
        All layout props are inherited from the shared common prop surface.
      </Text>
    </Container>
  ),
}

export const Card: Story = {
  args: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 'full',
    padding: 'xl',
    minHeight: 180,
  },
  render: (args) => (
    <Container {...args}>
      <Text variant="subtitle">Flexible shell</Text>
      <Text>Use this container as a wrapper for cards, panels, or sections.</Text>
    </Container>
  ),
}