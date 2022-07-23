import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
// import { createTheme } from '@mui/material/styles'
import createPalette from '@mui/material/styles/createPalette'
import { FormControl, InputLabel, Select, MenuItem, NativeSelect, OutlinedInput as MuiOutlinedInput } from '@mui/material';
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

// const useStyles = makeStyles(() => ({
//   formControl: {
//     "& .MuiInputBase-root": {
//       color: "#A3E635",
//       borderColor: "#A3E635",
//       borderWidth: "1px",
//       borderStyle: "solid",
//       // borderRadius: "100px",
//       minWidth: "120px",
//       justifyContent: "center"
//     },
//     "& .MuiSelect-select.MuiSelect-select": {
//       paddingRight: "0px"
//     },
//   },
//   select: {
//     width: "auto",
//     fontSize: "12px",
//     "&:focus": {
//       backgroundColor: "transparent",
//       color: 'white'
//     },
//     "&:before": {
//       borderColor: "red",
//       color: 'white'
//     },
//     "& fieldset": {
//       backgroundColor: 'red',
//       color: 'white'
//     },
//     "&:focus": {
//       // border: '2px solid red',
//       color: 'white'
//       // ring
//     },
//     '&:not(.Mui-disabled):hover::before': {
//       borderColor: 'white',
//   },
//   },
//   // selectIcon: {
//   //   position: "relative",
//   //   color: "#6EC177",
//   //   fontSize: "14px"
//   // },
//   paper: {
//     // borderRadius: 20,
//     marginTop: 8
//   },
//   list: {
//     backgroundColor: '#0A122A',
//     color: 'white',
//     paddingTop: 0,
//     paddingBottom: 0,
//     "& li": {
//       fontWeight: 200,
//       paddingTop: 8,
//       paddingBottom: 8,
//       fontSize: "12px"
//     },
//     "& li.Mui-selected": {
//       color: "#0A122A",
//       background: "#A3E635"
//     },
//     "& li.Mui-selected:hover": {
//       background: "#A3E635"
//     },
//     "& li:hover": {
//       background: '#0c1636'
//     }
//   }
// }));

const ScanDialog = ({ open, handleScan, handleCancel, interfaces }) => {

  // const [interfaces, setInterfaces] = useState([]);
  const classes = useStyles();
  console.table(interfaces);

  // const classes = useStyles();

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

  // console.log(interfaces);

  // const getInterfaces = () => {
  //   window.network.showInterfaces((response) => {
  //     var newInterfaces = [];
  //       // Iterate through each reponse (the response returns object with keys that are interface names)
  //       Object.keys(response).forEach(data => {
  //           // Loop through each interface addresses
  //           response[data].forEach((theInterface) => { 
  //               // Filter the valid IPv4 addresses
  //               if(theInterface.family == 'IPv4') {

  //                   if(theInterface.address != '127.0.0.1') {
  //                       // Construct object that is going to be displayed
  //                       var theInterface = {
  //                           interface: data,
  //                           address: theInterface.address,
  //                           internal: theInterface.internal,
  //                           mac: theInterface.mac
  //                       };
  //                       // Push the object array that is later going to be dispalyed in front-end
  //                       newInterfaces.push(theInterface);
  //                   }

  //               }
  //           })
  //       });
  //       // setInterfaces(newInterfaces);
  //       // console.log('Interfaces:', newInterfaces)
  //   })
  // }

  // console.log('Interfaces', interfaces);

  const [selectedInterface, setSelectedInterface] = React.useState("0.0.0.0");

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedInterface(event.target.value);
  };

  const menuItems = interfaces.map(item => (
    <MenuItem value={item.address}>{item.interface}: {item.address}</MenuItem>
  ));
  

  return (
    <div>
      {/* <MuiThemeProvider theme={theme1}> */}
      <Dialog open={open} onClose={handleScan}
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
        <DialogTitle sx={{ color: 'white' }}>{<span>Scan</span>}</DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <DialogContentText sx={{ color: 'white' }}>
            {<span>To scan change the field and click on SAVE. To discard the changes and keep the current value click CANCEL.</span>}
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
              // IconComponent={ExpandMoreRoundedIcon}
              // classes={{
              //   select: classes.select,
              //   icon: classes.selectIcon
              // }}
              sx={
                {
                '.MuiSelect-icon': {
                color: 'white'
                  },
                ".MuiSelect-outlined":{
                      color: 'white'
                },
            }}
              // sx={{
              //   // "& label.Mui-focused": {
              //   //   color: "#A3E635"
              //   // },
              //   // "& .MuiInputLabel-root": {
              //   //   "&.Mui-focused fieldset": {
              //   //     border: '1px solid #A3E635'
              //   //   },
              //   //   "&:hover fieldset": {
              //   //     border: '1px solid #A3E635' 
              //   //   },
              //   //   "& fieldset": {
              //   //     border: '1px solid white'
              //   //   }
              //   // }
              // }}
              // sx={{
                
                // "& label.MuiSelect-outlined": {
                //   color: "#A3E635",
                //   backgroundColor: 'red'
                // },
                // "& .MuiSelect-outlined": {
                //   border: '1px solid red'
                // },
                // "& .MuiSelect-root": {
                //   "&.Mui-focused fieldset": {
                //     border: '1px solid #A3E635',
                //     backgroundColor: 'red'
                //   },
                //   "&:hover fieldset": {
                //     border: '1px solid #A3E635' 
                //   },
                //   "& fieldset": {
                //     border: '1px solid white'
                //   }
                // }
              // }}
              variant='filled'
              inputProps={{
                classes: {
                    // icon: classes.icon,
                    root: classes.root,
                    select: classes.select
                },
              }}
              // disableUnderline
              // InputProps={{
              //   style: {
              //     color: 'white',
              //     fontFamily: 'League Spartan'
              //   }
              // }}
              // MenuProps={{
              //   style: {
              //     backgroundColor: 'red'
              //   }
              // }}
              SelectDisplayProps={{
                style: {
                  color: 'white',
                  fontFamily: 'League Spartan',
                  // backgroundColor: 'red'
                }
              }}
            >
              {/* <> */}
              {
                menuItems
              }
                {/* <MenuItem value={'Riste'}>Riste</MenuItem>
                <MenuItem value={'Petar'}>Petar</MenuItem>
                <MenuItem value={'Trahcge'}>Trajche</MenuItem> */}
              {/* </> */}
              {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
        </FormControl>
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
          <Button onClick={handleCancel} variant='outlined' style={{ borderColor: 'red', color: 'red' }}>Cancel</Button>
          <Button onClick={handleScan} cariant='contained' style={{ backgroundColor: '#A3E635', color: '#0c1636'}}>Scan</Button>
        </DialogActions>
      </Dialog>
      {/* </MuiThemeProvider> */}
    </div>
  )
}

export default ScanDialog