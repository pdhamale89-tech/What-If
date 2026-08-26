import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import { aggVals, chartColors } from '../lib/calc'
import { DDSCard } from '../components/dds'

export default function TrendCard({ r, weeklyData, derived, periods, theme }) {
  const c = chartColors(theme)

  const { data, options } = useMemo(() => {
    const labels = periods.map((p) => p.label)
    const src = r.derived ? derived[r.key] : weeklyData[r.key]
    const a1D = periods.map((p) => aggVals(src.a1, p.idx, r.agg, r.dec))
    const a2D = periods.map((p) => aggVals(src.a2, p.idx, r.agg, r.dec))
    const dec = r.dec || 0
    const deltaD = a1D.map((v, i) => +(a2D[i] - v).toFixed(dec))
    const fmtTrend = (v) => v + (r.suffix || '')
    const fmtDelta = (v) => (v >= 0 ? '+' : '') + v + (r.suffix || '')

    return {
      data: {
        labels,
        datasets: [
          { type: 'bar', label: 'A1', data: a1D, backgroundColor: c.blue, yAxisID: 'y', order: 2, datalabels: { display: true, color: c.text, anchor: 'end', align: 'top', font: { size: 10, weight: 'bold' }, formatter: fmtTrend } },
          { type: 'bar', label: 'A2', data: a2D, backgroundColor: c.teal, yAxisID: 'y', order: 2, datalabels: { display: true, color: c.text, anchor: 'end', align: 'top', font: { size: 10, weight: 'bold' }, formatter: fmtTrend } },
          { type: 'line', label: 'Δ (A2-A1)', data: deltaD, borderColor: c.purple, backgroundColor: 'transparent', tension: 0.35, borderWidth: 2, borderDash: [3, 3], pointRadius: 3, pointBackgroundColor: c.purple, yAxisID: 'y1', order: 1, datalabels: { display: true, color: c.purple, align: 'top', font: { size: 10, weight: 'bold' }, formatter: fmtDelta } },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', align: 'center', labels: { color: c.text, font: { size: 11 }, boxWidth: 20 } },
          datalabels: { display: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text, font: { size: 12 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 8 } },
          y: { position: 'left', grid: { display: false }, ticks: { color: c.text, font: { size: 12 } } },
          y1: { position: 'right', grid: { display: false }, ticks: { color: c.text, font: { size: 11 } } },
        },
      },
    }
  }, [r, weeklyData, derived, periods, theme])

  return (
    <DDSCard className="trend-card">
      <h4>{r.label}</h4>
      <div className="trend-canvas-wrap">
        <Chart type="bar" data={data} options={options} />
      </div>
    </DDSCard>
  )
}
