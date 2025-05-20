import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Typography, Container, CircularProgress, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import {user} from '../services/infoUser'

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

    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (data) setFullName(data.full_name);
    setLoading(false);
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
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Bienvenido, {fullName}
        </Typography>
        <Typography>Este es tu panel de control.</Typography>
      </Container>
    </>
  );
}
