import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // <- fondo global
      paper: '#1e1e1e',    // <- fondo de tarjetas (Paper, etc)
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212', // 🔥 aquí forzamos el fondo global al body
        },
      },
    },
  },
});

export default darkTheme;
