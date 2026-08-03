export const WEEKS = 13

export const filterData = {
  Americas: {
    subRegions: {
      'North America': { countries: ['United States', 'Canada', 'Mexico'] },
      'Latin America': { countries: ['Brazil', 'Argentina', 'Colombia', 'Chile'] },
      Caribbean: { countries: ['Jamaica', 'Trinidad & Tobago', 'Bahamas'] },
    },
  },
  EMEA: {
    subRegions: {
      'Western Europe': { countries: ['United Kingdom', 'Germany', 'France', 'Netherlands'] },
      'Eastern Europe': { countries: ['Poland', 'Czech Republic', 'Romania', 'Hungary'] },
      'Middle East': { countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Israel'] },
      Africa: { countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt'] },
    },
  },
  APJ: {
    subRegions: {
      'South Asia': { countries: ['India', 'Sri Lanka', 'Bangladesh'] },
      'East Asia': { countries: ['Japan', 'South Korea', 'China', 'Taiwan'] },
      'Southeast Asia': { countries: ['Singapore', 'Malaysia', 'Philippines', 'Thailand'] },
      Oceania: { countries: ['Australia', 'New Zealand'] },
    },
  },
}

export const filterMultipliers = {
  region: { '': 1, Americas: 1.15, EMEA: 0.92, APJ: 0.88 },
  channel: { '': 1, Voice: 1.2, Chat: 0.85, Email: 0.7, 'Social Media': 0.55, 'Self-Service': 0.4 },
  offering: { '': 1, ProSupport: 1.1, 'ProSupport Plus': 1.25, 'Basic Support': 0.75, 'Premium Support': 1.35, 'Managed Services': 0.95 },
  queue: {
    '': 1,
    Enterprise_T1_Voice: 1.3,
    Enterprise_T2_Voice: 1.1,
    SMB_T1_Chat: 0.8,
    SMB_T2_Voice: 0.9,
    Consumer_T1_Voice: 0.7,
    Consumer_T1_Chat: 0.6,
    Premium_Escalation: 1.4,
    Managed_Svc_Queue: 0.85,
  },
}

export const seed = {
  forecast: { a1: 128450, a2: 122310 },
  fcmod: { a1: 5, a2: -3 },
  osp: { a1: 38, a2: 45 },
  ar: { a1: 88.0, a2: 90.0 },
  handled: { a1: 113920, a2: 110080 },
  aht: { a1: 420, a2: 410 },
  absent: { a1: 12.0, a2: 11.5 },
  avail: { a1: 87.0, a2: 87.5 },
  staffed: { a1: 8.5, a2: 8.6 },
  conc: { a1: 2, a2: 2 },
  hc: { a1: 684, a2: 672 },
  attrition: { a1: 4.0, a2: 3.8 },
  movin: { a1: 18, a2: 18 },
  movout: { a1: 22, a2: 20 },
  hiring: { a1: 32, a2: 28 },
  training: { a1: 6, a2: 6 },
  ojt: { a1: 4, a2: 4 },
}

export const auxA1Def = [12.0, 7.0, 6.0, 14.0, 4.0, 2.0, 1.0, 1.0, 1.0]
export const auxA2Def = [11.0, 6.0, 6.0, 14.0, 4.5, 2.0, 1.0, 1.0, 1.0]

// Row definitions for the Parameter View table (and the source of truth for Parameter Trends)
export const weeklyRowDefs = [
  { label: 'CONTACTS', header: true, toggleGroup: 'contacts', level: 0 },
  { key: 'forecast', label: 'Forecast', dec: 0, agg: 'sum', groups: ['contacts'] },
  { key: 'fcmod', label: 'Forecast Mod%', suffix: '%', dec: 1, agg: 'avg', groups: ['contacts'] },
  { key: 'osp', label: 'OSP Mix', suffix: '%', dec: 0, agg: 'avg', groups: ['contacts'] },
  { key: 'ar', label: 'AR%', suffix: '%', dec: 1, agg: 'avg', groups: ['contacts'] },
  { key: 'handled', label: 'Handled', dec: 0, agg: 'sum', groups: ['contacts'] },

  { label: 'PRODUCTIVITY ASSUMPTIONS', header: true, toggleGroup: 'productivity', level: 0 },
  { key: 'aht', label: 'AHT (sec)', dec: 0, agg: 'avg', groups: ['productivity'] },
  { key: 'absent', label: 'Absenteeism%', suffix: '%', dec: 1, agg: 'avg', groups: ['productivity'] },
  { label: 'AUX States', header: true, toggleGroup: 'aux', level: 1, groups: ['productivity'] },
  ...Array.from({ length: 9 }, (_, i) => ({
    key: `aux${i + 1}`,
    label: `AUX ${i + 1}`,
    suffix: '%',
    dec: 1,
    agg: 'avg',
    groups: ['productivity', 'aux'],
  })),
  { key: 'avail', label: 'Availability %', suffix: '%', dec: 1, agg: 'avg', groups: ['productivity'] },
  { key: 'staffed', label: 'Staffed Time (hrs)', dec: 1, agg: 'avg', groups: ['productivity'] },
  { key: 'conc', label: 'Concurrency', dec: 0, agg: 'avg', groups: ['productivity'] },
  { key: 'sl', label: 'SL%', suffix: '%', dec: 1, agg: 'avg', derived: true, groups: ['productivity'] },

  { label: 'HEADCOUNT ASSUMPTIONS', header: true, toggleGroup: 'headcount', level: 0 },
  { key: 'hc', label: 'Actual HC', dec: 0, agg: 'last', groups: ['headcount'] },
  { key: 'attrition', label: 'Attrition%', suffix: '%', dec: 1, agg: 'avg', groups: ['headcount'] },
  { key: 'movin', label: 'Movement In', dec: 0, agg: 'sum', groups: ['headcount'] },
  { key: 'movout', label: 'Movement Out', dec: 0, agg: 'sum', groups: ['headcount'] },
  { key: 'hiring', label: 'Hiring', dec: 0, agg: 'sum', groups: ['headcount'] },
  { key: 'training', label: 'Training', dec: 0, agg: 'avg', groups: ['headcount'] },
  { key: 'ojt', label: 'OJT', dec: 0, agg: 'avg', groups: ['headcount'] },
  { key: 'hcgap', label: 'HC Gap', dec: 0, agg: 'last', derived: true, groups: ['headcount'] },
]

export const TREND_GROUP_META = {
  contacts: '📞 CONTACTS',
  productivity: '📊 PRODUCTIVITY ASSUMPTIONS',
  headcount: '👥 HEADCOUNT ASSUMPTIONS',
}

export const HEADCOUNT_BAR_STAGES = [
  { key: 'hc', label: 'Actual HC', agg: 'last', dec: 0, color: 'teal' },
  { key: 'movin', label: 'Movement In', agg: 'sum', dec: 0, color: 'amber' },
  { key: 'movout', label: 'Movement Out', agg: 'sum', dec: 0, color: 'purple' },
]

export const HEADCOUNT_TREND_METRICS = [
  { key: 'attrition', label: 'Attrition%', agg: 'avg', dec: 1, suffix: '%', color1: 'red', color2: 'orange', axis: 'y1' },
  { key: 'hiring', label: 'Hiring', agg: 'sum', dec: 0, suffix: '', color1: 'green', color2: 'cyan', axis: 'y' },
  { key: 'training', label: 'Training', agg: 'avg', dec: 0, suffix: '', color1: 'blue', color2: 'indigo', axis: 'y' },
  { key: 'ojt', label: 'OJT', agg: 'avg', dec: 0, suffix: '', color1: 'pink', color2: 'rose', axis: 'y' },
]

export const QUEUE_SL_BASE = [
  { name: 'Enterprise Pro/Core ID', sl: 74.7, hc: 20, plan: 18 },
  { name: 'LATAM Top Customers Spanish', sl: 75.0, hc: 18, plan: 17 },
  { name: 'LATAM AH Portuguese', sl: 76.5, hc: 10, plan: 9 },
  { name: 'Networking IND', sl: 77.2, hc: 19, plan: 18 },
  { name: 'Global CoreStore', sl: 77.4, hc: 18, plan: 17 },
  { name: 'KOR Storage Upsell Korean', sl: 79.6, hc: 19, plan: 18 },
]

export const AR_META = { key: 'ar', dec: 1 }
export const FCMOD_META = { key: 'fcmod', dec: 1 }
