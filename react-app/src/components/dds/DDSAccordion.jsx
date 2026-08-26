import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export function DDSAccordion({ children, ...rest }) {
  return <div {...rest}>{children}</div>
}

export function DDSAccordionItem({ title, expanded, onToggle, children, ...rest }) {
  return (
    <Accordion expanded={expanded} onChange={onToggle} disableGutters {...rest}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
