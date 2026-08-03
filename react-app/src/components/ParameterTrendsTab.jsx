import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { weeklyRowDefs, TREND_GROUP_META } from '../lib/constants'
import TrendCard from './TrendCard.jsx'

export default function ParameterTrendsTab() {
  const { state, dispatch, periods, derived } = useDashboard()
  const { weeklyData, collapsedTrendGroups, theme } = state

  const toggleTrendGroup = (group) => dispatch({ type: 'TOGGLE_TREND_GROUP', key: group })

  return (
    <div className="tab-content active" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="trends-panel">
        <div className="trends-legend">
          <span><span className="dot sq" style={{ background: 'var(--blue)' }}></span>A1 (Baseline) — bar</span>
          <span><span className="dot sq" style={{ background: 'var(--teal)' }}></span>A2 (Optimistic) — bar</span>
          <span><span className="dot" style={{ background: '#a855f7' }}></span>Δ (A2−A1) — line, right axis</span>
        </div>
        <div>
          {Object.keys(TREND_GROUP_META).map((group) => {
            const collapsed = !!collapsedTrendGroups[group]
            const chevron = collapsed ? '▶' : '▼'
            const rowsInGroup = weeklyRowDefs.filter((r) => !r.header && r.groups && r.groups[0] === group)
            return (
              <React.Fragment key={group}>
                <div className="trend-group-header" onClick={() => toggleTrendGroup(group)}>
                  <span className="wk-chevron">{chevron}</span> {TREND_GROUP_META[group]}
                </div>
                {!collapsed && (
                  <div className="trend-grid">
                    {rowsInGroup.map((r) => (
                      <React.Fragment key={r.key}>
                        {r.key === 'aux1' && <div className="trend-subheading">AUX States</div>}
                        <TrendCard r={r} weeklyData={weeklyData} derived={derived} periods={periods} theme={theme} />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
