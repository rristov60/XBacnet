// import logo from './logo.svg';
import './App.css';
// import Button from '@mui/material/Button';
import  Logo  from './Assets/Logo.svg'
import { useState } from 'react'
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
// let devices = [];

// const getData = () => { 
//   window.testAPI.whoIs((data) => {
//     // devices = data;
//     console.log('From Scan:', data)
//     // return event.data;
//   })
// }


function App() {

  const [scannedDevices, setDevices] = useState([
    // {
    // header: {func: 11, sender: { address: 'blabbla'}}
    // }
  ]);

  const [selectedDevice, setSelectedDevice] = useState({});

  const [selectedVariable, setSelectedVariable] = useState({});

  const scanDevices = (theDevices) => {
    setDevices(theDevices);
    console.log(scannedDevices);
  }

  const scanStart = () => {
    setDevices([]);
    setSelectedVariable({});
    setSelectedDevice({});
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
  }

  const selectDevice = (theDevice) => {
      var selected = scannedDevices.filter(x => (x.address === theDevice.address && x.deviceId === theDevice.deviceId));

      if(selected.length > 0)
        setSelectedDevice(selected[0]);
      else
        setSelectedDevice({});      

      console.log('The Selected Device: ', selected);
  }

  return (
      <div className="App" style={{ backgroundColor: '#0A122A' }}>
        <header style={{ backgroundColor: '#0A122A',  width: '100%', position: 'sticky'}}>
            <img src={Logo} style={{ height: 32,  marginTop: 7 }} draggable={false}/>
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
          {/* <Grid item xs={12} style={{padding: 0}}>
              <header  style={{ backgroundColor: 'transparent' }}>
                <img src={Logo} style={{ height: 32,  marginTop: 7 }} draggable={false}/>
                <br></br>
              </header>
          </Grid> */}
          <Grid item xs={3}>
            <TheCard item={<TreeDevices devices={scannedDevices} updateDevices={updateDevice} selectDevice={selectDevice}/>} heading='Devices'/>
            {/* <TheCard/> */}
            {/* <ContextMenu items={<Scan addDevice={scanDevices}/>}/> */}
          </Grid>
          <Grid item xs={5}>
            <TheCard heading='COV Subscriptions / Alarms / Periodic Polling' item={<COVTable/>}/>
          </Grid>
          <Grid item xs={4}>
            {/* <Devices devices={scannedDevices}/> */}
            {/* <TheCard item={<Devices devices={scannedDevices}/>} heading='Explorer'/> */}
            <TheCard item={<ExplorerTable variable={selectedVariable}/>} heading='Explorer'/>
            {/* <TheCard item={<EditableTable/>} heading='Exporer'/> */}
          </Grid>
          {/* <Grid item xs={6}>
            <TreeDevices devices={scannedDevices}/>
          </Grid> */}
          <Grid item xs={3}>
              <TheCard heading='Variables' item={<TreeVariables device={selectedDevice} updateDevice={updateDevice} selectVariable={selectVariable}/>}/>
            {/* <TheCard heading='Variables' item={<TreeVariables device={device}/>}/> */}
          </Grid>
          <Grid item xs={9}>
            {/* <TheCard item={<Charts/>} heading='Variable Graph'/> */}
            <Typography style={{ color: 'white', fontFamily: 'League Spartan'}}>Variable Graph</Typography>
            <Card style={{ boxShadow: 'none' , background: '#0c1636', height: '40vh', overflow:'auto'}}>
              {/* CardContent to store the item */}
                <br></br>
                <Charts/>
                {/* <AlertDialog/> */}
                {/* <Dialog/> */}
            </Card>
            
          </Grid>

          {/* Bottom Navigation */}
          {/* <Grid item xs={12} style={{ borderTop: '1px solid #A3E635', marginTop: 0, marginLeft: 20, padding: 0, height: '7vh'}}> */}
          <Grid item xs={12}>
            <br/>
            {/* <SimpleBottomNavigation/> */}
            <Footer children={<Scan addDevice={scanDevices} selectDevice={selectDevice} scanStart={scanStart}/>}/>
          </Grid>
          
        </Grid>
      </div>
  );
}

export default App;
