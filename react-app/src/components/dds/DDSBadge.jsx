import React from 'react'
import Chip from '@mui/material/Chip'
import { statusToColor } from './statusMap'

export default function DDSBadge({ status, size = 'small', children, ...rest }) {
  return <Chip label={children} color={statusToColor(status)} size={size} {...rest} />
}
