import { createTheme } from '@mui/material/styles'

const baseTypography = {
  fontFamily: "'Roboto', sans-serif",
  h1: { fontSize: '40px', fontWeight: 600 },
  h2: { fontSize: '28px', fontWeight: 500 },
  body1: { fontSize: '14px' },
  body2: { fontSize: '10.5px' },
}
const noBorder = {
  MuiCssBaseline: {
    styleOverrides: {
      '*:focus': {
        outline: 'none !important',
      },
    },
  },
}
export const lightTheme = createTheme({
  components: noBorder,
  palette: {
    mode: 'light',
    primary: { main: '#4BD0CC' },
    secondary: { main: '#FF8686' },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FF',
    },
    text: {
      primary: '#141516ff',
      secondary: '#8890B1',
    },
  },
  typography: baseTypography,
})

export const darkTheme = createTheme({
  components: noBorder,
  palette: {
    mode: 'dark',
    primary: { main: '#4BD0CC' },
    secondary: { main: '#FF8686' },
    background: {
      default: '#141516ff',
      paper: '#1C1D21',
    },
    text: {
      primary: '#F8F9FF',
      secondary: '#8890B1',
    },
  },
  typography: baseTypography,
})
