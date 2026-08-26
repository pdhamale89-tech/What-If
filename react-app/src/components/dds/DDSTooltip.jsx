import React from 'react'
import Tooltip from '@mui/material/Tooltip'

export default function DDSTooltip({ content, placement = 'bottom', children }) {
  return (
    <Tooltip
      title={content}
      placement={placement}
      arrow
      slotProps={{ tooltip: { sx: { maxWidth: 280, fontSize: 11, lineHeight: 1.5 } } }}
    >
      {children}
    </Tooltip>
  )
}
