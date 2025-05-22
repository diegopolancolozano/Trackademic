import { Card, CardHeader, CardContent, CardActions, Button, Typography } from '@mui/material';
import { supabase } from '../services/supabaseClient';

function CourseBox({ course }) {
    const handleEnroll = async () => {
    try {
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data?.user) {
            
            alert("Por favor, inicia sesión antes de inscribirte.");
            return;
        }

        const userId = data.user.id;

        const { error } = await supabase.from('registerCourse').insert([
            {
                profile_id: userId,
                subject_id: course.id,
            }
        ]);

        if (error) throw error;

        alert("Inscripción exitosa en el curso!");
    } catch (error) {
        console.error("Error inscribiéndose en el curso:", error.message);
        alert("Hubo un error al intentar inscribirte en el curso.");
    }
};


    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardHeader
                title={course.name}
                subheader={"Código: " + course.code}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {course.code}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleEnroll}>Inscribirse</Button>
                <Button size="small" color="secondary">Examinar</Button>
            </CardActions>
        </Card>
    );
}

export default CourseBox;
