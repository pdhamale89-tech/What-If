import React from 'react'
import FormControl from '@mui/material/FormControl'

// <DDSFormField><DDSLabel htmlFor="field">Label</DDSLabel><DDSTextField id="field" /></DDSFormField>
export default function DDSFormField({ children, fullWidth = true, ...rest }) {
  return <FormControl fullWidth={fullWidth} size="small" {...rest}>{children}</FormControl>
}
