import { Alert } from '@mui/lab'

const ErrorAlert = ({ text }) => {
  return (
    <Alert severity="error" sx={{ backgroundColor: 'transparent', border: '1px solid red', fontSize: '1rem', color: 'white' }}>{text}</Alert>
  )
}

export default ErrorAlert