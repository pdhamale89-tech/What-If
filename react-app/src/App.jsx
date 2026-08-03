import React, { useEffect, useState } from 'react'
import { useDashboard } from './context/DashboardContext.jsx'
import Header from './components/Header.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import TabBar from './components/TabBar.jsx'
import SimulationTab from './components/SimulationTab.jsx'
import ParameterTrendsTab from './components/ParameterTrendsTab.jsx'
import ExportTab from './components/ExportTab.jsx'
import ToastContainer from './components/ToastContainer.jsx'

export default function App() {
  const { state } = useDashboard()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div id="skeleton-overlay" className={loaded ? 'hidden' : ''}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>⚙ Loading Workspace...</div>
        <div className="skeleton-bar" /><div className="skeleton-bar" /><div className="skeleton-bar" />
      </div>

      <Header />

      <div style={{ marginTop: 50, height: 'calc(100vh - 50px)', display: 'flex' }}>
        <FilterPanel />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar />
          {state.activeTab === 'simulation' && <SimulationTab />}
          {state.activeTab === 'trends' && <ParameterTrendsTab />}
          {state.activeTab === 'export' && <ExportTab />}
        </div>
      </div>

      <ToastContainer />
    </>
  )
}
