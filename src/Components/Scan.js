import { Button, CircularProgress, LinearProgress, Toolbar, Tooltip, Zoom } from '@mui/material'
import { useState } from 'react'
import ScanDialog from './ScanDialog';

const Scan = ({ addDevice, selectDevice, scanStart, setActiveInterface }) => {

    const [loading, setLoading] = useState(false);

    const [interfaces, setInterfaces] = useState([]);

    const [open, setOpen] = useState(false);


    const handleScan = () => {
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    const openDialog = () => {
        // setOpen(true);
        setInterfaces([]);
        var newInterfaces = [{
            address: '0.0.0.0',
            interface: 'all'
        }];
        window.network.showInterfaces((response) => {
              // Iterate through each reponse (the response returns object with keys that are interface names)
              Object.keys(response).forEach(data => {
                  // Loop through each interface addresses
                  response[data].forEach((theInterface) => { 
                      // Filter the valid IPv4 addresses
                      if(theInterface.family == 'IPv4') {
      
                          if(theInterface.address != '127.0.0.1') {
                              // Construct object that is going to be displayed
                              var theInterface = {
                                  interface: data,
                                  address: theInterface.address,
                                  internal: theInterface.internal,
                                  mac: theInterface.mac
                              };
                              // Push the object array that is later going to be dispalyed in front-end
                              newInterfaces.push(theInterface);
                            //   setInterfaces([...interfaces, theInterface]);
                          }
      
                      }
                  })
              });
              console.log('Interfaces:', interfaces)
            //   setTimeout(() => {
                setOpen(true);
            //   }, 2000);
              setInterfaces(newInterfaces);
            })
    }
    
    // const addDevices = () => {
    //     // Start loading
    //     selectDevice({});
    //     scanStart();
    //     setLoading(true);
    //     window.testAPI.whoIs((response) => {


    //         // TODO:
    //         // Fetch devices name and represent them that way (*but keep the IP as tooltip)
    //         console.log(response);

    //         let devices = []; // Array that stores the devices

    //         var i = 2;
    //         response.forEach((item) => {

    //             // New object for each device in the response
    //             let device = {};

    //             // console.log(item);
                
    //             // Formatting so it is more readable
    //             device.address = item.header.sender.address;
    //             device.forwarded = item.header.sender.forwardedFrom;
    //             device.deviceId = item.payload.deviceId;
    //             device.maxApdu = item.payload.maxApdu;
    //             device.segmentation = item.payload.segmentation;
    //             device.vendorId = item.payload.vendorId;
    //             device.apduType = item.header.apduType;
    //             device.confirmedService = item.header.confirmedService;
    //             device.expectingReply = item.header.expectingReply;
    //             device.func = item.header.func;
    //             device.nodeId = i;

    //             devices.push(device); // Adding the new device to the array

    //             i++;

    //         })
            
    //         addDevice(devices); // Propagating the changes

    //         // End Loading
    //         setLoading(false);
    //     });
    // }

  return (
    <>
    {
        !loading ? 
            // If there isn't a scan running in the momment
            <>
                <Tooltip title='Scan for devices' TransitionComponent={Zoom} arrow>
                    {/* <Button onClick={addDevices} variant="contained" style={{ backgroundColor: '#A3E635', color: '#0A122A' }}>
                        Scan
                    </Button> */}
                    <Button onClick={openDialog} variant="contained" style={{ backgroundColor: '#A3E635', color: '#0A122A' }}>
                        Scan
                    </Button>
                </Tooltip>
                <ScanDialog open={open} setOpen={setOpen} handleScan={handleScan} interfaces={interfaces} handleCancel={handleCancel} addDevice={addDevice} selectDevice={selectDevice} scanStart={scanStart} setActiveInterface={setActiveInterface}/>
            </>
            :
            // Progress if scan is running in the momment            
            <CircularProgress style={{ color: '#A3E635'}} disableShrink/>
            // <LinearProgress style={{ color: '#A3E635'}} />
            // <>
            //     <div>
            //         <LinearProgress style={{ backgroundColor: '#A3E635', color: '#A3E635', width: '25%'}}/>
            //     </div>
            // </>
    }
    </>
  )
}

export default Scan