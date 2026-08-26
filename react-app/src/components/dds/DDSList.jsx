import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

export function DDSList({ children, ...rest }) {
  return <List disablePadding {...rest}>{children}</List>
}

export function DDSListItem({ children, ...rest }) {
  return <ListItem disableGutters {...rest}>{children}</ListItem>
}
