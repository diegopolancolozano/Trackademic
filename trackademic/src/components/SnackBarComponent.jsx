import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarComponent = forwardRef((props, ref) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openSnackbar = useCallback(({ message, severity = "info" }) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useImperativeHandle(ref, () => ({
    openSnackbar,
  }));

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
});

export default SnackbarComponent;
