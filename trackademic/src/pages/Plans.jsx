import Navbar from '../components/Navbar';
import { Container, Typography } from '@mui/material';
import PlansContainer from '../components/PlansContainer';

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
