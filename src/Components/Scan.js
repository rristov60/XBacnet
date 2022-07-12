import { Button, CircularProgress, LinearProgress } from '@mui/material'
import { useState } from 'react'

const Scan = ({ addDevice }) => {

    const [loading, setLoading] = useState(false);
    
    const addDevices = () => {
        // Start loading
        setLoading(true);
        window.testAPI.whoIs((response) => {


            // TODO:
            // Fetch devices name and represent them that way (*but keep the IP as tooltip)
            console.log(response);

            let devices = []; // Array that stores the devices

            var i = 2;
            response.forEach((item) => {

                // New object for each device in the response
                let device = {};

                // console.log(item);
                
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

                devices.push(device); // Adding the new device to the array

                i++;

            })
            
            addDevice(devices); // Propagating the changes

            // End Loading
            setLoading(false);
        });
    }

  return (
    <>
    {
        !loading ? 
            // If there isn't a scan running in the momment
            <Button onClick={addDevices} variant="outlined" style={{ borderColor: '#A3E635', color: '#A3E635'}}>
                Scan
            </Button>
            :
            // Progress if scan is running in the momment
            <CircularProgress style={{ color: '#A3E635'}} disableShrink/>
            // <LinearProgress style={{ backgroundColor: '#A3E635', color:}}/>
    }
    </>
  )
}

export default Scan