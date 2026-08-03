import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { weeklyRowDefs } from '../lib/constants'
import { aggVals } from '../lib/calc'

const VIEW_TITLES = { weekly: '13-WEEK', quarterly: 'QUARTERLY', monthly: 'MONTHLY' }

function DeltaBadge({ diff, r }) {
  const dec = r.dec || 0
  const rounded = +diff.toFixed(dec)
  const cls = rounded > 0 ? 'pos' : rounded < 0 ? 'neg' : 'zero'
  const sign = rounded > 0 ? '+' : ''
  const suffix = r.suffix || ''
  return (
    <span className={`cell-delta cell-delta-${cls}`} title="A2 vs A1">
      Δ{sign}{rounded}{suffix}
    </span>
  )
}

export default function ParameterTable() {
  const { state, dispatch, periods, derived } = useDashboard()
  const { weeklyData, collapsedGroups, viewMode } = state

  const toggleGroup = (group) => dispatch({ type: 'TOGGLE_GROUP', key: group })

  return (
    <div>
      <div className="section-title">📅 {VIEW_TITLES[viewMode]} PARAMETER VIEW</div>
      <div className="weekly-table-wrap">
        <table className="weekly-table">
          <thead>
            <tr>
              <th className="wk-param-head">Parameters</th>
              {periods.map((p) => <th colSpan={2} key={p.label}>{p.label}</th>)}
            </tr>
            <tr>
              <th></th>
              {periods.map((p) => (
                <React.Fragment key={p.label}>
                  <th>Scenario A1</th>
                  <th>Scenario A2</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyRowDefs.map((r, i) => {
              const hiddenByAncestor = r.groups && r.groups.some((g) => collapsedGroups[g])
              if (r.header) {
                if (hiddenByAncestor) return null
                const collapsed = !!collapsedGroups[r.toggleGroup]
                const chevron = collapsed ? '▶' : '▼'
                const levelClass = r.level === 0 ? 'wk-group-top' : 'wk-group-sub'
                return (
                  <tr
                    key={r.label + i}
                    className={`wk-section-row ${levelClass} wk-collapsible`}
                    onClick={() => toggleGroup(r.toggleGroup)}
                  >
                    <td className="wk-param"><span className="wk-chevron">{chevron}</span> {r.label}</td>
                    <td colSpan={periods.length * 2}></td>
                  </tr>
                )
              }
              if (hiddenByAncestor) return null
              const src = r.derived ? derived[r.key] : weeklyData[r.key]
              return (
                <tr key={r.key}>
                  <td className="wk-param">{r.label}</td>
                  {periods.map((p) => {
                    const a1Val = aggVals(src.a1, p.idx, r.agg, r.dec)
                    const a2Val = aggVals(src.a2, p.idx, r.agg, r.dec)
                    return (
                      <React.Fragment key={p.label}>
                        <td>{a1Val}{r.suffix || ''}</td>
                        <td>{a2Val}{r.suffix || ''} <DeltaBadge diff={a2Val - a1Val} r={r} /></td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
