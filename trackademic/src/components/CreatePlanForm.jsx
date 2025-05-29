import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function CreatePlanForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    group: initialData.group || '',
    professor: initialData.professor || '',
    isGlobal: true, // Always true now
    activities: initialData.activities || [],
  });

  const [newActivity, setNewActivity] = useState({
    name: '',
    weight: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addActivity = () => {
    if (newActivity.name && newActivity.weight) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, { ...newActivity }]
      }));
      setNewActivity({ name: '', weight: '' });
    }
  };

  const removeActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const totalWeight = formData.activities.reduce((sum, act) => sum + Number(act.weight), 0);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Nombre del Plan"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="ej: Plan de evaluación primer corte"
        />

        <TextField
          required
          fullWidth
          label="Grupo (ej: G1)"
          name="group"
          value={formData.group}
          onChange={handleChange}
          placeholder="G1"
        />

        <TextField
          required
          fullWidth
          label="Profesor"
          name="professor"
          value={formData.professor}
          onChange={handleChange}
        />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Actividades de Evaluación
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              label="Nombre de la actividad"
              name="name"
              value={newActivity.name}
              onChange={handleActivityChange}
              size="small"
              placeholder="ej: Primera evaluación"
            />
            <TextField
              label="Peso (%)"
              name="weight"
              type="number"
              value={newActivity.weight}
              onChange={handleActivityChange}
              size="small"
              inputProps={{ min: 0, max: 100 }}
              helperText="Valor entre 0 y 100"
            />
            <Button
              variant="contained"
              onClick={addActivity}
              startIcon={<AddIcon />}
              disabled={!newActivity.name || !newActivity.weight}
            >
              Agregar
            </Button>
          </Stack>
        </Box>

        {formData.activities.map((activity, index) => (
          <Paper key={index} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>
                {activity.name} - {activity.weight}%
              </Typography>
              <IconButton onClick={() => removeActivity(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}

        {formData.activities.length > 0 && (
          <Typography color={totalWeight === 100 ? 'success.main' : 'error.main'}>
            Peso total: {totalWeight}%
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={totalWeight !== 100 || formData.activities.length === 0}
        >
          Crear Plan
        </Button>
      </Stack>
    </Box>
  );
} 