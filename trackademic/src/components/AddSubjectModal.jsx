import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import subjectsManager from '../services/subjectsManager';
import ReloadSubjectContext from '../contexts/ReloadSubjectContext'
import { useContext, useRef } from 'react';
import SnackBarComponent from './SnackBarComponent';
import SnackbarComponent from './SnackBarComponent';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddSubjectModal() {

  const reloadSubjectCallback = useContext(ReloadSubjectContext);
  const snackbarRef = useRef();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddSubject = async (event) => {
    const form = event.target;
    const code = form['code-input'].value
    const name = form['name-input'].value
    event.preventDefault();
    const result = await subjectsManager.addSubject(code, name);

    if (result == true) {
      snackbarRef.current.openSnackbar({ message: "Materia agregada", severity: "success" });

    } else {
      snackbarRef.current.openSnackbar({ message: "Verifique los campos o que la materia no se haya agregado antes", severity: "error" });
    }

    reloadSubjectCallback();
    handleClose();


  };

  return (
    <div>
      <Button onClick={handleOpen}>Agregar Materia</Button>
      <Modal

        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >

        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
              Agrega materias no listadas
            </Typography>


            <div id="transition-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={handleAddSubject}>

                <Box mt={2}>
                  <TextField
                    id="code-input"
                    label="Codigo"
                    fullWidth
                    required
                  />

                </Box>

                <Box mt={2}>
                  <TextField
                    id="name-input"
                    label="Nombre"
                    fullWidth
                    required
                  />
                </Box>

                <Box mt={2}>
                  <Button variant="contained" fullWidth type="submit" >Agregar</Button>
                </Box>


              </form>



            </div>
          </Box>
        </Fade>
      </Modal>
      <SnackbarComponent ref={snackbarRef} />
    </div>
  );
}
