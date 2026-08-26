import { createTheme } from '@mui/material/styles'

// Dell Design System v3 tokens (dds-dashboard-development skill) wired into an MUI theme.
// Light-mode values are the documented DDS tokens; dark-mode values mirror the app's existing
// dark palette so the DDS component layer stays legible when the theme toggle is set to dark.
export function createDdsTheme(mode) {
  const dark = mode === 'dark'
  return createTheme({
    palette: {
      mode,
      primary: { main: '#0076ce' },
      success: { main: '#0f9d58' },
      warning: { main: '#f4b400' },
      error: { main: '#d93025' },
      text: {
        primary: dark ? '#e2e8f0' : '#171717',
        secondary: dark ? '#94a3b8' : '#5f6368',
      },
      background: {
        default: dark ? '#0a1628' : '#ffffff',
        paper: dark ? '#1a2332' : '#ffffff',
      },
      divider: dark ? '#1e3a5f' : '#dadce0',
    },
    typography: {
      fontFamily: "'Roboto Flex', sans-serif",
      h1: { fontWeight: 300 }, h2: { fontWeight: 300 }, h3: { fontWeight: 300 },
      h4: { fontWeight: 400 }, h5: { fontWeight: 400 },
      h6: { fontWeight: 500 },
      body1: { fontWeight: 400 }, body2: { fontWeight: 400 },
    },
    shape: { borderRadius: 4 },
    spacing: 4,
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 4, textTransform: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 2 } } },
      MuiSelect: { styleOverrides: { root: { borderRadius: 2 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 4 } } },
    },
  })
}
