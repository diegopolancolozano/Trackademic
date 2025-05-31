import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { user } from '../services/infoUser';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } else {
      user.init(email.trim());

      setSnackbar({
        open: true,
        message: 'Inicio de sesión exitoso',
        severity: 'success',
      });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src="/logo.png"
              alt="Trackademic logo"
              style={{ width: 100, height: 100 }}
            />
          </Box>

          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
          >
            Entrar
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" underline="hover">
              Regístrate aquí
            </Link>
          </Typography>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
