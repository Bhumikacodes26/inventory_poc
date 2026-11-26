import { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'

function cellValue(column, row) {
  if (column.render) return column.render(row)
  if (column.format) return column.format(row[column.key])
  return row[column.key]
}

function ReportTable({ columns, rows }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // If a filter makes the list shorter, never stay on a page that no longer exists.
  const lastPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1)
  const currentPage = Math.min(page, lastPage)
  const visibleRows = rows.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.numeric ? 'right' : 'left'}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No records match the filters
                </TableCell>
              </TableRow>
            )}
            {visibleRows.map((row) => (
              <TableRow key={row.rowId} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.numeric ? 'right' : 'left'}>
                    {cellValue(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10))
          setPage(0)
        }}
      />
    </Paper>
  )
}

export default ReportTable