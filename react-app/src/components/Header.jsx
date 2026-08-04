import React, { useState } from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'

export default function Header() {
  const { state, dispatch } = useDashboard()
  const [compareActive, setCompareActive] = useState(true)

  return (
    <header className="header">
      <div className="header-logo">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 5.29 2.05l-2.83 2.83a4.98 4.98 0 0 0-4.92 0L6.71 6.05A8 8 0 0 1 12 4zm-8 8a8 8 0 0 1 1.13-4.09l2.83 2.83a4.98 4.98 0 0 0 0 4.92L5.13 16.09A8 8 0 0 1 4 12zm8 8a8 8 0 0 1-5.29-2.05l2.83-2.83a4.98 4.98 0 0 0 4.92 0l2.83 2.83A8 8 0 0 1 12 20zm5.29-2.05l-2.83-2.83a4.98 4.98 0 0 0 0-4.92l2.83-2.83A7.96 7.96 0 0 1 20 12a7.96 7.96 0 0 1-2.71 5.95z" />
        </svg>
        WHAT-IF SIMULATION Comparison
      </div>
      <div className="header-sep" />
      <label>Scenario Set<select defaultValue="FY26 Planning"><option>FY26 Planning</option><option>FY25 Actual</option></select></label>
      <label>Scenario A1<select defaultValue="Baseline"><option>Baseline</option><option>Conservative</option></select></label>
      <label>Scenario A2<select defaultValue="Optimistic"><option>Optimistic</option><option>Aggressive</option></select></label>
      <div className="header-sep" />
      <div className="toggle-wrap">
        Compare
        <div className={`toggle-switch${compareActive ? ' active' : ''}`} onClick={() => setCompareActive((v) => !v)} />
      </div>
      <div className="header-sep" />
      <div className="toggle-wrap">
        View
        <div className="seg-toggle">
          {['weekly', 'quarterly', 'monthly'].map((mode) => (
            <button
              key={mode}
              className={`seg-btn${state.viewMode === mode ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', mode })}
            >
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="header-spacer" />
      <div className="theme-toggle" onClick={() => dispatch({ type: 'TOGGLE_THEME' })} title="Toggle theme">
        {state.theme === 'dark' ? '☀' : '🌙'}
      </div>
      <div className="theme-toggle" style={{ fontSize: 18 }} title="More">⋮</div>
    </header>
  )
}
