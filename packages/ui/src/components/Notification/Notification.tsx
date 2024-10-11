import { Snackbar, Alert } from '@mui/material'

interface SnackbarNotificationProps {
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
  open: boolean
  onClose: () => void
}

export const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  message,
  severity,
  open,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
