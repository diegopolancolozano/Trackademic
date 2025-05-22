import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from 'react-router-dom';

/**
 * Displays a card
 * @param {string} props.name
 * @param {string} props.code
 * @returns 
 */
export default function SubjectCard(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/subjects/${props.code}/plans`);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {props.code}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" color="primary" onClick={handleClick}>
          Ver planes disponibles
        </Button>
      </CardActions>
    </Card>
  );
}
