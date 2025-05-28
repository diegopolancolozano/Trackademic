import { useEffect, useState } from 'react';
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [faculty, setFaculty] = useState('');
  const [area, setArea] = useState('');
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');

  const [faculties, setFaculties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      const { data: facultiesData } = await supabase.from('faculties').select('*');
      setFaculties(facultiesData || []);
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchAreasByFaculty = async () => {
      if (!faculty) {
        setAreas([]);
        return;
      }

      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('faculty_code', faculty);

      if (error) {
        console.error('Error fetching areas:', error.message);
        setAreas([]);
      } else {
        setAreas(data || []);
      }
    };

    fetchAreasByFaculty();
  }, [faculty]);

  useEffect(() => {
    const fetchProgramsByArea = async () => {
      if (!area) {
        setPrograms([]);
        return;
      }

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('area_code', area);

      if (error) {
        console.error('Error fetching programs:', error.message);
        setPrograms([]);
      } else {
        setPrograms(data || []);
      }
    };

    fetchProgramsByArea();
  }, [area]);

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

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      username,
      faculty,
      area,
      program,
      semester: parseInt(semester, 10),
    });

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
            label="Nombre de usuario"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Facultad</InputLabel>
            <Select value={faculty} onChange={(e) => setFaculty(e.target.value)} label="Facultad">
              {faculties.map((fac) => (
                <MenuItem key={fac.code} value={fac.code}>
                  {fac.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Área</InputLabel>
            <Select value={area} onChange={(e) => setArea(e.target.value)} label="Área">
              {areas.map((a) => (
                <MenuItem key={a.code} value={a.code}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Programa</InputLabel>
            <Select value={program} onChange={(e) => setProgram(e.target.value)} label="Programa">
              {programs.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Semestre"
            type="number"
            margin="normal"
            value={semester}
            inputProps={{ min: 1, max: 10 }}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value >= 1 && value <= 10) {
                setSemester(e.target.value);
              } else if (e.target.value === '') {
                setSemester('');
              }
            }}
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
