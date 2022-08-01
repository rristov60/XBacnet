import Button from '@mui/material/Button';

const TheButton = ({ clickEvent, theVariant, text }) => {
  return (
    <Button onClick={clickEvent} variant={theVariant} style={{ backgroundColor: '#A3E635', color: '#0A122A'}}>{text}</Button>
  )
}

TheButton.defaultProps = {
    clickEvent: () => {},
    theVariant: 'contained'
};

export default TheButton