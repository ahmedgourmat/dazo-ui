import { Table } from 'dazo'
import { useMemo } from 'react'
import { ShowcaseSection } from '../components/ShowcaseSection'
import type { TeamRow } from '../types/showcase.type'

const code = `import { Table } from 'dazo'

<Table
  columns={columns}
  data={tableData}
  stripedRow
  stripedColumn
  horizontalScroll
/>`

export const TableSection = (): React.JSX.Element => {
  const tableData: TeamRow[] = useMemo(
    () => [
      { id: '1', name: 'Amina Noor', role: 'Admin', score: 98, status: 'Active' },
      { id: '2', name: 'Omar Sami', role: 'Editor', score: 84, status: 'Pending' },
      { id: '3', name: 'Sara Adel', role: 'Viewer', score: 76, status: 'Inactive' },
      { id: '4', name: 'Lina Fares', role: 'Admin', score: 92, status: 'Active' },
    ],
    []
  )

  return (
    <ShowcaseSection
      title='Table'
      subtitle='Data table demo with custom renderers and striping.'
      codeTitle='table.tsx'
      code={code}
    >
      <Table<TeamRow>
        columns={[
          { key: 'name', title: 'Name', width: 160, align: 'left' },
          { key: 'role', title: 'Role', width: 110, align: 'center' },
          {
            key: 'score',
            title: 'Score',
            width: 90,
            align: 'right',
            render: (value) => `${String(value)}%`,
          },
          {
            key: 'status',
            title: 'Status',
            width: 120,
            align: 'center',
            render: (value) => {
              const safeValue = String(value)
              return safeValue === 'Active' ? 'Online' : safeValue
            },
          },
        ]}
        data={tableData}
        keyExtractor={(row) => row.id}
        emptyText='No users found'
        stripedRow
        rowColor='#22c55e'
        rowStripeOpacity={0.14}
        stripedColumn
        columnColor='#3b82f6'
        columnStripeOpacity={0.06}
        horizontalScroll
        headerStyle={{ backgroundColor: '#eef2ff' }}
        rowStyle={{ minHeight: 46 }}
        cellTextStyle={{ fontSize: 13 }}
      />
    </ShowcaseSection>
  )
}
