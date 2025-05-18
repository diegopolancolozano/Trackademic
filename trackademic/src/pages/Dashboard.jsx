// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Typography, Container, CircularProgress, Button, Box } from '@mui/material';

export default function Dashboard() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id;
    if (!userId) {
      window.location.href = '/';
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (data) setFullName(data.full_name);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {fullName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Este es tu panel de control.
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
}
