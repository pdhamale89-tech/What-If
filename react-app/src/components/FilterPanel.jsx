import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'

const FISCAL_QUARTER_OPTIONS = ['FY24', 'FY25', 'FY26', 'FY27'].flatMap((fy) =>
  ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => `${fy}${q}`)
)

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
    fiscalquarter: 'Fiscal Quarter',
    region: 'Region', subregion: 'Sub Region', country: 'Country',
    channel: 'Channel', offering: 'Offering', queue: 'Queue',
  }).filter(([id]) => f[id])

  return (
    <div className="filter-panel">
      <div className="filter-panel-title">🔍 Filters</div>

      <div className="filter-group">
        <label>Fiscal Quarter</label>
        <select value={f.fiscalquarter} onChange={(e) => setFilter('fiscalquarter', e.target.value)}>
          <option value="">All Quarters</option>
          {FISCAL_QUARTER_OPTIONS.map((fq) => <option key={fq}>{fq}</option>)}
        </select>
      </div>

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
