import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';
import subjectsManager from '../services/subjectsManager';

export default function EditPlans() {
  subjectsManager.getSubjects()
  
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h5">Agregar o modificar planes (por implementar)</Typography>
      </Container>
    </>
  );
}
