import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import { supabase } from '../services/supabaseClient';
import localPlansManager from '../services/localPlansManager';

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchUserPlans = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuario no autenticado");
      }
      const userId = userData.user.id;
      
      // Fetch user plans
      const userPlans = await localPlansManager.getUserPlans(userId);
      setPlans(userPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlans();
  }, []);

  // Calculate weighted average for a plan
  const calculateAverage = (plan) => {
    return localPlansManager.calculateAverage(plan).toFixed(2);
  };
  
  // Confirm before deleting a plan
  const handleDeleteClick = (planId) => {
    setDeletingPlan(planId);
  };

  // Execute plan deletion
  const handleConfirmDelete = async () => {
    try {
      await localPlansManager.deletePlan(deletingPlan);
      
      // Refresh the plans list
      await fetchUserPlans();
      
      setSnackbar({
        open: true,
        message: 'Plan eliminado con éxito',
        severity: 'success'
      });
    } catch (err) {
      console.error("Error deleting plan:", err);
      setSnackbar({
        open: true,
        message: `Error al eliminar el plan: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setDeletingPlan(null);
    }
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
          <Typography variant="body1" sx={{ mt: 2 }}>Cargando planes...</Typography>
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
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mis planes actuales
        </Typography>

        {plans.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3, mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No tienes planes de evaluación. Agrega nuevos planes desde la sección de materias.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/subjects"
            >
              Ir a materias
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.titulo}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1" color="text.secondary">
                        {plan.subject_name || 'Sin curso asociado'}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Profesor: {plan.professor || 'No especificado'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip 
                        label={`${plan.credits || '0'} créditos`}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={`Promedio: ${calculateAverage(plan)}`}
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button
                      startIcon={<EditIcon />}
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/plan-details/${plan._id}`} // Esta ruta la implementará otro desarrollador
                      size="small"
                    >
                      Ver detalles y editar
                    </Button>
                    
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(plan._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este plan de evaluación? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingPlan(null)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
