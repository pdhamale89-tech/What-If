import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'

const WEEK_OPTIONS = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`)

export default function FilterPanel() {
  const { state, dispatch, subRegionOptions, countryOptions, activeFilterCount, showToast } = useDashboard()
  const f = state.filters

  const setFilter = (id, value) => {
    dispatch({ type: 'SET_FILTER', id, value })
    showToast(`🔍 Filters applied (${activeFilterCount + (value ? 1 : -1) >= 0 ? activeFilterCount + (value ? 1 : -1) : 0} active) — Dashboard recalculated`)
  }

  const clearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' })
    showToast('✕ All filters cleared — Dashboard reset')
  }

  const activeTags = Object.entries({
    fiscalyear: 'Fiscal Year', fiscalquarter: 'Fiscal Quarter', fiscalweek: 'Fiscal Week',
    region: 'Region', subregion: 'Sub Region', country: 'Country',
    channel: 'Channel', offering: 'Offering', queue: 'Queue',
  }).filter(([id]) => f[id])

  return (
    <div className="filter-panel">
      <div className="filter-panel-title">🔍 Filters</div>

      <div className="filter-group">
        <label>Fiscal Year</label>
        <select value={f.fiscalyear} onChange={(e) => setFilter('fiscalyear', e.target.value)}>
          <option value="">All Fiscal Years</option>
          <option>FY24</option><option>FY25</option><option>FY26</option><option>FY27</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Fiscal Quarter</label>
        <select value={f.fiscalquarter} onChange={(e) => setFilter('fiscalquarter', e.target.value)}>
          <option value="">All Quarters</option>
          <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
        </select>
      </div>
      {state.viewMode === 'weekly' && (
        <div className="filter-group">
          <label>Fiscal Week</label>
          <select value={f.fiscalweek} onChange={(e) => setFilter('fiscalweek', e.target.value)}>
            <option value="">All Weeks</option>
            {WEEK_OPTIONS.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
      )}

      <div className="filter-divider" />

      <div className="filter-group">
        <label>Region</label>
        <select value={f.region} onChange={(e) => setFilter('region', e.target.value)}>
          <option value="">All Regions</option>
          <option>Americas</option><option>EMEA</option><option>APJ</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Sub Region</label>
        <select value={f.subregion} onChange={(e) => setFilter('subregion', e.target.value)}>
          <option value="">All Sub Regions</option>
          {subRegionOptions.map((sr) => <option key={sr}>{sr}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label>Country</label>
        <select value={f.country} onChange={(e) => setFilter('country', e.target.value)}>
          <option value="">All Countries</option>
          {countryOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-divider" />

      <div className="filter-group">
        <label>Channel</label>
        <select value={f.channel} onChange={(e) => setFilter('channel', e.target.value)}>
          <option value="">All Channels</option>
          <option>Voice</option><option>Chat</option><option>Email</option><option>Social Media</option><option>Self-Service</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Offering</label>
        <select value={f.offering} onChange={(e) => setFilter('offering', e.target.value)}>
          <option value="">All Offerings</option>
          <option>ProSupport</option><option>ProSupport Plus</option><option>Basic Support</option><option>Premium Support</option><option>Managed Services</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Combined Queue Name</label>
        <select value={f.queue} onChange={(e) => setFilter('queue', e.target.value)}>
          <option value="">All Queues</option>
          <option>Enterprise_T1_Voice</option><option>Enterprise_T2_Voice</option><option>SMB_T1_Chat</option>
          <option>SMB_T2_Voice</option><option>Consumer_T1_Voice</option><option>Consumer_T1_Chat</option>
          <option>Premium_Escalation</option><option>Managed_Svc_Queue</option>
        </select>
      </div>

      <div className="filter-divider" />

      <button className="filter-reset-btn" onClick={clearFilters}>✕ Clear Filters</button>
      <div className="filter-active-tags">
        {activeTags.map(([id, label]) => (
          <span className="filter-tag" key={id}>
            {label}: {f[id]}
            <span className="tag-remove" onClick={() => setFilter(id, '')}>✕</span>
          </span>
        ))}
      </div>
    </div>
  )
}
