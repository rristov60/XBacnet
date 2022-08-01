import { Button, Tooltip, Zoom } from '@mui/material'
import { useState } from 'react'
import Toast from './Toast';
const errorsDescription = require('../Helpers/ErrorsDescription.json');

const SubscribeCOV = ({ variable, device, updateDevice, addSubscription, removeSubscription }) => {

    const [subscribed, setSubscribed] = useState();
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [toastTitle, setToastTitle] = useState('');
  
    
    const subscribeCOV = () => {

        const subscribeObject = {
            typeInstance: {
                type: variable.value.type,
                instance: variable.value.instance
            },
            popertyId: 85
        };

        window.bacnet.subscribeCOV(device, subscribeObject, (response) => {

            if(response == undefined) {

                variable.cov.subscribed = true;

                var subscribedVariable = {
                    device: device.address,
                    type: variable.value.type,
                    instance: variable.value.instance,
                    name: variable.OBJECT_NAME.value
                };

                setToastTitle(`Success`);
                setToastMessage(`Successfully subscribed to COV for: ${variable.OBJECT_NAME.value}!`);
                setToastType('success');
                setToastOpen(true);
                setTimeout(() => {
                    setToastOpen(false);
                }, 1500);

                addSubscription(subscribedVariable);
                updateDevice(device);
            } else {

                var theResponse = `${response}`;

                setToastTitle(`${response}`);

                if(theResponse.includes('BacnetAbort')) {
                    var responseFormatted = theResponse.split(':');
                    var abortReason = responseFormatted[responseFormatted.length - 1];

                    setToastMessage(`${errorsDescription.AbortReason[`${abortReason}`]}!`);
                } else {
                    var responseFormatted = `${response}`;
                    responseFormatted = responseFormatted.substring(
                        responseFormatted.lastIndexOf('(') + 1,
                        responseFormatted.lastIndexOf(')')
                    );

                    if(errorsDescription.ErrorCodes[responseFormatted] != undefined)
                        setToastMessage(`${errorsDescription.ErrorCodes[responseFormatted]}!`);
                    else 
                        setToastMessage(`${response.error}`)
                }
                
                setToastType('error');
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 15000)
            }
        });
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
                }, 1500);

                removeSubscription(unsubscribeVar);
                updateDevice(device);
            } else {
                // Failed to unsubscribe
                var theResponse = `${response}`;

                setToastTitle(`${response}`);

                if(theResponse.includes('BacnetAbort')) {
                    var responseFormatted = theResponse.split(':');
                    var abortReason = responseFormatted[responseFormatted.length - 1];

                    setToastMessage(`${errorsDescription.AbortReason[`${abortReason}`]}!`);
                } else {
                    var responseFormatted = `${response}`;
                    responseFormatted = responseFormatted.substring(
                        responseFormatted.lastIndexOf('(') + 1,
                        responseFormatted.lastIndexOf(')')
                    );
                    setToastMessage(`${errorsDescription.ErrorCodes[responseFormatted]}!`);
                }
                
                setToastType('error');
                setToastOpen(true);
                setTimeout(() => {
                  setToastOpen(false);
                }, 15000)
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
                    <>
                    <Tooltip title='Subscribe to COV for the selected object' TransitionComponent={Zoom} arrow>
                        <Button onClick={subscribeCOV} variant="outlined" style={{ borderColor: '#A3E635', color: '#A3E635'}}>
                            Subscribe COV
                        </Button>
                    </Tooltip>
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
            }
            </>
        }
        <Toast open={toastOpen} message={toastMessage} type={toastType} cov={'true'} title={toastTitle}/>
    </>
  )
}

export default SubscribeCOV