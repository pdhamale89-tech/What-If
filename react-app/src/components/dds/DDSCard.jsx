import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// <DDSCard title="Title" subtitle="Subtitle">{content}</DDSCard> per the DDS skill reference.
// Renders children directly (no CardContent padding) unless a title/subtitle is given, so callers
// that already manage their own internal spacing (chart cards, KPI tiles) don't get doubled padding.
export default function DDSCard({ title, subtitle, variant, children, sx, ...rest }) {
  const hasHeader = Boolean(title || subtitle)
  return (
    <Card
      variant={variant === 'subtle' ? 'outlined' : 'elevation'}
      elevation={variant === 'subtle' ? 0 : 1}
      sx={{ bgcolor: variant === 'subtle' ? 'action.hover' : 'background.paper', ...sx }}
      {...rest}
    >
      {hasHeader && <CardHeader title={title} subheader={subtitle} />}
      {hasHeader ? <CardContent>{children}</CardContent> : children}
    </Card>
  )
}
