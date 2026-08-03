import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { useDashboard } from '../context/DashboardContext.jsx'
import { HEADCOUNT_BAR_STAGES, HEADCOUNT_TREND_METRICS } from '../lib/constants'
import { aggVals, fmt, chartColors, hexToRgba } from '../lib/calc'
import { endsOnly } from '../lib/chartSetup'

const VIEW_SUFFIX = { weekly: '(Weekly)', quarterly: '(Quarterly)', monthly: '(Monthly)' }

export default function HeadcountChart() {
  const { state, dispatch, periods } = useDashboard()
  const { weeklyData, viewMode, headcountTrendKeys, theme } = state
  const c = chartColors(theme)

  const onSelectChange = (e) => {
    const keys = Array.from(e.target.selectedOptions).map((o) => o.value)
    dispatch({ type: 'SET_HEADCOUNT_TREND_KEYS', keys })
  }

  const { data, options } = useMemo(() => {
    const labels = periods.map((p) => p.label)

    const barDatasets = []
    HEADCOUNT_BAR_STAGES.forEach((s) => {
      const a1D = periods.map((p) => aggVals(weeklyData[s.key].a1, p.idx, s.agg, s.dec))
      const a2D = periods.map((p) => aggVals(weeklyData[s.key].a2, p.idx, s.agg, s.dec))
      const col = c[s.color]
      barDatasets.push({ type: 'bar', label: `${s.label} (A1)`, data: a1D, backgroundColor: col, stack: 'A1', yAxisID: 'y', order: 2, datalabels: { display: (v) => v.dataset.data[v.dataIndex] > 0, color: '#fff', anchor: 'center', align: 'center', font: { size: 9, weight: 'bold' }, formatter: (v) => fmt(v) } })
      barDatasets.push({ type: 'bar', label: `${s.label} (A2)`, data: a2D, backgroundColor: hexToRgba(col, 0.55), stack: 'A2', yAxisID: 'y', order: 2, datalabels: { display: (v) => v.dataset.data[v.dataIndex] > 0, color: '#fff', anchor: 'center', align: 'center', font: { size: 9, weight: 'bold' }, formatter: (v) => fmt(v) } })
    })

    const lineDatasets = []
    headcountTrendKeys.forEach((key) => {
      const m = HEADCOUNT_TREND_METRICS.find((x) => x.key === key)
      if (!m) return
      const a1D = periods.map((p) => aggVals(weeklyData[m.key].a1, p.idx, m.agg, m.dec))
      const a2D = periods.map((p) => aggVals(weeklyData[m.key].a2, p.idx, m.agg, m.dec))
      const col1 = c[m.color1], col2 = c[m.color2]
      lineDatasets.push({ type: 'line', label: `${m.label} (A1)`, data: a1D, borderColor: col1, backgroundColor: 'transparent', yAxisID: m.axis, tension: 0.35, borderWidth: 2, pointRadius: 3, pointBackgroundColor: col1, order: 1, datalabels: { display: endsOnly, color: col1, anchor: 'end', align: 'top', font: { size: 9, weight: 'bold' }, formatter: (v) => v + (m.suffix || '') } })
      lineDatasets.push({ type: 'line', label: `${m.label} (A2)`, data: a2D, borderColor: col2, backgroundColor: 'transparent', yAxisID: m.axis, tension: 0.35, borderWidth: 2, borderDash: [5, 5], pointRadius: 3, pointBackgroundColor: col2, order: 1, datalabels: { display: endsOnly, color: col2, anchor: 'end', align: 'bottom', font: { size: 9, weight: 'bold' }, formatter: (v) => v + (m.suffix || '') } })
    })

    return {
      data: { labels, datasets: [...barDatasets, ...lineDatasets] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', align: 'center', labels: { color: c.text, font: { size: 9 }, boxWidth: 14 } },
          tooltip: { mode: 'index', intersect: false },
          datalabels: { display: false },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } },
          y: { stacked: true, position: 'left', grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } },
          y1: { position: 'right', grid: { display: false }, ticks: { color: c.text, font: { size: 10 }, callback: (v) => v + '%' } },
        },
      },
    }
  }, [weeklyData, periods, headcountTrendKeys, theme])

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">HEADCOUNT DETAILS {VIEW_SUFFIX[viewMode]}</h3>
        <div className="chart-card-controls">
          <select className="chart-select chart-select-multi" multiple size={4} value={headcountTrendKeys} onChange={onSelectChange}>
            {HEADCOUNT_TREND_METRICS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          <div className="chart-info-btn">i
            <div className="chart-info-tooltip">
              <div className="tip-title">💡 About This Chart</div>
              Actual HC, Movement In and Movement Out always show as a stacked bar per period, from the Parameter View.
              <ul>
                <li><b>Stacked bars (left axis)</b> = Actual HC (teal) + Movement In (amber) + Movement Out (purple)</li>
                <li>One stack per scenario — A1 solid colors, A2 lighter shades, side by side</li>
                <li><b>Hiring, Training, OJT (left axis)</b> = whole-number trend lines, same axis as the bars</li>
                <li><b>Attrition% (right axis)</b> = percentage trend line</li>
                <li>Ctrl/Cmd-click to select multiple from the list; each selection adds its own A1/A2 trend line</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-canvas-wrap" style={{ height: 400 }}>
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  )
}
