import React from 'react'
import Typography from '@mui/material/Typography'

export default function DDSFootNote({ children, ...rest }) {
  return (
    <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary' }} {...rest}>
      {children}
    </Typography>
  )
}
