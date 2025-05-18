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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleRegister = async () => {
    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setSnackbar({ open: true, message: signUpError.message, severity: 'error' });
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      setSnackbar({ open: true, message: userError.message, severity: 'error' });
      return;
    }

    const userId = userData.user.id;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: fullName });

    if (profileError) {
      setSnackbar({ open: true, message: profileError.message, severity: 'error' });
      return;
    }

    setSnackbar({
      open: true,
      message: 'Registro exitoso. Redirigiendo...',
      severity: 'success',
    });

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
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
          <Typography variant="h4" align="center" gutterBottom>
            Registro
          </Typography>

          <TextField
            fullWidth
            label="Nombre completo"
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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
            onClick={handleRegister}
            sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
          >
            Registrarse
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/" underline="hover">
              Inicia sesión
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
