import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';

import SubjectCardContainer from '../components/SubjectCardContainer'



export default function AddPlans() {
  
  
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h5">Mis cursos </Typography>
        <SubjectCardContainer/>
        
        
      </Container>
    </>
  );
}
