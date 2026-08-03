import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { weeklyRowDefs } from '../lib/constants'
import { idxAll, aggVals } from '../lib/calc'

export default function ExportTab() {
  const { state, derived, showToast } = useDashboard()
  const { weeklyData } = state

  const summaryStats = useMemo(() => {
    const all = idxAll()
    return [
      { l: 'Forecast (Handled, 13-wk total)', v1: aggVals(weeklyData.handled.a1, all, 'sum', 0).toLocaleString('en-US'), v2: aggVals(weeklyData.handled.a2, all, 'sum', 0).toLocaleString('en-US') },
      { l: 'Headcount (Week 13)', v1: weeklyData.hc.a1[12].toLocaleString('en-US'), v2: weeklyData.hc.a2[12].toLocaleString('en-US') },
      { l: 'Avg SLA (AR%)', v1: aggVals(weeklyData.ar.a1, all, 'avg', 1) + '%', v2: aggVals(weeklyData.ar.a2, all, 'avg', 1) + '%' },
      { l: 'Avg AHT (sec)', v1: aggVals(weeklyData.aht.a1, all, 'avg', 0), v2: aggVals(weeklyData.aht.a2, all, 'avg', 0) },
      { l: 'Avg Absenteeism', v1: aggVals(weeklyData.absent.a1, all, 'avg', 1) + '%', v2: aggVals(weeklyData.absent.a2, all, 'avg', 1) + '%' },
      { l: 'Avg Availability', v1: aggVals(weeklyData.avail.a1, all, 'avg', 1) + '%', v2: aggVals(weeklyData.avail.a2, all, 'avg', 1) + '%' },
    ]
  }, [weeklyData])

  const rows = useMemo(() => {
    const all = idxAll()
    return weeklyRowDefs.filter((r) => !r.header).map((r, i) => {
      const src = r.derived ? derived[r.key] : weeklyData[r.key]
      const v1 = aggVals(src.a1, all, r.agg, r.dec)
      const v2 = aggVals(src.a2, all, r.agg, r.dec)
      return { n: i + 1, label: r.label, v1: v1 + (r.suffix || ''), v2: v2 + (r.suffix || ''), delta: v2 - v1 }
    })
  }, [weeklyData, derived])

  const exportCSV = () => {
    const header = ['#', 'Parameter', 'A1 (Baseline)', 'A2 (Optimistic)', 'Delta']
    const csvRows = [header, ...rows.map((r) => [r.n, r.label, r.v1, r.v2, (r.delta >= 0 ? '+' : '') + r.delta.toFixed(1)])]
    const csv = csvRows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'scenario_export.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('📥 CSV downloaded')
  }

  return (
    <div className="tab-content active" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="export-panel">
        <div className="export-card">
          <h2>📊 Scenario Summary</h2>
          <div className="summary-grid">
            {summaryStats.map((s) => (
              <div className="summary-stat" key={s.l}>
                <div className="label">{s.l}</div>
                <div className="val">{s.v1}</div>
                <div className="sub">A2: {s.v2}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="export-card">
          <h2>📋 Full Parameter Comparison (13-Week Horizon)</h2>
          <table className="data-table">
            <thead><tr><th>#</th><th>Parameter</th><th>A1 (Baseline)</th><th>A2 (Optimistic)</th><th>Δ (A2-A1)</th></tr></thead>
            <tbody>
              {rows.map((r) => {
                const color = r.delta > 0 ? 'var(--green)' : r.delta < 0 ? 'var(--red)' : 'var(--text-muted)'
                return (
                  <tr key={r.n}>
                    <td>{r.n}</td><td>{r.label}</td><td>{r.v1}</td><td>{r.v2}</td>
                    <td style={{ color, fontWeight: 600 }}>{r.delta >= 0 ? '+' : ''}{r.delta.toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="export-card">
          <h2>📤 Export Options</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>Download current scenario data or generate a printable report.</p>
          <button className="export-btn csv" onClick={exportCSV}>📥 Export to CSV</button>
          <button className="export-btn pdf" onClick={() => window.print()}>🖨 Export to PDF</button>
        </div>
      </div>
    </div>
  )
}
