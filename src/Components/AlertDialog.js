import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Toast from './Toast';

export default function AlertDialog({ open, handleSave, property, setValueToWrite, handleCancel }) {
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleSave = () => {
  //   setOpen(false);
  // };

  return (
    <div>
      <Dialog open={open} onClose={handleCancel}
        PaperProps={{
          style: {
            backgroundColor: '#0c1636',
            boxShadow: 'none',
            color: 'white',
            padding: 10,
            borderRadius: 10
            // border: '1px solid #A3E635',
          },
        }}
        sx={{ backdropFilter: 'blur(8px)', transitionProperty: 'all', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '250ms' }}
      >
        <DialogTitle sx={{ color: 'white' }}>{<span>Edit {property.name}</span>}</DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <DialogContentText sx={{ color: 'white' }}>
            {<span>To change <b>{property.name}</b> change the field and click on SAVE. To discard the changes and keep the current value click CANCEL.</span>}
          </DialogContentText>
          <br></br>
          <br></br>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={<span>{`${property.name}`}</span>}
            onPointerLeave={(event) => { setValueToWrite({value: event.target.value}) }}
            type="text"
            fullWidth
            // variant="standard"
            // sx={{border: '1px solid #A3E635', borderRadius: 1}}
            sx={{
              "& label.Mui-focused": {
                color: "#A3E635"
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  border: '1px solid #A3E635'
                },
                "&:hover fieldset": {
                  border: '1px solid #A3E635' 
                },
                "& fieldset": {
                  border: '1px solid white'
                }
              }
            }}
            variant='outlined'
            defaultValue={property.value}
            InputProps={{
              style: {
                color: 'white',
                fontFamily: 'League Spartan'
              }
            }}
            InputLabelProps={{
              style: {
                color: 'white',
                fontFamily: 'League Spartan'
                // backgroundColor: 'red'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant='outlined' style={{ borderColor: 'red', color: 'red' }}>Cancel</Button>
          <Button onClick={handleSave} cariant='contained' style={{ backgroundColor: '#A3E635', color: '#0c1636'}}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* <Toast open={toastOpen} message={toastMessage} type={toastType}/> */}
    </div>
  );
}
