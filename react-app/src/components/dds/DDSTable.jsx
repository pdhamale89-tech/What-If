import React from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

// <DDSTable columns={columns} data={data} size="small" /> per the DDS skill reference. Also exposed
// as composable primitives (Head/Body/Row/Cell) for tables whose structure isn't a flat rows array —
// this app's Parameter View and Notes History tables build rows conditionally, so they compose these
// primitives directly rather than passing a `data` prop.
export function DDSTable({ columns, data, size = 'small', children, ...rest }) {
  if (children) return <Table size={size} {...rest}>{children}</Table>
  return (
    <Table size={size} {...rest}>
      <TableHead>
        <TableRow>{columns.map((c) => <TableCell key={c.key}>{c.label}</TableCell>)}</TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>{columns.map((c) => <TableCell key={c.key}>{row[c.key]}</TableCell>)}</TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const DDSTableHead = TableHead
export const DDSTableBody = TableBody
export const DDSTableRow = TableRow

export function DDSTableCell({ component, ...rest }) {
  return <TableCell component={component === 'th' ? 'th' : undefined} variant={component === 'th' ? 'head' : 'body'} {...rest} />
}
