import { Alert, Box, Snackbar as MuiSnackbar } from '@mui/material'

export function Snackbar({ open, setOpen, severity, label }) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box>
      <MuiSnackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {label}
        </Alert>
      </MuiSnackbar>
    </Box>
  )
}
