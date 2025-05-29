import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Container, 
  Typography, 
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../services/supabaseClient';
import localPlansManager from '../services/localPlansManager';

export default function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("Usuario no autenticado");
        }
        
        try {
          // Esta API debería devolver un solo plan por ID
          // Nota: Esta implementación podría requerir ajustes dependiendo de la API real
          const response = await fetch(`https://trackademifunction.vercel.app/api/local_plans?id=${planId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'omit'
          });
          
          if (!response.ok) {
            throw new Error(`Error al obtener detalles del plan: ${response.statusText}`);
          }
          
          const plans = await response.json();
          
          if (plans.length === 0) {
            throw new Error("No se encontró el plan solicitado");
          }
          
          setPlan(plans[0]);
        } catch (apiError) {
          console.error("Error fetching plan details:", apiError);
          setError(apiError.message);
        }
      } catch (authError) {
        console.error("Authentication error:", authError);
        setError("Error de autenticación");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanDetails();
  }, [planId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Cargando detalles del plan...</Typography>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack} 
            sx={{ mt: 2 }}
          >
            Volver
          </Button>
        </Container>
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="warning">No se pudo encontrar el plan solicitado.</Alert>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack} 
            sx={{ mt: 2 }}
          >
            Volver a mis planes
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Volver
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            {plan.titulo}
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {plan.subject_name} - {plan.professor || 'Profesor no especificado'}
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 4, mb: 2 }}>
            Esta página será implementada por otro desarrollador para permitir la edición detallada
            del plan de evaluación, incluyendo modificación de notas, actividades, pesos y más.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            Funcionalidad en desarrollo. La edición completa del plan estará disponible pronto.
          </Alert>
        </Paper>
      </Container>
    </>
  );
} 