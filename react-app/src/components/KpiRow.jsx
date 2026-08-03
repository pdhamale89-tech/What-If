import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { aggVals, fmt } from '../lib/calc'

const VIEW_LABELS = {
  weekly: { kpi: 'Latest Week' },
  quarterly: { kpi: 'Latest Quarter' },
  monthly: { kpi: 'Latest Month' },
}

export default function KpiRow() {
  const { state, periods, derived } = useDashboard()
  const { weeklyData, viewMode } = state
  const latest = periods[periods.length - 1]
  const idx = latest.idx

  const handled1 = aggVals(weeklyData.handled.a1, idx, 'sum', 0)
  const handled2 = aggVals(weeklyData.handled.a2, idx, 'sum', 0)
  const reqHC1 = aggVals(derived.reqHC.a1, idx, 'avg', 0)
  const reqHC2 = aggVals(derived.reqHC.a2, idx, 'avg', 0)
  const ar1 = aggVals(weeklyData.ar.a1, idx, 'avg', 1)
  const ar2 = aggVals(weeklyData.ar.a2, idx, 'avg', 1)
  const occ1 = aggVals(derived.occ.a1, idx, 'avg', 1)
  const occ2 = aggVals(derived.occ.a2, idx, 'avg', 1)
  const util1 = aggVals(derived.util.a1, idx, 'avg', 1)
  const util2 = aggVals(derived.util.a2, idx, 'avg', 1)
  const prod1 = aggVals(derived.prod.a1, idx, 'avg', 1)
  const prod2 = aggVals(derived.prod.a2, idx, 'avg', 1)
  const pct = (a, b) => (a ? ((b - a) / a) * 100 : 0)

  const kpis = [
    { title: 'Forecast (Handled)', v1: fmt(handled1), v2: fmt(handled2), delta: handled2 - handled1, pct: pct(handled1, handled2) },
    { title: 'Required Headcount', v1: fmt(reqHC1), v2: fmt(reqHC2), delta: reqHC2 - reqHC1, pct: pct(reqHC1, reqHC2) },
    { title: 'SLA (AR%)', v1: ar1.toFixed(1) + '%', v2: ar2.toFixed(1) + '%', delta: ar2 - ar1, pct: null, suffix: '%' },
    { title: 'Occupancy', v1: occ1.toFixed(1) + '%', v2: occ2.toFixed(1) + '%', delta: occ2 - occ1, pct: null, suffix: '%' },
    { title: 'Utilization', v1: util1.toFixed(1) + '%', v2: util2.toFixed(1) + '%', delta: util2 - util1, pct: null, suffix: '%' },
    { title: 'Productivity (C/HC)', v1: prod1.toFixed(1), v2: prod2.toFixed(1), delta: prod2 - prod1, pct: pct(prod1, prod2) },
  ]

  const periodLabel = `${VIEW_LABELS[viewMode].kpi}: ${latest.label}`

  return (
    <div>
      <div className="section-title">
        ⚡ KEY RESULTS <span className="badge">Real-time</span>
        <span className="badge badge-period">{periodLabel}</span>
      </div>
      <div className="kpi-row">
        {kpis.map((k) => {
          const cls = k.delta >= 0 ? 'pos' : 'neg'
          const sign = k.delta >= 0 ? '+' : ''
          return (
            <div className="kpi-card" key={k.title}>
              <div className="kpi-title">{k.title}</div>
              <div className="kpi-values">
                <div className="kpi-val">{k.v1}<small>A1</small></div>
                <div className="kpi-val">{k.v2}<small>A2</small></div>
              </div>
              <span className={`kpi-delta ${cls}`}>
                {k.delta >= 0 ? '▲' : '▼'} {sign}{k.delta.toFixed(1)}{k.suffix || ''}
                {k.pct !== null ? ` (${sign}${k.pct.toFixed(2)}%)` : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
