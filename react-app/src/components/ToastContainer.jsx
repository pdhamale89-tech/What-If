import React from 'react'
import { useDashboard } from '../context/DashboardContext.jsx'
import { DDSNotificationContainer, DDSNotification } from '../components/dds'

export default function ToastContainer() {
  const { state } = useDashboard()
  return (
    <DDSNotificationContainer placement="bottom-end">
      {state.toasts.map((t) => <DDSNotification key={t.id}>{t.msg}</DDSNotification>)}
    </DDSNotificationContainer>
  )
}
