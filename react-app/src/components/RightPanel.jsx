import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { idxAll, aggVals, fmt } from '../lib/calc'
import { WEEKS } from '../lib/constants'

function useInsights(weeklyData, derived) {
  return useMemo(() => {
    const all = idxAll()
    const handled1 = aggVals(weeklyData.handled.a1, all, 'sum', 0)
    const handled2 = aggVals(weeklyData.handled.a2, all, 'sum', 0)
    const hcStart1 = weeklyData.hc.a1[0], hcEnd1 = weeklyData.hc.a1[WEEKS - 1]
    const hcStart2 = weeklyData.hc.a2[0], hcEnd2 = weeklyData.hc.a2[WEEKS - 1]
    const avgGap1 = aggVals(derived.hcgap.a1, all, 'avg', 0), avgGap2 = aggVals(derived.hcgap.a2, all, 'avg', 0)
    const avgAux1 = aggVals(derived.totalAux.a1, all, 'avg', 1), avgAux2 = aggVals(derived.totalAux.a2, all, 'avg', 1)
    const avgAr1 = aggVals(weeklyData.ar.a1, all, 'avg', 1), avgAr2 = aggVals(weeklyData.ar.a2, all, 'avg', 1)
    const volDeltaPct = handled1 ? ((handled2 - handled1) / handled1 * 100) : 0

    const insights = []
    insights.push(`A2 shifts total ${WEEKS}-week handled volume by ${volDeltaPct >= 0 ? '+' : ''}${volDeltaPct.toFixed(1)}% vs A1 (${fmt(handled2)} vs ${fmt(handled1)}).`)
    insights.push(`Headcount trend: A1 moves ${fmt(hcStart1)}→${fmt(hcEnd1)}, A2 moves ${fmt(hcStart2)}→${fmt(hcEnd2)} over the horizon.`)
    insights.push(avgGap2 >= avgGap1
      ? `A2 improves the average staffing gap by ${Math.abs(avgGap2 - avgGap1).toFixed(0)} FTE, reducing understaffing risk.`
      : `A2 average staffing gap is ${Math.abs(avgGap1 - avgGap2).toFixed(0)} FTE worse than A1 — review hiring pace.`)
    insights.push(avgAux2 <= avgAux1
      ? `Aux/non-productive time is lower in A2 (${avgAux2.toFixed(1)}% vs ${avgAux1.toFixed(1)}%), supporting the productivity gain.`
      : `Aux/non-productive time is higher in A2 (${avgAux2.toFixed(1)}% vs ${avgAux1.toFixed(1)}%), partially offsetting other gains.`)
    insights.push(`Average AR% ${avgAr2 >= avgAr1 ? 'improves' : 'declines'} from ${avgAr1.toFixed(1)}% (A1) to ${avgAr2.toFixed(1)}% (A2).`)
    return insights
  }, [weeklyData, derived])
}

export default function RightPanel() {
  const { state, dispatch, derived, showToast } = useDashboard()
  const { rightPanelCollapsed, notesText, savedNotes, weeklyData } = state
  const insights = useInsights(weeklyData, derived)

  const saveNote = () => {
    if (!notesText.trim()) { showToast('⚠ Please enter a note'); return }
    dispatch({ type: 'SAVE_NOTE' })
    showToast('✅ Note saved successfully')
  }

  return (
    <>
      <div
        className="panel-toggle"
        onClick={() => dispatch({ type: 'TOGGLE_RIGHT_PANEL' })}
        title={rightPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {rightPanelCollapsed ? '‹' : '›'}
      </div>
      <div className={`right-panel${rightPanelCollapsed ? ' collapsed' : ''}`}>
        <div className="right-panel-inner">
          <div className="right-section">
            <div className="right-section-title">📝 SCENARIO NOTES</div>
            <div className="notes-wrap">
              <textarea
                className="notes-textarea"
                placeholder="Type your scenario notes here..."
                value={notesText}
                onChange={(e) => dispatch({ type: 'SET_NOTES_TEXT', text: e.target.value })}
              />
              <button className="save-note-btn" onClick={saveNote}>💾 Save Note</button>
            </div>
          </div>
          <div className="right-section">
            <div className="notes-summary-section">
              <div className="ns-title">📋 NOTES SUMMARY</div>
              <table className="notes-history-table">
                <thead><tr><th>Previous SCENARIO NOTES</th><th>Last Updated</th><th>Updated By</th></tr></thead>
                <tbody>
                  {savedNotes.length === 0
                    ? <tr><td colSpan={3} className="no-notes">No notes saved yet. Write a note above and click Save.</td></tr>
                    : savedNotes.map((n, i) => <tr key={i}><td>{n.text}</td><td>{n.date}</td><td>{n.user}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="right-section">
            <div className="right-section-title">🤖 AI-GENERATED INSIGHTS</div>
            <ul className="insights-list">
              {insights.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            <div className="insights-note">Auto-generated from the current scenario data (rule-based summary).</div>
          </div>
        </div>
      </div>
    </>
  )
}
