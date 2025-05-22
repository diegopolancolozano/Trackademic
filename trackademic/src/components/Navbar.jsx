import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
  } from '@mui/material';
  import SettingsIcon from '@mui/icons-material/Settings';
  import { useNavigate } from 'react-router-dom';
  
  export default function Navbar() {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      localStorage.clear();
      navigate('/');
    };
  
    return (
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            Trackademic
          </Typography>
  
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/reports')}>
              Informes innovadores
            </Button>
            <Button color="inherit" onClick={() => navigate('/my-plans')}>
              Mis notas
            </Button>
            <Button color="inherit" onClick={() => navigate('/subjects')}>
              Materias del semestre
            </Button>
            <IconButton color="inherit" onClick={() => navigate('/settings')}>
              <SettingsIcon />
            </IconButton>
            <Button
              onClick={handleLogout}
              sx={{ color: 'error.main', fontWeight: 'bold' }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
  