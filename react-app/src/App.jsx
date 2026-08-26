import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useDashboard } from './context/DashboardContext.jsx'
import { createDdsTheme } from './theme/ddsTheme'
import { SidebarLayout } from './layouts/PageLayouts.jsx'
import { DDSLoadingIndicator } from './components/dds'
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
  const theme = useMemo(() => createDdsTheme(state.theme), [state.theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="skeleton-overlay" className={loaded ? 'hidden' : ''}>
        <DDSLoadingIndicator size="large" label="Loading Workspace..." />
      </div>

      <Header />

      <div style={{ marginTop: 50, height: 'calc(100vh - 50px)', display: 'flex' }}>
        <SidebarLayout sidebar={<FilterPanel />}>
          <TabBar />
          {state.activeTab === 'simulation' && <SimulationTab />}
          {state.activeTab === 'trends' && <ParameterTrendsTab />}
          {state.activeTab === 'export' && <ExportTab />}
        </SidebarLayout>
      </div>

      <ToastContainer />
    </ThemeProvider>
  )
}
