import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  Typography, Container, CircularProgress, Box, Grid, Card, CardContent, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Divider, Link
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navbar from '../components/Navbar';
import localPlansManager from '../services/localPlansManager';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [fullName, setFullName] = useState('');
  const [plans, setPlans] = useState([]);
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;

    if (!userId) {
      window.location.href = '/';
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, semester')
      .eq('id', userId)
      .single();

    if (profile) {
      setFullName(profile.full_name);
      setSemester(profile.semester);
    }

    const userPlans = await localPlansManager.getUserPlans(userId);
    setPlans(userPlans.slice(0, 3));
    setLoading(false);
  };

  const calculateAverage = (plan) =>
    localPlansManager.calculateAverage(plan).toFixed(2);

  const calculateGlobalAverage = () => {
    if (plans.length === 0) return 'N/A';
    const total = plans.reduce(
      (sum, plan) => sum + localPlansManager.calculateAverage(plan),
      0
    );
    return (total / plans.length).toFixed(2);
  };

  const handleNotesSave = (value) => {
    setNotes(value);
    localStorage.setItem('dashboard_notes', value);
  };

  useEffect(() => {
    fetchData();

    
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          ¡Hola, {fullName}!
        </Typography>

        {/* Informes Innovadores (Resumen para R.17 y R.18) */}
        <Typography variant="h5" sx={{ mt: 4 }}>Informes Innovadores</Typography>
        <Card sx={{ mb: 4, backgroundColor: '#1e1e1e' }}>
          <CardContent>
            {/* Promedio Global (R.17) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Tu Promedio Global</Typography>
            </Box>
            <Chip
              label={
                calculateGlobalAverage() === 'N/A'
                  ? 'No hay planes disponibles para calcular tu promedio'
                  : `Promedio: ${calculateGlobalAverage()}/5.0`
              }
              color="primary"
              sx={{ fontSize: '1.1rem', padding: '8px 16px', mb: 2 }}
            />

            {/* Resumen de Notas Necesarias (R.18) */}
            <Typography variant="body1" sx={{ mb: 1 }}>
              Revisa las notas necesarias para alcanzar tu meta promedio ingresando un objetivo en "Informes Innovadores".
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/reports')}
              sx={{ color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Ver más
            </Link>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* Resumen */}
        <Typography variant="h5" sx={{ mt: 4 }}>Resumen general</Typography>
        <Typography>Planes creados: {plans.length}</Typography>
        <Typography>Promedio global: {calculateGlobalAverage()}</Typography>
        <Typography>Semestre actual: {semester || 'No registrado'}</Typography>

        <Divider sx={{ my: 4 }} />

        {/* Recordatorios */}
        <Typography variant="h5" gutterBottom>Recordatorios</Typography>
        <Box sx={{ mb: 2 }}>
          {notes.trim() === '' ? (
            <Typography color="text.secondary">
              Agrega un recordatorio para iniciar.
            </Typography>
          ) : (
            <Box
              sx={{
                p: 2, backgroundColor: '#1e1e1e', borderRadius: 1, minHeight: '80px',
                '& h1, & h2, & h3': { mt: 2 }, '& ul': { pl: 3 }, '& p': { mb: 1 }
              }}
            >
              <ReactMarkdown>{notes}</ReactMarkdown>
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={() => setEditorOpen(true)}
            sx={{ mt: 2 }}
          >
            Editar recordatorios
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Planes recientes */}
        <Typography variant="h5" gutterBottom>Planes recientes</Typography>

        {plans.length === 0 ? (
          <Typography>No tienes planes de evaluación aún.</Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {plan.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {plan.subject_name || 'Sin curso'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      Profesor: {plan.professor || 'No especificado'}
                    </Typography>
                    <Chip
                      label={`Promedio: ${calculateAverage(plan)}`}
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/my-plans')}
          >
            Ver todos mis planes
          </Button>
        </Box>
      </Container>

      {/* Editor de recordatorios */}
      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth>
        <DialogTitle>Editor de recordatorios</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={6}
            value={notes}
            onChange={(e) => handleNotesSave(e.target.value)}
            placeholder="Escribe aquí tus recordatorios en estilo libre o Markdown..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
