import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const InfoDialog = ({ open, closeDialog }) => {

    // const [open, setOpen] = useState(false);

    // const closeDialog = () => {
    //     setOpen(false);
    // }

  return (
    <div>
      <Dialog open={open}
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
        <DialogTitle sx={{ color: 'white' }}>{<span>App info</span>}</DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <DialogContentText sx={{ color: 'white' }}>
            {<span>change the field and click on SAVE. To discard the changes and keep the current value click CANCEL.</span>}
          </DialogContentText>
          <br></br>
          <br></br>
          {/* <FormControl fullWidth>
            <InputLabel id="interface-select-label">Interface</InputLabel>
            <Select
                labelId="interface-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </FormControl> */}
          {/* <TextField
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
            disableUnderline
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
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant='outlined' style={{ borderColor: 'red', color: 'red' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default InfoDialog