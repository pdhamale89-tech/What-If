import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export function DDSTabs({ value, onChange, size, children, ...rest }) {
  return (
    <Tabs
      value={value}
      onChange={(e, v) => onChange && onChange(v)}
      variant="scrollable"
      scrollButtons="auto"
      sx={size === 'small' ? { minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: 12 } } : undefined}
      {...rest}
    >
      {children}
    </Tabs>
  )
}

export function DDSTab({ value, children, ...rest }) {
  return <Tab value={value} label={children} {...rest} />
}
