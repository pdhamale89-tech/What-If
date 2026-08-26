import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function DDSEmptyState({ title, description, size = 'medium' }) {
  const compact = size === 'small'
  return (
    <Box sx={{ textAlign: 'center', py: compact ? 2 : 4, px: 2, color: 'text.secondary' }}>
      {title && <Typography variant={compact ? 'body2' : 'subtitle2'} sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>}
      {description && <Typography variant="body2" sx={{ fontSize: compact ? 12 : 13 }}>{description}</Typography>}
    </Box>
  )
}
