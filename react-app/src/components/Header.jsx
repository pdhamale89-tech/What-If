import React from 'react'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDashboard } from '../context/DashboardContext.jsx'
import { DDSTopbar, DDSDropdown, DDSOption, DDSSwitch, DDSTabs, DDSTab, DDSIconButton, DDSDivider } from '../components/dds'

const VIEW_MODES = ['weekly', 'quarterly', 'monthly']

export default function Header() {
  const { state, dispatch } = useDashboard()

  return (
    <DDSTopbar className="header">
      <Box className="header-logo" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <svg viewBox="0 0 24 24" width={24} height={24} fill="#0076ce">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 5.29 2.05l-2.83 2.83a4.98 4.98 0 0 0-4.92 0L6.71 6.05A8 8 0 0 1 12 4zm-8 8a8 8 0 0 1 1.13-4.09l2.83 2.83a4.98 4.98 0 0 0 0 4.92L5.13 16.09A8 8 0 0 1 4 12zm8 8a8 8 0 0 1-5.29-2.05l2.83-2.83a4.98 4.98 0 0 0 4.92 0l2.83 2.83A8 8 0 0 1 12 20zm5.29-2.05l-2.83-2.83a4.98 4.98 0 0 0 0-4.92l2.83-2.83A7.96 7.96 0 0 1 20 12a7.96 7.96 0 0 1-2.71 5.95z" />
        </svg>
        <Box component="span" sx={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>WHAT-IF SIMULATION COMPARISON</Box>
      </Box>
      <DDSDivider orientation="vertical" className="header-sep" />
      <DDSDropdown label="Scenario Set" defaultValue="FY26 Planning" sx={{ minWidth: 140 }}>
        <DDSOption value="FY26 Planning">FY26 Planning</DDSOption>
        <DDSOption value="FY25 Actual">FY25 Actual</DDSOption>
      </DDSDropdown>
      <DDSDropdown label="Scenario A1" defaultValue="Baseline" sx={{ minWidth: 120 }}>
        <DDSOption value="Baseline">Baseline</DDSOption>
        <DDSOption value="Conservative">Conservative</DDSOption>
      </DDSDropdown>
      <DDSDropdown label="Scenario A2" defaultValue="Optimistic" sx={{ minWidth: 120 }}>
        <DDSOption value="Optimistic">Optimistic</DDSOption>
        <DDSOption value="Aggressive">Aggressive</DDSOption>
      </DDSDropdown>
      <DDSDivider orientation="vertical" className="header-sep" />
      <DDSSwitch label="Compare" defaultChecked />
      <DDSDivider orientation="vertical" className="header-sep" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 11 }}>
        View
        <DDSTabs
          size="small"
          value={state.viewMode}
          onChange={(mode) => dispatch({ type: 'SET_VIEW_MODE', mode })}
        >
          {VIEW_MODES.map((mode) => (
            <DDSTab key={mode} value={mode}>{mode[0].toUpperCase() + mode.slice(1)}</DDSTab>
          ))}
        </DDSTabs>
      </Box>
      <Box sx={{ flex: 1 }} />
      <DDSIconButton title="Toggle theme" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
        {state.theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </DDSIconButton>
      <DDSIconButton title="More"><MoreVertIcon fontSize="small" /></DDSIconButton>
    </DDSTopbar>
  )
}
