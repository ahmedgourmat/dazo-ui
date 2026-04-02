import { isValidElement, type ReactNode } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../providers'
import { useCommonStyles } from 'hooks/common.hooks'
import type { TableAlign, TableColumn, TableProps } from './table.type'

const applyOpacityToColor = (color: string, opacity: number) => {
  const normalizedOpacity = Math.max(0, Math.min(1, opacity))

  if (color.startsWith('#')) {
    let hex = color.slice(1)

    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('')
    }

    if (hex.length === 6) {
      const r = Number.parseInt(hex.slice(0, 2), 16)
      const g = Number.parseInt(hex.slice(2, 4), 16)
      const b = Number.parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity})`
    }
  }

  if (color.startsWith('rgba(')) {
    return color.replace(/rgba\(([^)]+),\s*([0-9.]+)\)/, (_match, channels) => {
      return `rgba(${channels}, ${normalizedOpacity})`
    })
  }

  if (color.startsWith('rgb(')) {
    return color.replace(/rgb\(([^)]+)\)/, (_match, channels) => {
      return `rgba(${channels}, ${normalizedOpacity})`
    })
  }

  return color
}

const getAlignStyles = (align: TableAlign = 'left') => {
  if (align === 'center') {
    return { alignItems: 'center' as const }
  }

  if (align === 'right') {
    return { alignItems: 'flex-end' as const }
  }

  return { alignItems: 'flex-start' as const }
}

const getCellSizing = <T extends Record<string, unknown>>(column: TableColumn<T>) => {
  if (column.width !== undefined) {
    return { width: column.width }
  }

  return { flex: column.flex ?? 1 }
}

const toRenderableNode = (content: unknown): ReactNode => {
  if (content === null || content === undefined) {
    return null
  }

  if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
    return content
  }

  if (isValidElement(content) || Array.isArray(content)) {
    return content as ReactNode
  }

  return String(content)
}

export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  emptyText = 'No data',
  striped = true,
  stripedRow,
  stripedColumn = false,
  rowColor,
  rowStripeOpacity = 0.14,
  columnColor,
  columnStripeOpacity = 0.1,
  horizontalScroll = true,
  style,
  headerStyle,
  rowStyle,
  cellTextStyle,
  ...commonProps
}: TableProps<T>) => {
  const theme = useTheme()
  const commonStyles = useCommonStyles(commonProps)
  const useStripedRows = stripedRow ?? striped

  const getRowBackground = (rowIndex: number) => {
    if (!useStripedRows) {
      return 'transparent'
    }

    if (!rowColor) {
      return rowIndex % 2 === 1 ? theme.colors.background : 'transparent'
    }

    if (rowIndex % 2 === 1) {
      return applyOpacityToColor(rowColor, rowStripeOpacity)
    }

    // Give even rows a lighter tint only when a custom rowColor is provided.
    return applyOpacityToColor(rowColor, rowStripeOpacity * 0.35)
  }

  const getColumnBackground = (columnIndex: number) => {
    if (!stripedColumn) {
      return undefined
    }

    if (!columnColor) {
      return columnIndex % 2 === 1 ? applyOpacityToColor(theme.colors.backgroundSunken, 0.35) : undefined
    }

    return columnIndex % 2 === 1
      ? applyOpacityToColor(columnColor, columnStripeOpacity)
      : applyOpacityToColor(columnColor, columnStripeOpacity * 0.45)
  }

  const tableContent = (
    <View
      style={[
        styles.table,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.backgroundSurface,
        },
        commonStyles,
        style,
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
            backgroundColor: theme.colors.backgroundSunken,
          },
          headerStyle,
        ]}
      >
        {columns.map((column) => (
          <View
            key={`header-${column.key}`}
            style={[styles.cell, getCellSizing(column), getAlignStyles(column.align)]}
          >
            <Text
              style={[
                styles.headerText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fontFamily.medium,
                },
              ]}
            >
              {column.title}
            </Text>
          </View>
        ))}
      </View>

      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular }}>{emptyText}</Text>
        </View>
      ) : (
        data.map((row, rowIndex) => {
          const rowKey = keyExtractor ? keyExtractor(row, rowIndex) : `${rowIndex}`
          const rowBackground = getRowBackground(rowIndex)

          return (
            <View
              key={rowKey}
              style={[
                styles.row,
                {
                  borderBottomColor: theme.colors.border,
                  backgroundColor: rowBackground,
                },
                rowStyle,
              ]}
            >
              {columns.map((column, columnIndex) => {
                const value = row[column.key]
                const content = column.render ? column.render(value, row, rowIndex) : value
                const renderableContent = toRenderableNode(content)
                const isPrimitiveText = typeof renderableContent === 'string' || typeof renderableContent === 'number'
                const columnBackground = getColumnBackground(columnIndex)

                return (
                  <View
                    key={`${rowKey}-${column.key}`}
                    style={[
                      styles.cell,
                      getCellSizing(column),
                      getAlignStyles(column.align),
                      columnBackground ? { backgroundColor: columnBackground } : null,
                    ]}
                  >
                    {isPrimitiveText ? (
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: theme.colors.textPrimary,
                            fontFamily: theme.fontFamily.regular,
                          },
                          cellTextStyle,
                        ]}
                      >
                        {String(renderableContent)}
                      </Text>
                    ) : (
                      renderableContent
                    )}
                  </View>
                )
              })}
            </View>
          )
        })
      )}
    </View>
  )

  if (!horizontalScroll) {
    return tableContent
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ minWidth: '100%' }}>{tableContent}</View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    minHeight: 44,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    minHeight: 44,
    borderBottomWidth: 1,
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 600,
  },
  cellText: {
    fontSize: 14,
  },
  emptyState: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
})