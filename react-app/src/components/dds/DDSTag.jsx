import React from 'react'
import Chip from '@mui/material/Chip'

export default function DDSTag({ children, onRemove, size = 'small', ...rest }) {
  return <Chip label={children} onDelete={onRemove} variant="outlined" color="primary" size={size} {...rest} />
}
