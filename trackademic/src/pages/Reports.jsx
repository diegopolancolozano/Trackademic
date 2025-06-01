import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  Typography, Container, CircularProgress, Box, Card, CardContent,
  TextField, Divider, Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navbar from '../components/Navbar';
import localPlansManager from '../services/localPlansManager';

export default function Reports() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetAverage, setTargetAverage] = useState(0);

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;

    if (!userId) {
      window.location.href = '/';
      return;
    }

    const userPlans = await localPlansManager.getUserPlans(userId);
    setPlans(userPlans);
    setLoading(false);
  };

  const calculateGlobalAverage = () => {
    if (plans.length === 0) return 'N/A';
    const total = plans.reduce(
      (sum, plan) => sum + localPlansManager.calculateAverage(plan),
      0
    );
    return (total / plans.length).toFixed(2);
  };

  const calculateRequiredGradesForPlan = (plan) => {
    if (!targetAverage || targetAverage < 0 || targetAverage > 5) return { message: 'Ingresa un promedio objetivo válido (0-5)' };
    return localPlansManager.calculateRequiredGrades(plan, parseFloat(targetAverage));
  };

  useEffect(() => {
    fetchData();
  }, [targetAverage]);

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
          Informes Innovadores
        </Typography>

        {/* Promedio Global (R.17) */}
        <Card sx={{ mb: 4, backgroundColor: '#1e1e1e' }}>
          <CardContent>
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
              sx={{ fontSize: '1.1rem', padding: '8px 16px' }}
            />
          </CardContent>
        </Card>

        {/* Notas Requeridas (R.18) */}
        <Card sx={{ backgroundColor: '#1e1e1e' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notas Necesarias para Alcanzar tu Meta
            </Typography>
            <TextField
              label="Promedio objetivo (0-5)"
              type="number"
              value={targetAverage}
              onChange={(e) => setTargetAverage(e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              sx={{ mb: 3, width: '200px' }}
            />
            {plans.length === 0 ? (
              <Typography>No hay planes disponibles para calcular notas requeridas.</Typography>
            ) : (
              plans.map((plan) => {
                const requiredGrades = calculateRequiredGradesForPlan(plan);
                return (
                  <Box key={plan._id} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Plan: {plan.titulo} ({plan.subject_name} - {plan.group})
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {requiredGrades.message ? (
                      <Typography>{requiredGrades.message}</Typography>
                    ) : (
                      Object.entries(requiredGrades).map(([activityName, data]) => (
                        <Typography key={activityName} sx={{ ml: 2, mb: 1 }}>
                          Para obtener tu promedio elegido de {targetAverage}, necesitas sacar{' '}
                          {data.requiredGrade} de 5 en {activityName}, lo que equivaldría a{' '}
                          {data.contribution} para tu promedio global elegido de {targetAverage}.
                        </Typography>
                      ))
                    )}
                  </Box>
                );
              })
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
