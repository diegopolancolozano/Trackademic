import subjectsManager from '../services/subjectsManager';
import SubjectCard from './SubjectCard'
import '../css/SubjectCardContainer.css'
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import AddSubject from './AddSubjectModal';
import ReloadSubjectContext from '../contexts/ReloadSubjectContext'

const SubjectCardContainer = () => {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);


    const reloadSubjectCallback = useCallback(async () => {
        const updateSubjects = async () => {
            const subjectList = await subjectsManager.getSubjects();

            setSubjects(subjectList)
            setLoading(false);
        }
        updateSubjects();
        console.log("YOU CALL ME")
    }, []);

    useEffect(() => {
        reloadSubjectCallback();
    }, [reloadSubjectCallback])
    if (loading) {
        return <div>Obteniendo materias...</div>;
    }

    return (
        <div>
            <ReloadSubjectContext.Provider value={reloadSubjectCallback}>
                <div style={{ textAlign: 'center' }}>
                    <AddSubject />
                </div>
            </ReloadSubjectContext.Provider>


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