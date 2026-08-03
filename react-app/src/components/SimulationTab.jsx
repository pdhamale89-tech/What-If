import React from 'react'
import KpiRow from './KpiRow.jsx'
import ParameterTable from './ParameterTable.jsx'
import ForecastChart from './ForecastChart.jsx'
import HeadcountChart from './HeadcountChart.jsx'
import HcPlanChart from './HcPlanChart.jsx'
import RightPanel from './RightPanel.jsx'

export default function SimulationTab() {
  return (
    <div className="tab-content active" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="center-panel">
        <KpiRow />
        <ParameterTable />
        <div className="section-title">⚙ Analytics</div>
        <ForecastChart />
        <HeadcountChart />
        <HcPlanChart />
      </div>
      <RightPanel />
    </div>
  )
}
