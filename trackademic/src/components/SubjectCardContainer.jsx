import subjectsManager from '../services/subjectsManager';
import SubjectCard from './SubjectCard'
import '../css/SubjectCardContainer.css'
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const SubjectCardContainer = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const updateSubjects = async () => {
            const subjectList = await subjectsManager.getSubjects();
            console.log(subjectList)
            setSubjects(subjectList)
            setLoading(false);
        }
        updateSubjects();

    }, []);

    if (loading) {
        return <div>Obteniendo materias...</div>;
    }

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <Button variant="contained">Agregar materia</Button>
            </div>


            <div className='card-container'>
                {
                    subjects.map(subject => (
                        <div className='card' key={subject.code}>
                            <SubjectCard name={subject.name} code={subject.code} />
                        </div>
                    )
                    )
                }



            </div>

        </div>
    )



};
export default SubjectCardContainer;