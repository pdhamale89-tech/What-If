import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

export default function DDSTopbar({ children, ...rest }) {
  return (
    <AppBar position="fixed" color="default" elevation={1} {...rest}>
      <Toolbar variant="dense" sx={{ gap: 1.5, minHeight: 50 }}>
        {children}
      </Toolbar>
    </AppBar>
  )
}
