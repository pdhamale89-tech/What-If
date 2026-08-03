import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { useDashboard } from '../context/DashboardContext.jsx'
import { QUEUE_SL_BASE } from '../lib/constants'
import { aggVals, fmt, chartColors } from '../lib/calc'
import { endsOnly } from '../lib/chartSetup'

const VIEW_SUFFIX = { weekly: '(Weekly)', quarterly: '(Quarterly)', monthly: '(Monthly)' }

function computeQueueDetailForPeriod(idx, hcPlanSl, hcPlanActual) {
  const periodSl = hcPlanSl[idx]
  const avgSl = hcPlanSl.reduce((a, b) => a + b, 0) / hcPlanSl.length
  const slDiff = periodSl - avgSl
  const periodActual = hcPlanActual[idx]
  const avgActual = hcPlanActual.reduce((a, b) => a + b, 0) / hcPlanActual.length
  const hcRatio = avgActual ? periodActual / avgActual : 1
  return QUEUE_SL_BASE.map((q) => {
    const sl = Math.max(45, Math.min(95, +(q.sl + slDiff).toFixed(1)))
    const plan = Math.max(1, Math.round(q.plan * hcRatio))
    const hc = Math.max(1, Math.round(q.hc * hcRatio))
    return { name: q.name, sl, hc, plan, delta: hc - plan }
  }).sort((a, b) => a.sl - b.sl)
}

export default function HcPlanChart() {
  const { state, dispatch, periods, derived } = useDashboard()
  const { weeklyData, viewMode, hcPlanSelectedIdx, theme } = state
  const c = chartColors(theme)

  const { hcPlanLabels, hcPlanActual, hcPlanPlanArr, hcPlanSl } = useMemo(() => {
    return {
      hcPlanLabels: periods.map((p) => p.label),
      hcPlanActual: periods.map((p) => aggVals(weeklyData.hc.a1, p.idx, 'last', 0)),
      hcPlanPlanArr: periods.map((p) => aggVals(weeklyData.hc.a2, p.idx, 'last', 0)),
      hcPlanSl: periods.map((p) => aggVals(derived.sl.a1, p.idx, 'avg', 1)),
    }
  }, [weeklyData, derived, periods])

  const { data, options } = useMemo(() => ({
    data: {
      labels: hcPlanLabels,
      datasets: [
        { type: 'line', label: 'Actual', data: hcPlanActual, borderColor: c.blue, backgroundColor: 'transparent', yAxisID: 'y', tension: 0.35, borderWidth: 2, pointRadius: 3, pointBackgroundColor: c.blue, order: 2, datalabels: { display: endsOnly, color: c.blue, anchor: 'end', align: 'top', font: { size: 10, weight: 'bold' }, formatter: (v) => fmt(v) } },
        { type: 'line', label: 'Plan', data: hcPlanPlanArr, borderColor: c.orange, backgroundColor: 'transparent', yAxisID: 'y', tension: 0.35, borderWidth: 2, borderDash: [5, 5], pointRadius: 3, pointBackgroundColor: c.orange, order: 2, datalabels: { display: endsOnly, color: c.orange, anchor: 'end', align: 'bottom', font: { size: 10, weight: 'bold' }, formatter: (v) => fmt(v) } },
        { type: 'line', label: 'SL %', data: hcPlanSl, borderColor: c.purple, backgroundColor: 'transparent', yAxisID: 'y1', tension: 0.35, borderWidth: 2, pointRadius: 4, pointBackgroundColor: c.purple, order: 1, datalabels: { display: true, color: c.purple, align: 'top', anchor: 'end', font: { size: 9, weight: 'bold' }, formatter: (v) => v.toFixed(1) + '%' } },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (evt, elements, chart) => {
        const pts = chart.getElementsAtEventForMode(evt, 'index', { intersect: false }, true)
        if (pts.length) dispatch({ type: 'SET_HC_PLAN_SELECTED', idx: pts[0].index })
      },
      onHover: (evt, elements) => {
        if (evt.native && evt.native.target) evt.native.target.style.cursor = elements.length ? 'pointer' : 'default'
      },
      plugins: {
        legend: { position: 'bottom', align: 'center', labels: { color: c.text, font: { size: 9 }, boxWidth: 20 } },
        datalabels: { display: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } },
        y: { position: 'left', min: 0, grid: { display: false }, ticks: { color: c.text, font: { size: 9 }, callback: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v) } },
        y1: { position: 'right', min: 0, max: 100, grid: { display: false }, ticks: { color: c.text, font: { size: 9 }, callback: (v) => v + '%' } },
      },
    },
  }), [hcPlanLabels, hcPlanActual, hcPlanPlanArr, hcPlanSl, theme, dispatch])

  const idx = hcPlanSelectedIdx
  const hasSelection = idx !== null && idx !== undefined && hcPlanLabels[idx] !== undefined

  let caption = '👆 Click a bar above to see queue-level SL detail for that period'
  let queues = [], below90 = [], insight = '', action = ''
  if (hasSelection) {
    const label = hcPlanLabels[idx]
    const actual = hcPlanActual[idx], plan = hcPlanPlanArr[idx], sl = hcPlanSl[idx]
    const delta = actual - plan
    queues = computeQueueDetailForPeriod(idx, hcPlanSl, hcPlanActual)
    below90 = queues.filter((q) => q.sl < 90)
    caption = `${label} — HC ${fmt(actual)} vs plan ${fmt(plan)} (${delta >= 0 ? '+' : ''}${delta}) · Overall SL ${sl.toFixed(1)}%`

    if (below90.length === 0) {
      insight = `All tracked queues are meeting the 90% SL target in ${label}.`
      action = `No immediate staffing action needed for ${label} — continue monitoring.`
    } else {
      const worst = below90[0]
      const overstaffedCount = below90.filter((q) => q.delta > 0).length
      insight = `${below90.length} of ${queues.length} tracked queues are below the 90% SL target in ${label}, led by ${worst.name} at ${worst.sl.toFixed(1)}%. ${overstaffedCount} of those ${overstaffedCount === 1 ? 'is' : 'are'} already at or above planned headcount, suggesting the shortfall is driven more by skill-mix, scheduling, or handle time than raw staffing.`
      action = overstaffedCount >= Math.ceil(below90.length / 2)
        ? `Recommend a scheduling/skill-mix review for the bottom queues before adding headcount — most are already at or above plan.`
        : `Recommend prioritizing hiring/reallocation toward ${worst.name} and other understaffed queues to close the SL gap fastest.`
    }
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Headcount Impact on SL {VIEW_SUFFIX[viewMode]}</h3>
        <div className="chart-card-controls">
          <div className="chart-info-btn">i
            <div className="chart-info-tooltip">
              <div className="tip-title">💡 About This Chart</div>
              Actual (A1) vs Plan (A2) headcount per period, from the Parameter View, with SL% trend on the right axis.
              <ul>
                <li><b>Blue line</b> = Actual HC</li>
                <li><b>Dashed orange line</b> = Plan HC</li>
                <li><b>Purple line</b> = SL %</li>
                <li>Click anywhere on the chart to drill into queue-level SL detail, insights and recommended action for that period</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-canvas-wrap" style={{ height: 300 }}>
        <Chart type="line" data={data} options={options} />
      </div>
      <div className="queue-sl-caption">
        {caption}
        {hasSelection && (
          <span className="queue-sl-reset" onClick={() => dispatch({ type: 'SET_HC_PLAN_SELECTED', idx: null })}> ✕ Clear</span>
        )}
      </div>
      <div className="queue-sl-list">
        {hasSelection && (
          below90.length
            ? below90.map((q) => (
              <div className="queue-sl-row" key={q.name}>
                <span className="queue-sl-name">{q.name}</span>
                <span className="queue-sl-metrics"><b>SL {q.sl.toFixed(1)}%</b> · HC {q.hc} vs plan {q.plan} ({q.delta >= 0 ? '+' : ''}{q.delta})</span>
              </div>
            ))
            : <div className="queue-sl-row"><span className="queue-sl-name">No queues below 90% SL for {hcPlanLabels[idx]}.</span></div>
        )}
      </div>
      <div className="queue-sl-insight">
        {hasSelection && (
          <>
            <div><span className="action-label">💡 Insight:</span> {insight}</div>
            <div style={{ marginTop: 6 }}><span className="action-label">✅ Recommended Action:</span> {action}</div>
          </>
        )}
      </div>
    </div>
  )
}
