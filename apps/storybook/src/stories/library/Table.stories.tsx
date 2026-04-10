import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from 'dazo-ui'

const rows = [
  {
    name: 'Ava Johnson',
    role: 'Design',
    status: 'Active',
    email: 'ava@dazo-ui.dev',
  },
  {
    name: 'Noah Kim',
    role: 'Engineering',
    status: 'Away',
    email: 'noah@dazo-ui.dev',
  },
  {
    name: 'Mia Chen',
    role: 'Marketing',
    status: 'Active',
    email: 'mia@dazo-ui.dev',
  },
]

const columns = [
  {
    key: 'name',
    title: 'Name',
    flex: 1.2,
  },
  {
    key: 'role',
    title: 'Role',
    flex: 1,
  },
  {
    key: 'status',
    title: 'Status',
    width: 120,
    align: 'center' as const,
  },
  {
    key: 'email',
    title: 'Email',
    flex: 1.4,
  },
] as const

const meta = {
  title: 'Library/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    columns: [...columns],
    data: [...rows],
    striped: true,
    stripedRow: true,
    stripedColumn: false,
    horizontalScroll: true,
    emptyText: 'No rows found',
    rowColor: '#3B82F6',
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => <Table {...args} />,
}

export const ColumnStriping: Story = {
  args: {
    stripedColumn: true,
    columnColor: '#10B981',
    columnStripeOpacity: 0.12,
  },
}

export const EmptyState: Story = {
  args: {
    data: [],
  },
}