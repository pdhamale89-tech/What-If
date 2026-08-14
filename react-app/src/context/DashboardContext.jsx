import React, { createContext, useContext, useReducer, useMemo, useRef, useCallback } from 'react'
import { buildInitialWeeklyData, computeDerivedWeekly, getPeriods } from '../lib/calc'
import { filterData, filterMultipliers } from '../lib/constants'

const DashboardContext = createContext(null)

const initialFilters = {
  fiscalquarter: '',
  region: '', subregion: '', country: '',
  channel: '', offering: '', queue: '',
}

function computeMultiplier(filters) {
  const rm = filterMultipliers.region[filters.region] || 1
  const cm = filterMultipliers.channel[filters.channel] || 1
  const om = filterMultipliers.offering[filters.offering] || 1
  const qm = filterMultipliers.queue[filters.queue] || 1
  return rm * cm * om * qm
}

const initialState = {
  theme: 'dark',
  viewMode: 'weekly',
  activeTab: 'simulation',
  weeklyData: buildInitialWeeklyData(),
  filters: initialFilters,
  collapsedGroups: {},
  collapsedTrendGroups: {},
  forecastMetric: 'ar',
  headcountTrendKeys: ['attrition'],
  rightPanelCollapsed: false,
  notesText: 'Optimistic scenario with forecast reduction, improved AHT and absenteeism, lower attrition and hiring.',
  savedNotes: [],
  toasts: [],
  hcPlanSelectedIdx: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode, hcPlanSelectedIdx: null }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab }
    case 'SET_FILTER': {
      const filters = { ...state.filters, [action.id]: action.value }
      if (action.id === 'region') { filters.subregion = ''; filters.country = '' }
      if (action.id === 'subregion') { filters.country = '' }
      const mult = computeMultiplier(filters)
      return { ...state, filters, weeklyData: buildInitialWeeklyData(mult) }
    }
    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters, weeklyData: buildInitialWeeklyData(1) }
    case 'TOGGLE_GROUP': {
      const collapsedGroups = { ...state.collapsedGroups, [action.key]: !state.collapsedGroups[action.key] }
      return { ...state, collapsedGroups }
    }
    case 'TOGGLE_TREND_GROUP': {
      const collapsedTrendGroups = { ...state.collapsedTrendGroups, [action.key]: !state.collapsedTrendGroups[action.key] }
      return { ...state, collapsedTrendGroups }
    }
    case 'SET_FORECAST_METRIC':
      return { ...state, forecastMetric: action.metric }
    case 'SET_HEADCOUNT_TREND_KEYS':
      return { ...state, headcountTrendKeys: action.keys.length ? action.keys : ['attrition'] }
    case 'TOGGLE_RIGHT_PANEL':
      return { ...state, rightPanelCollapsed: !state.rightPanelCollapsed }
    case 'SET_NOTES_TEXT':
      return { ...state, notesText: action.text }
    case 'SAVE_NOTE': {
      if (!state.notesText.trim()) return state
      const now = new Date()
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }
      const entry = { text: state.notesText.trim(), date: now.toLocaleDateString('en-US', options), user: 'Siddharth J.' }
      return { ...state, savedNotes: [entry, ...state.savedNotes], notesText: '' }
    }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: action.id, msg: action.msg }] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    case 'SET_HC_PLAN_SELECTED':
      return { ...state, hcPlanSelectedIdx: action.idx }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const toastId = useRef(0)

  const showToast = useCallback((msg) => {
    const id = ++toastId.current
    dispatch({ type: 'ADD_TOAST', id, msg })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3000)
  }, [])

  const fiscalYear = state.filters.fiscalquarter.slice(0, 4) || 'FY26'
  const periods = useMemo(() => getPeriods(state.viewMode, fiscalYear), [state.viewMode, fiscalYear])
  const derived = useMemo(() => computeDerivedWeekly(state.weeklyData), [state.weeklyData])

  const subRegionOptions = state.filters.region ? Object.keys(filterData[state.filters.region]?.subRegions || {}) : []
  const countryOptions = (() => {
    const region = state.filters.region
    const subregion = state.filters.subregion
    if (!region || !filterData[region]) return []
    if (subregion && filterData[region].subRegions[subregion]) return filterData[region].subRegions[subregion].countries
    return Object.values(filterData[region].subRegions).flatMap((sr) => sr.countries)
  })()

  const activeFilterCount = Object.values(state.filters).filter(Boolean).length

  const value = {
    state,
    dispatch,
    showToast,
    periods,
    derived,
    fiscalYear,
    subRegionOptions,
    countryOptions,
    activeFilterCount,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
