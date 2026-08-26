import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export default function DDSIconButton({ title, variant, shape, children, ...rest }) {
  const btn = (
    <IconButton size={rest.size || 'medium'} sx={{ borderRadius: shape === 'circle' ? '50%' : 1 }} {...rest}>
      {children}
    </IconButton>
  )
  return title ? <Tooltip title={title}>{btn}</Tooltip> : btn
}
