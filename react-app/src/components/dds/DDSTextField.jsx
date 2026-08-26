import React from 'react'
import TextField from '@mui/material/TextField'

// <DDSTextField id="field" size="small" /> per the DDS skill reference.
export default function DDSTextField({ onChange, ...rest }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
      {...rest}
    />
  )
}
