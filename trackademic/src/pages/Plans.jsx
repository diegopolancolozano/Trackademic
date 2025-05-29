import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  CardActions,
  Stack
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import plansManager from '../services/globalPlansManager';
import localPlansManager from '../services/localPlansManager';
import { supabase } from '../services/supabaseClient';

// Componente principal de Planes
export default function Plans() {
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          PLANES GLOBALES
        </Typography>
        <PlansContainer />
      </Container>
    </>
  );
}

// Contenedor de planes con botón de crear
function PlansContainer() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const coursePlans = await plansManager.getPlans(courseId);
        setPlans(coursePlans);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [courseId]);

  const handleCreatePlan = () => {
    navigate(`/subjects/${courseId}/plans/create`);
  };

  const handleCopyPlan = async (plan) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuario no autenticado");
      }

      // Crear una copia personal del plan con una copia profunda de las propiedades
      const personalPlan = {
        titulo: plan.titulo || 'Plan sin título',
        subject_id: plan.subject_id,
        subject_name: plan.subject_name,
        professor: plan.professor || '',
        group: plan.group || '',
        credits: plan.credits || 0,
        isGlobal: false,
        createdBy: userData.user.id,
        user_id: userData.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Asegurarnos de copiar correctamente las actividades
        activities: plan.activities ? plan.activities.map(activity => ({
          name: activity.name,
          weight: activity.weight,
          grade: activity.grade || 0
        })) : []
      };

      await localPlansManager.addPlan(personalPlan);
      alert("Plan copiado exitosamente a tus planes personales");
    } catch (err) {
      console.error("Error copying plan:", err);
      alert("Error al copiar el plan: " + err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los planes: {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreatePlan}
        sx={{ alignSelf: 'flex-end' }}
      >
        Crear nuevo plan
      </Button>

      {plans.length === 0 ? (
        <Alert severity="info">
          No hay planes globales disponibles para este curso.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan._id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.titulo || 'Plan sin título'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Grupo: {plan.group || 'No especificado'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Profesor: {plan.professor || 'No especificado'}
                  </Typography>

                  {plan.activities && plan.activities.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Actividades:
                      </Typography>
                      {plan.activities.map((activity, index) => (
                        <Chip
                          key={index}
                          label={`${activity.name}: ${activity.weight}%`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    variant="contained"
                    onClick={() => handleCopyPlan(plan)}
                    size="small"
                  >
                    Copiar a mis planes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
