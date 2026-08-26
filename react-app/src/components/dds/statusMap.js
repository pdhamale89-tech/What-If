// Maps this app's semantic status names to MUI's palette color keys.
export function statusToColor(status) {
  switch (status) {
    case 'success': return 'success'
    case 'danger': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    case 'brand': return 'primary'
    default: return 'default'
  }
}
