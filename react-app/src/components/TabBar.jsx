import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { DDSTabs, DDSTab } from '../components/dds'

const TABS = [
  { id: 'simulation', label: '📊 Simulation' },
  { id: 'trends', label: '📈 Parameter Trends' },
  { id: 'export', label: '⤓ Export' },
]

export default function TabBar() {
  const { state, dispatch } = useDashboard()
  return (
    <DDSTabs
      className="tab-bar"
      value={state.activeTab}
      onChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', tab })}
    >
      {TABS.map((t) => <DDSTab key={t.id} value={t.id}>{t.label}</DDSTab>)}
    </DDSTabs>
  )
}
