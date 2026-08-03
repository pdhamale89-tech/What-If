import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'

export default function ToastContainer() {
  const { state } = useDashboard()
  return (
    <div className="toast-container">
      {state.toasts.map((t) => <div className="toast" key={t.id}>{t.msg}</div>)}
    </div>
  )
}
