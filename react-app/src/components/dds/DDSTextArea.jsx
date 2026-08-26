import React from 'react'
import TextField from '@mui/material/TextField'

export default function DDSTextArea({ onChange, minRows = 3, ...rest }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      multiline
      minRows={minRows}
      onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
      {...rest}
    />
  )
}
