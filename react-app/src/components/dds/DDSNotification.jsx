import React from 'react'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'

export function DDSNotificationContainer({ children, placement = 'bottom-end', ...rest }) {
  const [v, h] = placement.split('-')
  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        [v === 'top' ? 'top' : 'bottom']: 20,
        [h === 'start' ? 'left' : 'right']: 20,
        zIndex: 9999,
        maxWidth: 340,
      }}
      {...rest}
    >
      {children}
    </Stack>
  )
}

export function DDSNotification({ status, children, ...rest }) {
  return (
    <Alert severity={status || 'info'} variant="filled" elevation={4} sx={{ boxShadow: 4 }} {...rest}>
      {children}
    </Alert>
  )
}
