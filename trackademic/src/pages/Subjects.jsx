import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';

import SubjectCardContainer from '../components/SubjectCardContainer'



export default function Subjects() {
  
  
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h5">Materias disponibles </Typography>
        <SubjectCardContainer/>
        
        
      </Container>
    </>
  );
}
