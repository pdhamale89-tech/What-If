import React from 'react'
import Box from '@mui/material/Box'

export default function DDSFilter({ children, ...rest }) {
  return <Box component="aside" {...rest}>{children}</Box>
}
