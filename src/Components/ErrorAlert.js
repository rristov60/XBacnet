import { Alert } from '@mui/material'

// Error alert with custom styling
const ErrorAlert = ({ text }) => {
  return (
    <Alert severity="error" sx={{ backgroundColor: 'transparent', border: '1px solid #d84e4e', fontSize: '1rem', color: 'white' }}>{text}</Alert>
  )
}

export default ErrorAlert