import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Container, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { supabase } from '../services/supabaseClient';
import { user } from '../services/infoUser';
import localPlansManager from '../services/localPlansManager';

export default function Settings() {
  const [faculties, setFaculties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  const [faculty, setFaculty] = useState('');
  const [area, setArea] = useState('');
  const [program, setProgram] = useState('');
  const [semester, setSemester] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Load options and current user data
  useEffect(() => {
    const fetchOptions = async () => {
      // Get options
      const { data: facultiesData } = await supabase.from('faculties').select('*');
      const { data: areasData } = await supabase.from('areas').select('*');
      const { data: programsData } = await supabase.from('programs').select('*');

      setFaculties(facultiesData || []);
      setAreas(areasData || []);
      setPrograms(programsData || []);
      
      // Get current user settings
      setFaculty(user.getFaculty());
      setArea(user.getArea());
      setProgram(user.getProgram());
      setSemester(user.getSemester());
    };

    fetchOptions();
  }, []);

  const handleUpdateProfile = async () => {
    setDialogOpen(false);
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user.id;
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          faculty,
          area,
          program,
          semester: parseInt(semester, 10),
        })
        .eq('id', userId);
      
      if (updateError) {
        throw updateError;
      }

      // Update local storage
      user.setFaculty(faculty);
      user.setArea(area);
      user.setProgram(program);
      user.setSemester(semester);
      
      // Delete all local plans for this user
      try {
        await localPlansManager.deleteAllUserPlans(userId);
      } catch (error) {
        console.error("Error deleting user plans:", error);
      }
      
      setSnackbar({
        open: true,
        message: 'Perfil actualizado con éxito. Se han eliminado tus planes personales.',
        severity: 'success',
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error actualizando perfil: ${error.message}`,
        severity: 'error',
      });
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Ajustes de perfil
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Modificar tu facultad, área, programa o semestre eliminará todos tus planes de evaluación actuales.
          </Typography>
          
          <Box component="form" sx={{ mt: 3 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Facultad</InputLabel>
              <Select 
                value={faculty} 
                onChange={(e) => setFaculty(e.target.value)} 
                label="Facultad"
              >
                {faculties.map((fac) => (
                  <MenuItem key={fac.code} value={fac.code}>
                    {fac.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Área</InputLabel>
              <Select 
                value={area} 
                onChange={(e) => setArea(e.target.value)} 
                label="Área"
              >
                {areas.map((a) => (
                  <MenuItem key={a.code} value={a.code}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Programa</InputLabel>
              <Select 
                value={program} 
                onChange={(e) => setProgram(e.target.value)} 
                label="Programa"
              >
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

            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => setDialogOpen(true)}
            >
              Actualizar perfil
            </Button>
          </Box>
        </Paper>
      </Container>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirmar cambios</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Al actualizar tu perfil académico, todos los planes de evaluación que has creado o agregado serán eliminados.
            ¿Estás seguro de que deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateProfile} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error notification */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
