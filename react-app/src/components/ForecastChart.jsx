import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useDashboard } from '../context/DashboardContext.jsx'
import { aggVals, fmt, chartColors } from '../lib/calc'
import { endsOnly } from '../lib/chartSetup'
import { DDSCard, DDSTabs, DDSTab, DDSTooltip, DDSIconButton } from '../components/dds'

const VIEW_SUFFIX = { weekly: '(Weekly)', quarterly: '(Quarterly)', monthly: '(Monthly)' }

export default function ForecastChart() {
  const { state, dispatch, periods } = useDashboard()
  const { weeklyData, viewMode, forecastMetric, theme } = state
  const c = chartColors(theme)

  const setForecastMetric = (metric) => dispatch({ type: 'SET_FORECAST_METRIC', metric })

  const { data, options } = useMemo(() => {
    const labels = periods.map((p) => p.label)
    const vol1D = periods.map((p) => aggVals(weeklyData.handled.a1, p.idx, 'sum', 0))
    const vol2D = periods.map((p) => aggVals(weeklyData.handled.a2, p.idx, 'sum', 0))

    let metric1D, metric2D, metricLabel, metricMin, metricMax, color1, color2
    if (forecastMetric === 'fcmod') {
      metric1D = periods.map((p) => aggVals(weeklyData.fcmod.a1, p.idx, 'avg', 1))
      metric2D = periods.map((p) => aggVals(weeklyData.fcmod.a2, p.idx, 'avg', 1))
      metricLabel = 'Forecast Mod %'; color1 = c.purple; color2 = c.pink; metricMin = -20; metricMax = 20
    } else {
      metric1D = periods.map((p) => aggVals(weeklyData.ar.a1, p.idx, 'avg', 1))
      metric2D = periods.map((p) => aggVals(weeklyData.ar.a2, p.idx, 'avg', 1))
      metricLabel = 'AR%'; color1 = c.amber; color2 = c.orange; metricMin = 0; metricMax = 100
    }

    return {
      data: {
        labels,
        datasets: [
          { type: 'bar', label: 'A1 Volume', data: vol1D, backgroundColor: c.blue, yAxisID: 'y', order: 2, datalabels: { display: endsOnly, color: c.blue, anchor: 'end', align: 'top', font: { size: 10, weight: 'bold' }, formatter: (v) => fmt(v) } },
          { type: 'bar', label: 'A2 Volume', data: vol2D, backgroundColor: c.teal, yAxisID: 'y', order: 2, datalabels: { display: endsOnly, color: c.teal, anchor: 'end', align: 'top', font: { size: 10, weight: 'bold' }, formatter: (v) => fmt(v) } },
          { type: 'line', label: `A1 ${metricLabel}`, data: metric1D, borderColor: color1, backgroundColor: 'transparent', yAxisID: 'y1', tension: 0.35, borderWidth: 2, pointRadius: 3, pointBackgroundColor: color1, order: 1, datalabels: { display: false } },
          { type: 'line', label: `A2 ${metricLabel}`, data: metric2D, borderColor: color2, backgroundColor: 'transparent', yAxisID: 'y1', tension: 0.35, borderWidth: 2, borderDash: [5, 5], pointRadius: 3, pointBackgroundColor: color2, order: 1, datalabels: { display: false } },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', align: 'center', labels: { color: c.text, font: { size: 9 }, boxWidth: 20 } },
          tooltip: { mode: 'index', intersect: false },
          datalabels: { display: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text, font: { size: 9 } } },
          y: { position: 'left', grid: { display: false }, ticks: { color: c.text, font: { size: 9 }, callback: (v) => (v / 1000).toFixed(0) + 'K' } },
          y1: { position: 'right', min: metricMin, max: metricMax, grid: { display: false }, ticks: { color: c.text, font: { size: 9 }, callback: (v) => v + '%' } },
        },
      },
    }
  }, [weeklyData, periods, forecastMetric, theme])

  return (
    <DDSCard className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">FORECAST COMPARISON {VIEW_SUFFIX[viewMode]}</h3>
        <div className="chart-card-controls">
          <DDSTabs size="small" value={forecastMetric} onChange={setForecastMetric}>
            <DDSTab value="ar">AR%</DDSTab>
            <DDSTab value="fcmod">Fcst Mod%</DDSTab>
          </DDSTabs>
          <DDSTooltip
            placement="bottom-end"
            content={
              <>
                <div className="tip-title">💡 About This Chart</div>
                A1 vs A2 handled volume trend per period, with a trend line on the right axis.
                <ul>
                  <li><b>Blue line</b> = A1 volume</li>
                  <li><b>Dashed teal line</b> = A2 volume</li>
                  <li>Use the toggle to switch the right-axis line between <b>AR%</b> and <b>Forecast Mod %</b></li>
                </ul>
              </>
            }
          >
            <DDSIconButton size="small"><InfoOutlinedIcon fontSize="small" /></DDSIconButton>
          </DDSTooltip>
        </div>
      </div>
      <div className="chart-canvas-wrap" style={{ height: 400 }}>
        <Chart type="bar" data={data} options={options} />
      </div>
    </DDSCard>
  )
}
