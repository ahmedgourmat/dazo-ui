import type { ReactNode } from 'react'
import type { CommonProps } from '../../styles/commonStyling.type'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type TableAlign = 'left' | 'center' | 'right'

export type TableColumn<T extends Record<string, unknown>> = {
  key: keyof T & string
  title: string
  width?: number
  flex?: number
  align?: TableAlign
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode
}

export interface TableProps<T extends Record<string, unknown>>
  extends Omit<CommonProps, 'children' | 'scrollable' | 'style'> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor?: (row: T, index: number) => string
  emptyText?: string
  // Backward compatibility alias for stripedRow.
  striped?: boolean
  stripedRow?: boolean
  stripedColumn?: boolean
  rowColor?: string
  rowStripeOpacity?: number
  columnColor?: string
  columnStripeOpacity?: number
  horizontalScroll?: boolean
  style?: StyleProp<ViewStyle>
  headerStyle?: StyleProp<ViewStyle>
  rowStyle?: StyleProp<ViewStyle>
  cellTextStyle?: StyleProp<TextStyle>
}