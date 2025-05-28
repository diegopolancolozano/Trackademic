import Plan from "./Plan"
import { Stack, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function PlansContainer() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleCreatePlan = () => {
    navigate(`/subjects/${courseId}/plans/create`);
  };

  return (
    <Stack spacing={3}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreatePlan}
        sx={{ alignSelf: 'flex-end' }}
      >
        Crear nuevo plan
      </Button>
      <Plan />
    </Stack>
  );
}