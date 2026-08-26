import React from 'react'
import FormLabel from '@mui/material/FormLabel'

export default function DDSLabel({ children, ...rest }) {
  return (
    <FormLabel sx={{ fontSize: 12, fontWeight: 500, mb: 0.5, display: 'block', color: 'text.secondary' }} {...rest}>
      {children}
    </FormLabel>
  )
}
