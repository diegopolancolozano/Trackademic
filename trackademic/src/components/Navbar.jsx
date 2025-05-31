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
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <img
            src="/logo.png"
            alt="Trackademic Logo"
            style={{ width: 80, height: 80, marginRight: 8 }}
          />
          <Typography variant="h6" noWrap>
            Trackademic
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/reports')}>
            Informes innovadores
          </Button>
          <Button color="inherit" onClick={() => navigate('/my-plans')}>
            Mis planes actuales
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
