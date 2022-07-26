import { Button, CircularProgress, LinearProgress, Toolbar, Tooltip, Zoom } from '@mui/material'
import { useState } from 'react'
import Toast from './Toast';

const SubscribeCOV = ({ variable, device, updateDevice, addSubscription, removeSubscription }) => {

    const [subscribed, setSubscribed] = useState();
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
  
    
    const subscribeCOV = () => {

        // client.subscribeCov('192.168.0.104', { type: 4, instance: 101 },85, false, false, 0, (err) => {
        //     //console.log('SubscribeCOV: ' + err);
        // });
        const subscribeObject = {
            typeInstance: {
                type: variable.value.type,
                instance: variable.value.instance
            },
            popertyId: 85
        };

        window.bacnet.subscribeCOV(device, subscribeObject, (response) => {
            // //console.log('COV Response: ', response);

            if(response == undefined) {

                // //console.log("TheDevice: ", device);
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

                setToastMessage(`Successfully subscribed to COV for: ${variable.OBJECT_NAME.value}!`);
                setToastType('success');
                setToastOpen(true);
                setTimeout(() => {
                    setToastOpen(false);
                }, 1000);

                addSubscription(subscribedVariable);
                updateDevice(device);
            } else {
                // Failed to subscribe
                setToastMessage(`An error occurred: ${response}!`);
                setToastType('error');
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 4000)
            }
        });

        // //console.log("TheDevice: ", device);
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

        window.bacnet.unsubscribeCOV(device, unsubscribeObject, (response) => {;
            if(response == undefined) {
                //console.log('Response Unsusbcribe: ', response);
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

                setToastMessage(`Successfully unsubscribed to COV for: ${variable.OBJECT_NAME.value}!`);
                setToastType('success');
                setToastOpen(true);
                setTimeout(() => {
                    setToastOpen(false);
                }, 1000);

                removeSubscription(unsubscribeVar);
                updateDevice(device);
            } else {
                // Failed to unsubscribe
                setToastMessage(`An error occurred: ${response}!`);
                setToastType('error');
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 4000)
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
            {/* <Toast open={toastOpen} message={toastMessage} type={toastType}/> */}
            {
                (variable?.cov?.subscribed == false || variable?.cov?.subscribed == undefined) ? 
                    // If there isn't a scan running in the momment
                    <>
                    <Tooltip title='Subscribe to COV for the selected object' TransitionComponent={Zoom} arrow>
                        <Button onClick={subscribeCOV} variant="outlined" style={{ borderColor: '#A3E635', color: '#A3E635'}}>
                            Subscribe COV
                        </Button>
                    </Tooltip>
                    {/* <Toast open={toastOpen} message={toastMessage} type={toastType}/> */}
                    </>
                    :
                    // Progress if scan is running in the momment
                    <>
                    <Tooltip title='Unsubscribe to COV for the selected object' TransitionComponent={Zoom} sx={{ backgroundColor: 'transparent' }} arrow>
                        <Button onClick={unSubscribeCOV} variant="outlined" style={{ borderColor: 'red', color: 'red'}}>
                            Unsubscribe COV
                        </Button>
                    </Tooltip>
                    
                    </>
                    // <>
                    //     <div>
                    //         <LinearProgress style={{ backgroundColor: '#A3E635', color: '#A3E635', width: '25%'}}/>
                    //     </div>
                    // </>
            }
            </>
        }
        <Toast open={toastOpen} message={toastMessage} type={toastType} cov={'true'}/>
    </>
  )
}

export default SubscribeCOV