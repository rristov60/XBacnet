import { Button, CircularProgress, LinearProgress, Toolbar, Tooltip, Zoom } from '@mui/material'
import { useState } from 'react'

const SubscribeCOV = ({ variable, device, updateDevice, addSubscription, removeSubscription }) => {

    const [subscribed, setSubscribed] = useState();
    
    const subscribeCOV = () => {

        // client.subscribeCov('192.168.0.104', { type: 4, instance: 101 },85, false, false, 0, (err) => {
        //     console.log('SubscribeCOV: ' + err);
        // });
        const subscribeObject = {
            typeInstance: {
                type: variable.value.type,
                instance: variable.value.instance
            },
            popertyId: 85
        };

        window.testAPI.subscribeCOV(device, subscribeObject, (response) => {
            // console.log('COV Response: ', response);

            if(response == undefined) {

                console.log("TheDevice: ", device);
                variable.cov.subscribed = true;

                var subscribedVariable = {
                    device: device.address,
                    type: variable.value.type,
                    instance: variable.value.instance,
                    name: variable.OBJECT_NAME.value
                    // property: {
                    //     id: 85,
                    //     type: 9
                    // },
                    // values: [
                    //     variable.PRESENT_VALUE
                    // ]
                };

                addSubscription(subscribedVariable);
                updateDevice(device);
            }
        });

        // console.log("TheDevice: ", device);
        // variable.cov.subscribed = true;
        // updateDevice(device);
    }

    const unSubscribeCOV = () => {

        const unsubscribeObject = {
            typeInstance: {
                type: variable.value.type,
                instance: variable.value.instance
            },
            popertyId: 85
        };

        window.testAPI.unsubscribeCOV(device, unsubscribeObject, (response) => {;
            if(response == undefined) {
                console.log('Response Unsusbcribe: ', response);
                variable.cov.subscribed = false;
                
                var unsubscribeVar = {
                    device: device.address,
                    type: variable.value.type,
                    instance: variable.value.instance,
                    property: {
                        id: 85,
                        type: 9
                    },
                    values: [
                        variable.PRESENT_VALUE
                    ]
                };

                removeSubscription(unsubscribeVar);
                updateDevice(device);
            }
        });


    } 

  return (
    <>
        {
            ( Object.keys(variable).length === 0 ) ? 
                <></>
            :
            <>
            {
                (variable?.cov?.subscribed == false || variable?.cov?.subscribed == undefined) ? 
                    // If there isn't a scan running in the momment
                    <Tooltip title='Subscribe to COV for the selected object' TransitionComponent={Zoom} arrow>
                        <Button onClick={subscribeCOV} variant="outlined" style={{ borderColor: '#A3E635', color: '#A3E635'}}>
                            Subscribe COV
                        </Button>
                    </Tooltip>
                    :
                    // Progress if scan is running in the momment
                    <Tooltip title='Unsubscribe to COV for the selected object' TransitionComponent={Zoom} sx={{ backgroundColor: 'transparent' }} arrow>
                        <Button onClick={unSubscribeCOV} variant="outlined" style={{ borderColor: 'red', color: 'red'}}>
                            Unsubscribe COV
                        </Button>
                    </Tooltip>
                    // <>
                    //     <div>
                    //         <LinearProgress style={{ backgroundColor: '#A3E635', color: '#A3E635', width: '25%'}}/>
                    //     </div>
                    // </>
            }
            </>
        }
    </>
  )
}

export default SubscribeCOV