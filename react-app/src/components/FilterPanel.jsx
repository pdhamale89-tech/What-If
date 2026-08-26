import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useDashboard } from '../context/DashboardContext.jsx'
import { DDSFilter, DDSFormField, DDSLabel, DDSDropdown, DDSOption, DDSButton, DDSTag, DDSDivider } from '../components/dds'

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
    <DDSFilter className="filter-panel">
      <Typography className="filter-panel-title">🔍 Filters</Typography>

      <DDSFormField className="filter-group">
        <DDSLabel>Fiscal Quarter</DDSLabel>
        <DDSDropdown value={f.fiscalquarter} onChange={(v) => setFilter('fiscalquarter', v)} displayEmpty>
          <DDSOption value="">All Quarters</DDSOption>
          {FISCAL_QUARTER_OPTIONS.map((fq) => <DDSOption key={fq} value={fq}>{fq}</DDSOption>)}
        </DDSDropdown>
      </DDSFormField>

      <DDSDivider className="filter-divider" />

      <DDSFormField className="filter-group">
        <DDSLabel>Region</DDSLabel>
        <DDSDropdown value={f.region} onChange={(v) => setFilter('region', v)} displayEmpty>
          <DDSOption value="">All Regions</DDSOption>
          <DDSOption value="Americas">Americas</DDSOption>
          <DDSOption value="EMEA">EMEA</DDSOption>
          <DDSOption value="APJ">APJ</DDSOption>
        </DDSDropdown>
      </DDSFormField>
      <DDSFormField className="filter-group">
        <DDSLabel>Sub Region</DDSLabel>
        <DDSDropdown value={f.subregion} onChange={(v) => setFilter('subregion', v)} displayEmpty>
          <DDSOption value="">All Sub Regions</DDSOption>
          {subRegionOptions.map((sr) => <DDSOption key={sr} value={sr}>{sr}</DDSOption>)}
        </DDSDropdown>
      </DDSFormField>
      <DDSFormField className="filter-group">
        <DDSLabel>Country</DDSLabel>
        <DDSDropdown value={f.country} onChange={(v) => setFilter('country', v)} displayEmpty>
          <DDSOption value="">All Countries</DDSOption>
          {countryOptions.map((c) => <DDSOption key={c} value={c}>{c}</DDSOption>)}
        </DDSDropdown>
      </DDSFormField>

      <DDSDivider className="filter-divider" />

      <DDSFormField className="filter-group">
        <DDSLabel>Channel</DDSLabel>
        <DDSDropdown value={f.channel} onChange={(v) => setFilter('channel', v)} displayEmpty>
          <DDSOption value="">All Channels</DDSOption>
          <DDSOption value="Voice">Voice</DDSOption>
          <DDSOption value="Chat">Chat</DDSOption>
          <DDSOption value="Email">Email</DDSOption>
          <DDSOption value="Social Media">Social Media</DDSOption>
          <DDSOption value="Self-Service">Self-Service</DDSOption>
        </DDSDropdown>
      </DDSFormField>
      <DDSFormField className="filter-group">
        <DDSLabel>Offering</DDSLabel>
        <DDSDropdown value={f.offering} onChange={(v) => setFilter('offering', v)} displayEmpty>
          <DDSOption value="">All Offerings</DDSOption>
          <DDSOption value="ProSupport">ProSupport</DDSOption>
          <DDSOption value="ProSupport Plus">ProSupport Plus</DDSOption>
          <DDSOption value="Basic Support">Basic Support</DDSOption>
          <DDSOption value="Premium Support">Premium Support</DDSOption>
          <DDSOption value="Managed Services">Managed Services</DDSOption>
        </DDSDropdown>
      </DDSFormField>
      <DDSFormField className="filter-group">
        <DDSLabel>Combined Queue Name</DDSLabel>
        <DDSDropdown value={f.queue} onChange={(v) => setFilter('queue', v)} displayEmpty>
          <DDSOption value="">All Queues</DDSOption>
          <DDSOption value="Enterprise_T1_Voice">Enterprise_T1_Voice</DDSOption>
          <DDSOption value="Enterprise_T2_Voice">Enterprise_T2_Voice</DDSOption>
          <DDSOption value="SMB_T1_Chat">SMB_T1_Chat</DDSOption>
          <DDSOption value="SMB_T2_Voice">SMB_T2_Voice</DDSOption>
          <DDSOption value="Consumer_T1_Voice">Consumer_T1_Voice</DDSOption>
          <DDSOption value="Consumer_T1_Chat">Consumer_T1_Chat</DDSOption>
          <DDSOption value="Premium_Escalation">Premium_Escalation</DDSOption>
          <DDSOption value="Managed_Svc_Queue">Managed_Svc_Queue</DDSOption>
        </DDSDropdown>
      </DDSFormField>

      <DDSDivider className="filter-divider" />

      <DDSButton status="danger" variant="outlined" fullWidth onClick={clearFilters}>✕ Clear Filters</DDSButton>
      <Box className="filter-active-tags">
        {activeTags.map(([id, label]) => (
          <DDSTag key={id} onRemove={() => setFilter(id, '')}>{label}: {f[id]}</DDSTag>
        ))}
      </Box>
    </DDSFilter>
  )
}
