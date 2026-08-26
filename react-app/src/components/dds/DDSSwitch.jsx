import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export default function DDSSwitch({ label, checked, defaultChecked, onChange, size = 'small', ...rest }) {
  const control = (
    <Switch
      size={size}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      {...rest}
    />
  )
  return label ? <FormControlLabel control={control} label={label} sx={{ m: 0, gap: 0.5 }} /> : control
}
