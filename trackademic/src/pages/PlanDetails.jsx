import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Comments from '../components/Comments';
import { 
  Container, 
  Typography, 
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Snackbar,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../services/supabaseClient';
import localPlansManager from '../services/localPlansManager';

export default function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState({});
  const [savedGrades, setSavedGrades] = useState({});
  const [savingGrades, setSavingGrades] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Helper function to normalize MongoDB ID
  const normalizeId = (id) => {
    return localPlansManager._normalizeId(id);
  };

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("Usuario no autenticado");
        }
        
        try {
          // Normalize the planId before fetching
          const normalizedPlanId = normalizeId(planId);
          console.log('Requesting plan with ID:', normalizedPlanId); // Debug log
          
          const fetchedPlan = await localPlansManager.getPlanById(normalizedPlanId);
          console.log('Received plan:', fetchedPlan); // Debug log
          
          // Verify the fetched plan ID matches the requested ID
          const normalizedFetchedId = normalizeId(fetchedPlan._id);
          console.log('Comparing IDs:', { requested: normalizedPlanId, received: normalizedFetchedId }); // Debug log
          
          if (normalizedFetchedId !== normalizedPlanId) {
            throw new Error("El ID del plan recuperado no coincide con el ID solicitado");
          }
          
          // Asegurarse de que activities existe
          if (!fetchedPlan.activities) {
            fetchedPlan.activities = [];
          }
          
          setPlan(fetchedPlan);
          
          // Inicializar las notas desde las actividades existentes
          const initialGrades = {};
          fetchedPlan.activities.forEach(activity => {
            if (activity && activity.name) {
              initialGrades[activity.name] = activity.grade || '';
            }
          });
          setGrades(initialGrades);
          
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

  const handleGradeChange = (activityName, value) => {
    if (!activityName) return;
    
    // Validar que el valor sea un número entre 0 y 5
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= 5)) {
      setGrades(prev => ({
        ...prev,
        [activityName]: value
      }));
      // Marcar la nota como no guardada cuando se modifica
      setSavedGrades(prev => ({
        ...prev,
        [activityName]: false
      }));
    }
  };

  const handleSaveGrade = async (activityName) => {
    try {
      const gradeValue = grades[activityName];
      if (gradeValue === '' || gradeValue === undefined) {
        throw new Error("Por favor ingresa una nota válida");
      }

      const grade = parseFloat(gradeValue);
      if (isNaN(grade)) {
        throw new Error("La nota debe ser un número válido");
      }

      if (grade < 0 || grade > 5) {
        throw new Error("La nota debe estar entre 0 y 5");
      }
      
      setSavingGrades(prev => ({ ...prev, [activityName]: true }));

      const updatedPlan = {
        ...plan,
        activities: plan.activities.map(activity => 
          activity.name === activityName 
            ? { ...activity, grade }
            : activity
        )
      };

      await localPlansManager.updateGrade(planId, activityName, grade);
      
      setPlan(updatedPlan);

      // Marcar la nota como guardada
      setSavedGrades(prev => ({
        ...prev,
        [activityName]: true
      }));

      setSnackbar({
        open: true,
        message: 'Nota guardada exitosamente',
        severity: 'success'
      });

      setTimeout(() => {
        setSavingGrades(prev => ({ ...prev, [activityName]: false }));
      }, 1000);
    } catch (err) {
      console.error("Error saving grade:", err);
      setSavingGrades(prev => ({ ...prev, [activityName]: false }));
      setSnackbar({
        open: true,
        message: `Error al guardar la nota: ${err.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const calculateWeightedAverage = () => {
    if (!plan || !plan.activities || plan.activities.length === 0) return 0;
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    plan.activities.forEach(activity => {
      const weight = parseFloat(activity.weight) / 100;
      const grade = activity.grade !== undefined ? parseFloat(activity.grade) : 0;
      
      if (!isNaN(weight) && !isNaN(grade)) {
        totalWeight += weight;
        weightedSum += weight * grade;
      }
    });
    
    if (totalWeight === 0) return 0;
    
    return (weightedSum / totalWeight).toFixed(2);
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

  // Si no hay actividades, mostrar un mensaje
  if (!plan.activities || plan.activities.length === 0) {
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
              {plan.subject_name} {plan.professor ? `- ${plan.professor}` : ''}
            </Typography>

            <Alert severity="info" sx={{ mt: 4 }}>
              Este plan no tiene actividades definidas. Por favor, agrega actividades al plan.
            </Alert>
          </Paper>
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
            {plan.subject_name} {plan.professor ? `- ${plan.professor}` : ''}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Actividades y Notas
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Actividad</TableCell>
                    <TableCell align="right">Peso (%)</TableCell>
                    <TableCell align="right">Nota (0-5)</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plan.activities.map((activity) => (
                    activity && activity.name ? (
                      <TableRow key={activity.name}>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell align="right">{activity.weight}%</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={grades[activity.name] || ''}
                            onChange={(e) => handleGradeChange(activity.name, e.target.value)}
                            inputProps={{ 
                              min: 0, 
                              max: 5, 
                              step: 0.1,
                              style: { textAlign: 'right' }
                            }}
                            size="small"
                            sx={{ width: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {savingGrades[activity.name] ? (
                            <CircularProgress size={24} />
                          ) : savedGrades[activity.name] ? (
                            <Tooltip title="Nota guardada">
                              <IconButton color="success">
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Guardar nota">
                              <IconButton
                                color="primary"
                                onClick={() => handleSaveGrade(activity.name)}
                                disabled={!grades[activity.name]}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : null
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Promedio Ponderado
                      </Typography>
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {calculateWeightedAverage()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ my: 4 }} />
          
          <Comments planId={planId} />
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
} 