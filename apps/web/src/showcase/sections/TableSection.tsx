import { Table } from 'dazo'
import { useMemo } from 'react'
import { ShowcaseSection } from '../components/ShowcaseSection'
import type { TeamRow } from '../types/showcase.type'

const tableCode = `import { Table } from 'dazo'

<Table
  columns={[
    { key: 'name', title: 'Name', width: 180, align: 'left' },
    { key: 'role', title: 'Role', width: 120, align: 'center' },
    { key: 'score', title: 'Score', width: 100, align: 'right', render: (value) => \`${'${String(value)}'}%\` },
  ]}
  data={tableData}
  keyExtractor={(row) => row.id}
  stripedRow
  stripedColumn
  horizontalScroll
/>`

export const TableSection = () => {
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
      subtitle='Column renderers, striping, and horizontal scrolling for data-heavy previews.'
      codeTitle='table.tsx'
      code={tableCode}
    >
      <Table<TeamRow>
        columns={[
          { key: 'name', title: 'Name', width: 180, align: 'left' },
          { key: 'role', title: 'Role', width: 120, align: 'center' },
          {
            key: 'score',
            title: 'Score',
            width: 100,
            align: 'right',
            render: (value) => `${String(value)}%`,
          },
          {
            key: 'status',
            title: 'Status',
            width: 130,
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
        stripedColumn
        horizontalScroll
        rowStyle={{ minHeight: 48 }}
        cellTextStyle={{ fontSize: 13 }}
      />
    </ShowcaseSection>
  )
}
