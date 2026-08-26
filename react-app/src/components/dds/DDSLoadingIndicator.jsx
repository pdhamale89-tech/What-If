import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function DDSLoadingIndicator({ size = 'medium', label }) {
  const px = size === 'large' ? 48 : size === 'small' ? 20 : 32
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={px} color="primary" />
      {label && <Typography variant="body2" color="text.secondary">{label}</Typography>}
    </Box>
  )
}
