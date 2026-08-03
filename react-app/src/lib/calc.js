import { WEEKS, seed, auxA1Def, auxA2Def } from './constants'

export function round(v, dec) {
  return +(+v).toFixed(dec)
}

export function flatSeries(v1, v2, dec) {
  const a1 = [], a2 = []
  for (let i = 0; i < WEEKS; i++) { a1.push(round(v1, dec)); a2.push(round(v2, dec)) }
  return { a1, a2 }
}

export function rampSeries(v1, v2, growth, dec) {
  const a1 = [], a2 = []
  for (let i = 0; i < WEEKS; i++) {
    const f = i / (WEEKS - 1)
    a1.push(round(v1 * (1 + growth * f), dec))
    a2.push(round(v2 * (1 + growth * f), dec))
  }
  return { a1, a2 }
}

export function targetSeries(start1, target1, start2, target2) {
  const a1 = [], a2 = []
  for (let i = 0; i < WEEKS; i++) {
    const f = i / (WEEKS - 1)
    a1.push(Math.round(start1 + (target1 - start1) * f))
    a2.push(Math.round(start2 + (target2 - start2) * f))
  }
  return { a1, a2 }
}

export function buildInitialWeeklyData(mult = 1) {
  const wd = {}
  wd.forecast = rampSeries(seed.forecast.a1 * mult, seed.forecast.a2 * mult, 0.18, 0)
  wd.fcmod = flatSeries(seed.fcmod.a1, seed.fcmod.a2, 1)
  wd.osp = flatSeries(seed.osp.a1, seed.osp.a2, 0)
  wd.ar = flatSeries(seed.ar.a1, seed.ar.a2, 1)
  wd.handled = rampSeries(seed.handled.a1 * mult, seed.handled.a2 * mult, 0.18, 0)
  wd.aht = flatSeries(seed.aht.a1, seed.aht.a2, 0)
  wd.absent = flatSeries(seed.absent.a1, seed.absent.a2, 1)
  for (let i = 0; i < 9; i++) wd[`aux${i + 1}`] = flatSeries(auxA1Def[i], auxA2Def[i], 1)
  wd.avail = flatSeries(seed.avail.a1, seed.avail.a2, 1)
  wd.staffed = flatSeries(seed.staffed.a1, seed.staffed.a2, 1)
  wd.conc = flatSeries(seed.conc.a1, seed.conc.a2, 0)

  const hc1 = Math.round(seed.hc.a1 * mult), hc2 = Math.round(seed.hc.a2 * mult)
  const hiring1 = Math.round(seed.hiring.a1 * mult), hiring2 = Math.round(seed.hiring.a2 * mult)
  const hcTarget1 = Math.round(hc1 + hiring1 - (hc1 * seed.attrition.a1 / 100) + (seed.movin.a1 - seed.movout.a1))
  const hcTarget2 = Math.round(hc2 + hiring2 - (hc2 * seed.attrition.a2 / 100) + (seed.movin.a2 - seed.movout.a2))
  wd.hc = targetSeries(hc1, hcTarget1, hc2, hcTarget2)
  wd.attrition = flatSeries(seed.attrition.a1, seed.attrition.a2, 1)
  wd.movin = flatSeries(seed.movin.a1, seed.movin.a2, 0)
  wd.movout = flatSeries(seed.movout.a1, seed.movout.a2, 0)
  wd.hiring = flatSeries(hiring1, hiring2, 0)
  wd.training = flatSeries(seed.training.a1, seed.training.a2, 0)
  wd.ojt = flatSeries(seed.ojt.a1, seed.ojt.a2, 0)
  return wd
}

export function idxAll() {
  return Array.from({ length: WEEKS }, (_, i) => i)
}

export function aggVals(arr, idxs, type, dec) {
  const vals = idxs.map((i) => arr[i])
  let r
  if (type === 'sum') r = vals.reduce((a, b) => a + b, 0)
  else if (type === 'last') r = vals[vals.length - 1]
  else r = vals.reduce((a, b) => a + b, 0) / vals.length
  return +r.toFixed(dec === undefined ? 1 : dec)
}

export function computeDerivedWeekly(wd) {
  const reqHC = { a1: [], a2: [] }, hcgap = { a1: [], a2: [] }, sl = { a1: [], a2: [] }
  const occ = { a1: [], a2: [] }, util = { a1: [], a2: [] }, prod = { a1: [], a2: [] }, totalAux = { a1: [], a2: [] }
  for (let i = 0; i < WEEKS; i++) {
    ;['a1', 'a2'].forEach((side) => {
      const handled = wd.handled[side][i], aht = wd.aht[side][i], staffed = wd.staffed[side][i]
      const avail = wd.avail[side][i], absent = wd.absent[side][i], conc = wd.conc[side][i] || 1
      const hc = wd.hc[side][i], ar = wd.ar[side][i]
      const req = Math.round(handled * aht / (staffed * 3600 * (avail / 100) * (1 - absent / 100) * conc)) || 0
      reqHC[side].push(req)
      const gap = hc - req
      hcgap[side].push(gap)
      const gapPct = req ? (gap / req) * 100 : 0
      sl[side].push(+Math.max(0, Math.min(100, ar + gapPct * 0.6)).toFixed(1))
      occ[side].push(hc ? (handled * aht / (hc * staffed * 3600 * (avail / 100) * (1 - absent / 100))) * 100 : 0)
      let tAux = 0
      for (let a = 1; a <= 9; a++) tAux += wd[`aux${a}`][side][i]
      totalAux[side].push(+tAux.toFixed(1))
      util[side].push((1 - tAux / 100) * avail)
      prod[side].push(hc ? handled / hc : 0)
    })
  }
  return { reqHC, hcgap, sl, occ, util, prod, totalAux }
}

export function fmt(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function pad2(n) {
  return n < 10 ? '0' + n : '' + n
}

export function getPeriods(viewMode, fiscalYear) {
  const fy = fiscalYear || 'FY26'
  if (viewMode === 'quarterly') {
    return [
      { label: `${fy}Q1`, idx: [0, 1, 2] },
      { label: `${fy}Q2`, idx: [3, 4, 5] },
      { label: `${fy}Q3`, idx: [6, 7, 8] },
      { label: `${fy}Q4`, idx: [9, 10, 11, 12] },
    ]
  }
  if (viewMode === 'monthly') {
    return [
      { label: `${fy}M01`, idx: [0, 1, 2, 3] },
      { label: `${fy}M02`, idx: [4, 5, 6, 7] },
      { label: `${fy}M03`, idx: [8, 9, 10, 11, 12] },
    ]
  }
  return Array.from({ length: WEEKS }, (_, i) => ({ label: `${fy}W${pad2(i + 1)}`, idx: [i] }))
}

export function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// Theme-aware chart color palette (mirrors the original app's cc() helper)
export function chartColors(theme) {
  const d = theme === 'dark'
  return {
    grid: d ? 'rgba(30,58,95,0.4)' : 'rgba(0,0,0,0.06)',
    text: d ? '#94a3b8' : '#64748b',
    green: '#22c55e', red: '#ef4444', blue: '#3b82f6', teal: '#06b6d4',
    amber: '#f59e0b', orange: '#fb923c', purple: '#a855f7', pink: '#ec4899',
    cyan: '#22d3ee', indigo: '#6366f1', rose: '#f43f5e',
    cardBg: d ? '#1a2332' : '#ffffff',
  }
}
