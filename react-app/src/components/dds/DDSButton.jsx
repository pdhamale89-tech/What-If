import React from 'react'
import Button from '@mui/material/Button'
import { statusToColor } from './statusMap'

// <DDSButton variant="contained" color="primary" size="medium"> per the DDS skill reference.
export default function DDSButton({ status, variant = 'contained', fullWidth, children, ...rest }) {
  const color = status ? statusToColor(status) : rest.color || 'primary'
  const muiVariant = variant === 'solid' ? 'contained' : variant === 'link' ? 'text' : variant
  return (
    <Button variant={muiVariant} color={color} fullWidth={fullWidth} {...rest}>
      {children}
    </Button>
  )
}
