import React from 'react'
import Divider from '@mui/material/Divider'

export default function DDSDivider({ orientation = 'horizontal', ...rest }) {
  return <Divider orientation={orientation} flexItem={orientation === 'vertical'} {...rest} />
}
