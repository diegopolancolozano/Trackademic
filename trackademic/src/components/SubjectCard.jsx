import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';


/**
 * Displays a card
 * @param {string} props.name
 * @param {string} props.code
 * @returns 
 */
export default function SubjectCard(props) {
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
        <Button size="small" color="primary" >
          Ver planes diponibles
        </Button>
      </CardActions>
    </Card>
  );
}
