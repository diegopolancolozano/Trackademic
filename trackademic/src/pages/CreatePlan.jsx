import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/Navbar';
import CreatePlanForm from '../components/CreatePlanForm';
import localPlansManager from '../services/localPlansManager';
import { supabase } from '../services/supabaseClient';

export default function CreatePlan() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .eq('code', courseId)
          .single();

        if (error) throw error;
        setCourseInfo(data);
      } catch (err) {
        console.error('Error fetching course info:', err);
        setError('Error al obtener información del curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [courseId]);

  const handleSubmit = async (formData) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuario no autenticado");
      }

      const planData = {
        ...formData,
        courseId,
        courseName: courseInfo.name,
        createdBy: userData.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        activities: formData.activities.map(activity => ({
          ...activity,
          weight: Number(activity.weight)
        }))
      };

      await localPlansManager.addPlan(planData);
      
      setSnackbar({
        open: true,
        message: 'Plan creado exitosamente',
        severity: 'success'
      });

      // Redirect back to plans page after successful creation
      setTimeout(() => {
        navigate(`/subjects/${courseId}/plans`);
      }, 1500);
    } catch (err) {
      console.error('Error creating plan:', err);
      setError(err.message);
      setSnackbar({
        open: true,
        message: `Error al crear el plan: ${err.message}`,
        severity: 'error'
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Cargando información del curso...</Typography>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Volver
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Crear Plan para {courseInfo?.name}
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <CreatePlanForm 
            onSubmit={handleSubmit} 
            initialData={{
              courseName: courseInfo?.name || ''
            }}
          />
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
} 