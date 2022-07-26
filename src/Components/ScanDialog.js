import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
// import { createTheme } from '@mui/material/styles'
import createPalette from '@mui/material/styles/createPalette'
import { FormControl, InputLabel, Select, MenuItem, NativeSelect, OutlinedInput as MuiOutlinedInput, LinearProgress } from '@mui/material';
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { makeStyles, ThemeProvider, withStyles } from '@mui/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const OutlinedInput = withStyles((theme) => ({
  notchedOutline: {
    borderColor: "#A3E635 !important",
  }
}))(MuiOutlinedInput);

const useStyles = makeStyles((theme) => ({
  select: {
    color: "white",
  },
  icon: { color: "white" },
  label: { color: "white" },
  list: {
        backgroundColor: '#0A122A',
        color: 'white',
        paddingTop: 0,
        paddingBottom: 0,
        "& li": {
          fontWeight: 200,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: "12px"
        },
        "& li.Mui-selected": {
          color: "#0A122A",
          background: "#A3E635"
        },
        "& li.Mui-selected:hover": {
          background: "#A3E635"
        },
        "& li:hover": {
          background: '#0c1636'
        }
    }
}));

var color = 'red';


const ScanDialog = ({ open, handleScan, handleCancel, interfaces, addDevice, selectDevice, scanStart, setOpen, setActiveInterface }) => {

  const classes = useStyles();
  //console.table(interfaces);

  const menuProps = {
    classes: {
      list: classes.list,
      paper: classes.paper
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center"
    }
    // getContentAnchorEl: null
  };


  const [selectedInterface, setSelectedInterface] = React.useState("0.0.0.0");

  const [loading, setLoading] = React.useState(false);

  const handleChange = (event) => {
    //console.log(event.target.value);
    setSelectedInterface(event.target.value);
  };

  const menuItems = interfaces.map(item => (
    <MenuItem key={item.address} value={item.address}>{item.interface}: {item.address}</MenuItem>
  ));
  
  const addDevices = () => {
    // Start loading
    selectDevice({});
    scanStart();
    setLoading(true);
    window.bacnet.whoIs(selectedInterface, (response) => {
      
      
        setActiveInterface(selectedInterface);
        // TODO:
        // Fetch devices name and represent them that way (*but keep the IP as tooltip)
        //console.log(response);

        let devices = []; // Array that stores the devices

        var i = 2;
        response.forEach((item) => {

            // New object for each device in the response
            let device = {};

            // //console.log(item);
            
            // Formatting so it is more readable
            device.address = item.header.sender.address;
            device.forwarded = item.header.sender.forwardedFrom;
            device.deviceId = item.payload.deviceId;
            device.maxApdu = item.payload.maxApdu;
            device.segmentation = item.payload.segmentation;
            device.vendorId = item.payload.vendorId;
            device.apduType = item.header.apduType;
            device.confirmedService = item.header.confirmedService;
            device.expectingReply = item.header.expectingReply;
            device.func = item.header.func;
            device.nodeId = i;
            device.info = {};

            devices.push(device); // Adding the new device to the array

            i++;

        })
        
        addDevice(devices); // Propagating the changes

        // End Loading
        setOpen(false);
        setTimeout(() => {
          setLoading(false);
        }, 500);
    });
  }

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
          },
        }}
        sx={{ backdropFilter: 'blur(8px)', transitionProperty: 'all', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '250ms' }}
      >
        <DialogTitle sx={{ color: 'white' }}>{<span>Scan</span>}</DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <DialogContentText sx={{ color: 'white' }}>
            {<span>To initiate a device scanning, select the interface that you would like to scan on and click <b>SCAN</b>. To cancel just click on <b>CANCEL</b>.</span>}
          </DialogContentText>
          <br></br>
          <br></br>
          <FormControl fullWidth>
            <InputLabel id="interface-select-label" style={{ backgroundColor: '#0c1636', color: 'white' }} className={classes.label}>Interface&nbsp;</InputLabel>
            <Select
              input={<OutlinedInput label="Interface" />}
              classes={{
                select: classes.select,
                icon: classes.icon,
              }}
              className={classes.select}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedInterface}
              defaultValue={'0.0.0.0'}
              color='success'
              label="Age"
              onChange={handleChange}
              MenuProps={menuProps}
              sx={
                {
                '.MuiSelect-icon': {
                color: 'white'
                  },
                ".MuiSelect-outlined":{
                      color: 'white'
                },
            }}
              variant='filled'
              inputProps={{
                classes: {
                    // icon: classes.icon,
                    root: classes.root,
                    select: classes.select
                },
              }}
              SelectDisplayProps={{
                style: {
                  color: 'white',
                  fontFamily: 'League Spartan',
                }
              }}
            >
              {
                menuItems
              }
            </Select>
        </FormControl>
        </DialogContent>
        <DialogActions style={loading ? { display: 'flex', justifyContent: 'center' } : {}}>
          {
            !loading ? 
            <>
              <Button onClick={handleCancel} variant='outlined' style={{ borderColor: 'red', color: 'red' }}>Cancel</Button>
              <Button onClick={addDevices} cariant='contained' style={{ backgroundColor: '#A3E635', color: '#0c1636'}}>Scan</Button>
              {/* <Button onClick={() => setLoading(true)} cariant='contained' style={{ backgroundColor: '#A3E635', color: '#0c1636'}}>Scan</Button> */}
            </>
            :
            <>
              <LinearProgress 
                sx={{ 
                  backgroundColor: 'transparent', 
                  color: '#A3E635', 
                  width: '95%',  
                  borderRadius: '20px', 
                  // border: '1px solid #A3E635',
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: `#A3E635`
                  }
                }}
              />
              <br></br>
              <br></br>
            </>
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ScanDialog