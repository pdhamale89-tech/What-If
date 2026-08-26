import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { weeklyRowDefs } from '../lib/constants'
import { aggVals } from '../lib/calc'
import { DDSTable, DDSTableHead, DDSTableBody, DDSTableRow, DDSTableCell, DDSBadge } from '../components/dds'

const VIEW_TITLES = { weekly: '13-WEEK', quarterly: 'QUARTERLY', monthly: 'MONTHLY' }

function DeltaBadge({ diff, r }) {
  const dec = r.dec || 0
  const rounded = +diff.toFixed(dec)
  const status = rounded > 0 ? 'success' : rounded < 0 ? 'danger' : 'default'
  const sign = rounded > 0 ? '+' : ''
  const suffix = r.suffix || ''
  return (
    <DDSBadge status={status} className="cell-delta" title="A2 vs A1">
      Δ{sign}{rounded}{suffix}
    </DDSBadge>
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
        <DDSTable className="weekly-table">
          <DDSTableHead>
            <DDSTableRow>
              <DDSTableCell component="th" className="wk-param-head">Parameters</DDSTableCell>
              {periods.map((p) => <DDSTableCell component="th" colSpan={2} key={p.label}>{p.label}</DDSTableCell>)}
            </DDSTableRow>
            <DDSTableRow>
              <DDSTableCell component="th"></DDSTableCell>
              {periods.map((p) => (
                <React.Fragment key={p.label}>
                  <DDSTableCell component="th">Scenario A1</DDSTableCell>
                  <DDSTableCell component="th">Scenario A2</DDSTableCell>
                </React.Fragment>
              ))}
            </DDSTableRow>
          </DDSTableHead>
          <DDSTableBody>
            {weeklyRowDefs.map((r, i) => {
              const hiddenByAncestor = r.groups && r.groups.some((g) => collapsedGroups[g])
              if (r.header) {
                if (hiddenByAncestor) return null
                const collapsed = !!collapsedGroups[r.toggleGroup]
                const chevron = collapsed ? '▶' : '▼'
                const levelClass = r.level === 0 ? 'wk-group-top' : 'wk-group-sub'
                return (
                  <DDSTableRow
                    key={r.label + i}
                    className={`wk-section-row ${levelClass} wk-collapsible`}
                    onClick={() => toggleGroup(r.toggleGroup)}
                  >
                    <DDSTableCell className="wk-param"><span className="wk-chevron">{chevron}</span> {r.label}</DDSTableCell>
                    <DDSTableCell colSpan={periods.length * 2}></DDSTableCell>
                  </DDSTableRow>
                )
              }
              if (hiddenByAncestor) return null
              const src = r.derived ? derived[r.key] : weeklyData[r.key]
              return (
                <DDSTableRow key={r.key}>
                  <DDSTableCell className="wk-param">{r.label}</DDSTableCell>
                  {periods.map((p) => {
                    const a1Val = aggVals(src.a1, p.idx, r.agg, r.dec)
                    const a2Val = aggVals(src.a2, p.idx, r.agg, r.dec)
                    return (
                      <React.Fragment key={p.label}>
                        <DDSTableCell>{a1Val}{r.suffix || ''}</DDSTableCell>
                        <DDSTableCell>{a2Val}{r.suffix || ''} <DeltaBadge diff={a2Val - a1Val} r={r} /></DDSTableCell>
                      </React.Fragment>
                    )
                  })}
                </DDSTableRow>
              )
            })}
          </DDSTableBody>
        </DDSTable>
      </div>
    </div>
  )
}
