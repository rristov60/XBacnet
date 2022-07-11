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
            var i = 2;
            response.forEach((item) => {
                item.nodeId = i;
                i++;
            })
            
            addDevice(response);

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