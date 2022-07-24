// import logo from './logo.svg';
import './App.css';
// import Button from '@mui/material/Button';
import  Logo  from './Assets/Logo.svg'
import { useEffect, useState } from 'react'
import Scan from './Components/Scan';
import Devices from './Components/Devices';
import TreeDevices from './Components/TreeDevices';
import { Dialog, Grid } from '@mui/material'
import ContextMenu from './Components/ContextMenu';
import TheCard from './Components/TheCard';
import SimpleBottomNavigation from './Components/SimpleBottomNavigation';
import COVTable from './Components/COVTable';
import ExplorerTable from './Components/ExplorerTable';
import TreeVariables from './Components/TreeVariables';
import Charts from './Components/Charts';
import { Card, CardContent, Typography } from '@mui/material';
import Footer from './Components/Footer';
import AlertDialog from './Components/AlertDialog';
import SubscribeCOV from './Components/SusbcribeCOV';
// let devices = [];

// const getData = () => { 
//   window.testAPI.whoIs((data) => {
//     // devices = data;
//     console.log('From Scan:', data)
//     // return event.data;
//   })
// }

// Just a check variable to make sure the listener is added only once
var listenerExists = false;
var addingSubscription = false;


function App() {
  // setSubscriptions(subscriptions.map((subscription) => {
  //   (subscription.device == theSubscription.device && subscription.type == theSubscription.type && subscription.instance == theSubscription.instance && subscription.values[subscription.values.length - 1] != theSubscription.value) ? 
  //   subscription.values.push(theSubscription.value) : 
  //   subscription
  // }));

  /* REGISTERING LISTENERS USING useEffect
     Beacause otherways the changes are not propagated properly
  */
  useEffect(() => {
    if(!listenerExists) {
      window.testAPI.COVNotification((data) => {
  
        // console.log('Data', data);
  
        var subscription = {
          device: data.header.sender.address,
          type: data.payload.monitoredObjectId.type,
          instance: data.payload.monitoredObjectId.instance,
          value: { 
            data: data.payload.values[0].value[0], 
            time: Date.now()
          },
        };
  
        updateSubscription(subscription);
      })
      listenerExists = true;
    }
  })

  

  const [scannedDevices, setDevices] = useState([]);

  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const [subscriptions, setSubscriptions] = useState([]);

  const [selectedDevice, setSelectedDevice] = useState({});

  const [selectedVariable, setSelectedVariable] = useState({});

  const [activeInterface, setActiveInterface] = useState('');

  const [lastUpdatedSubscription, setLastUpdatedSubscription] = useState(0);

  const [subscriptionToPlot, setSubscriptionToPlot] = useState({});

  const scanDevices = (theDevices) => {
    setDevices(theDevices);
    console.log(scannedDevices);
  }

  const scanStart = () => {
    setDevices([]);
    setSelectedVariable({});
    setSelectedDevice({});
    setSubscriptionToPlot({});
    setSubscriptions([]);
    setActiveSubscriptions([]);
  }

  const getSubscriptions = () => {
    return subscriptions;
  }

  const selectVariable = (variable) => {
    console.log('Selected var: ', variable);
    setSelectedVariable(variable);
  }

  const updateDevice = (theDevice) => {
    // Filter and update the appropriate device :))
    // Also try to see if there is an k=lock for this operation so it is not utilized by mutlitple
    // operations at the same time
    setDevices(scannedDevices.map((device) => 
                              ( device.address === theDevice.address 
                                && device.deviceId === theDevice.deviceId )
                                  ? theDevice 
                                  : device));
                                  console.log('Devices: ', scannedDevices);
  }

  const selectDevice = (theDevice) => {
      var selected = scannedDevices.filter(x => (x.address === theDevice.address && x.deviceId === theDevice.deviceId));

      if(selected.length > 0)
        setSelectedDevice(selected[0]);
      else
        setSelectedDevice({});      

      console.log('The Selected Device: ', selected);
  }

  const addSubscription = (subscription) => {
    setActiveSubscriptions([...activeSubscriptions, subscription ]);
  }

  const removeSubscription = (subscription) => {
    // newSubscrptions = subscriptions;
    // var newSubscrptions = subscriptions.filter(x => (x.type != subscription.type && x.instance != subscription.instance && x.device != subscription.device));
      // console.log(activeSubscriptions);
      console.log('Remove Subscription: ', subscription);
      setActiveSubscriptions(activeSubscriptions.filter(x => 
        x.device != subscription.device ||
        x.type != subscription.type ||
        x.instance != subscription.instance
      ));
    // Remove the subscription from the subscriptions
    // setSubscriptions(subscriptions.filter(x => (x.type != subscription.type && x.instance != subscription.instance && x.device != subscription.device)));
  }

  const updateSubscription = (theSubscription) => {

    console.log('UPDATING: ', subscriptions);
    var exists = subscriptions.filter(x => x.device == theSubscription.device && x.type == theSubscription.type && x.instance == theSubscription.instance);

    if(exists.length == 0) {
      var newSubscrptions = subscriptions;
      delete theSubscription.time;
      // theSubscription.values = [ theSubscription.value ];
      // delete theSubscription.value;
      newSubscrptions.push(theSubscription);
      // var subscriptionsToUpdate = [...newSubscrptions];
      // Object.assign({}, newSubscrptions)
      setSubscriptions(newSubscrptions);
      setLastUpdatedSubscription(Date.now());
    } else {

      if(!addingSubscription) {

        console.log('Subscriptions in updateSubscription:', subscriptions);
        var newSubscrptions = subscriptions;

        if(exists[0].values == undefined) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values = [];
        }

        if(exists[0].values.length == 0) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values.push(theSubscription.value);
          // var subscriptionsToUpdate = [...newSubscrptions];
          // setSubscriptions(subscriptionsToUpdate);
          // Object.assign({}, newSubscrptions)
          setSubscriptions(newSubscrptions);
          setLastUpdatedSubscription(Date.now());
        }
        else if(exists[0].values[exists[0].values.length - 1].data.value != theSubscription.value.data.value) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values.push(theSubscription.value);
          // var subscriptionsToUpdate = [...newSubscrptions];
          // setSubscriptions(subscriptionsToUpdate);
          // Object.assign({}, newSubscrptions)
          setSubscriptions(newSubscrptions);
          setLastUpdatedSubscription(Date.now());
        }


        // newSubscrptions.forEach((subscription) => {
        //   // console.log('Subscription for: ', subscription);
        //   if((subscription.device == theSubscription.device && subscription.type == theSubscription.type && subscription.instance == theSubscription.instance && (subscription.values[subscription.values.length - 1] != theSubscription.value.value))) {
        //     subscription.values.push(theSubscription.value)
        //     // console.log('IN THE IF')
        //   }
        // })
      }
    }

    // console.log('NewSUBSCRIPTIONS: ', newSubscrptions);

    // setSubscriptions(newSubscrptions);
    // setSubscriptions(newSubscrptions.map((subscription) => {
    //   (subscription.device == theSubscription.device && subscription.type == theSubscription.type && subscription.instance == theSubscription.instance && subscription.values[subscription.values.length - 1] != theSubscription.value) ? 
    //   subscription.values.push(theSubscription.value) : 
    //   subscription
    // }));


    // console.log('Subscriptions', subscriptions);
  }

  return (
      <div className="App" style={{ backgroundColor: '#0A122A' }}>
        <header style={{ backgroundColor: 'transparent',  width: '100%', position: 'sticky'}} className='header'>
          <br></br>
          <br></br>
            {/* <img src={Logo} style={{ height: 32,  marginTop: 7 }} draggable={false}/> */}
        </header>
        <Grid container 
          // justify="flex-start"
          // wrap="nowrap"
          // alignContent="stretch"
          
          style={{
            minWidth: "100%",
            height: "100%",
            paddingTop: 10,
            paddingLeft: 25,
            paddingRight: 25,
            // alignItems: "stretch"
          }}
          spacing={2}
        >
          <Grid item xs={3}>
            {/* Devices tree */}
            <TheCard item={<TreeDevices devices={scannedDevices} updateDevices={updateDevice} selectDevice={selectDevice}/>} heading='Devices'/>
          </Grid>
          <Grid item xs={5}>
            {/* COV Subscription table */}
            <TheCard heading='COV Subscriptions / Alarms / Periodic Polling' item={<COVTable subscriptions={subscriptions} activeSubscriptions={activeSubscriptions} setSubscriptionToPlot={setSubscriptionToPlot}/>}/>
          </Grid>
          <Grid item xs={4}>
            {/* Explorer table */}
            <TheCard item={<ExplorerTable variable={selectedVariable} device={selectedDevice} updateSubscription={updateSubscription}/>} heading='Explorer'/>
          </Grid>
          <Grid item xs={3}>
            {/* Objects tree */}
              <TheCard heading='Objects' item={<TreeVariables device={selectedDevice} updateDevice={updateDevice} selectVariable={selectVariable}/>}/>
          </Grid>
          <Grid item xs={9}>
            {/* COV value graph */}
            <Typography style={{ color: 'white', fontFamily: 'League Spartan'}}>COV Value Graph</Typography>
            <Card style={{ boxShadow: 'none' , background: '#0c1636', height: '40vh', overflow:'auto'}}>
                <br></br>
                <Charts subscriptions={subscriptions} activeSubscriptions={activeSubscriptions} subscriptionToPlot={subscriptionToPlot}/>
            </Card>
            
          </Grid>

          {/* Bottom Navigation */}
          {/* <Grid item xs={12} style={{ borderTop: '1px solid #A3E635', marginTop: 0, marginLeft: 20, padding: 0, height: '7vh'}}> */}
          <Grid item xs={12}>
            <br/>
            {/* <SimpleBottomNavigation/> */}
            <Footer children={
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <SubscribeCOV variable={selectedVariable} device={selectedDevice} updateDevice={updateDevice} addSubscription={addSubscription} removeSubscription={removeSubscription}/>
                  <div style={{ width: '3%' }}>

                  </div>
                  <Scan addDevice={scanDevices} selectDevice={selectDevice} scanStart={scanStart} setActiveInterface={setActiveInterface}/>
                </div>
              }
              activeInterface={activeInterface}
            />
          </Grid>
          
        </Grid>
      </div>
  );
}

export default App;
