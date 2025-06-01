// components/ReportCard.jsx
import { Card, CardContent, Typography } from '@mui/material';

export default function ReportCard({ title, children }) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}