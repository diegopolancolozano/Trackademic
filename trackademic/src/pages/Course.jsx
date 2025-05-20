import { Typography, Container, CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import CourseBox from '../components/CourseBox';

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('subjects').select('*');
                if (error) {
                    throw error;
                }
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Course Page
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Box display="flex" flexWrap="wrap">
                    {courses.map(course => (
                        <CourseBox key={course.id} course={course} />
                    ))}
                </Box>
            )}
        </Container>
    );
}