import React from 'react'
import Box from '@mui/material/Box'

// <StandardLayout>{children}</StandardLayout> — full-width content area, no sidebar.
export function StandardLayout({ children, sx, ...rest }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, ...sx }} {...rest}>
      {children}
    </Box>
  )
}

// <SidebarLayout sidebar={<FilterPanel />}>{mainContent}</SidebarLayout>
export function SidebarLayout({ sidebar, children, sx, ...rest }) {
  return (
    <Box sx={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0, ...sx }} {...rest}>
      {sidebar}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  )
}
