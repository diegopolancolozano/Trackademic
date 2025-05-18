import { Box, Container } from '@mui/material';

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        padding: 2
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
