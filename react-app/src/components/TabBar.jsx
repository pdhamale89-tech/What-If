import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'

const TABS = [
  { id: 'simulation', label: '📊 Simulation' },
  { id: 'trends', label: '📈 Parameter Trends' },
  { id: 'export', label: '⤓ Export' },
]

export default function TabBar() {
  const { state, dispatch } = useDashboard()
  return (
    <div className="tab-bar">
      {TABS.map((t) => (
        <div
          key={t.id}
          className={`tab-btn${state.activeTab === t.id ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: t.id })}
        >
          {t.label}
        </div>
      ))}
    </div>
  )
}
