import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

let uid = 0

// <DDSDropdown label="..." value={...} onChange={(value) => ...}>{options}</DDSDropdown>
export default function DDSDropdown({ label, value, onChange, multiple, children, size = 'small', fullWidth = true, ...rest }) {
  const id = React.useMemo(() => `dds-dropdown-${++uid}`, [])
  return (
    <FormControl size={size} fullWidth={fullWidth}>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <Select
        labelId={label ? id : undefined}
        label={label}
        value={value}
        multiple={multiple}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...rest}
      >
        {children}
      </Select>
    </FormControl>
  )
}

export const DDSOption = MenuItem
