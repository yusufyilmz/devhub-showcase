import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
 palette: {
    primary: {
      main: '#FFFFFF'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000'
        }
      }
    }
  }
})
