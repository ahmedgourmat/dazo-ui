import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '../../test/utils'
import { Table } from './index'

type User = { name: string; age: number; active: boolean }

const columns = [
  { key: 'name' as const, title: 'Name' },
  { key: 'age' as const, title: 'Age', align: 'right' as const },
]

const data: User[] = [
  { name: 'Ada', age: 36, active: true },
  { name: 'Linus', age: 54, active: false },
]

describe('Table', () => {
  it('renders a header for every column and a cell for every value', () => {
    renderWithTheme(<Table<User> columns={columns} data={data} />)

    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Age')).toBeTruthy()
    expect(screen.getByText('Ada')).toBeTruthy()
    expect(screen.getByText('54')).toBeTruthy()
  })

  it('uses a column render function when given', () => {
    renderWithTheme(
      <Table<User>
        columns={[
          { key: 'name', title: 'Name' },
          { key: 'active', title: 'Status', render: (value) => <span>{value ? 'Active' : 'Inactive'}</span> },
        ]}
        data={data}
      />,
    )

    expect(screen.getByText('Active')).toBeTruthy()
    expect(screen.getByText('Inactive')).toBeTruthy()
  })

  it('shows the empty text when there are no rows', () => {
    renderWithTheme(<Table<User> columns={columns} data={[]} emptyText='Nothing here' />)

    expect(screen.getByText('Nothing here')).toBeTruthy()
  })

  it('renders the same rows with horizontal scrolling turned off', () => {
    renderWithTheme(<Table<User> columns={columns} data={data} horizontalScroll={false} />)

    expect(screen.getByText('Linus')).toBeTruthy()
  })
})
