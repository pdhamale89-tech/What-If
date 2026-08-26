import React from 'react'
import Alert from '@mui/material/Alert'

export default function DDSMessageBar({ kind = 'info', children, ...rest }) {
  return <Alert severity={kind} variant="outlined" icon={false} {...rest}>{children}</Alert>
}
