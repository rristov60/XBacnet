import "./App.css";
import { useEffect, useState } from "react";
import Scan from "./Components/Scan";
import TreeDevices from "./Components/TreeDevices";
import { Grid } from "@mui/material";
import TheCard from "./Components/TheCard";
import COVTable from "./Components/COVTable";
import ExplorerTable from "./Components/ExplorerTable";
import TreeVariables from "./Components/TreeVariables";
import Charts from "./Components/Charts";
import { Card, Typography } from "@mui/material";
import Footer from "./Components/Footer";
import SubscribeCOV from "./Components/SusbcribeCOV";

// Just a check variable to make sure the listener is added only once
var listenerExists = false;
var addingSubscription = false;

function App() {
  /* REGISTERING LISTENERS USING useEffect
     Beacause otherways the changes are not propagated properly
  */
  useEffect(() => {
    if (!listenerExists) {
      window.bacnet.COVNotification((data) => {
        var subscription = {
          device: data.header.sender.address,
          type: data.payload.monitoredObjectId.type,
          instance: data.payload.monitoredObjectId.instance,
          value: {
            data: data.payload.values[0].value[0],
            time: Date.now(),
          },
        };

        updateSubscription(subscription);
      });
      listenerExists = true;
    }
  });

  const [scannedDevices, setDevices] = useState([]);

  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const [subscriptions, setSubscriptions] = useState([]);

  const [selectedDevice, setSelectedDevice] = useState({});

  const [selectedVariable, setSelectedVariable] = useState({});

  const [activeInterface, setActiveInterface] = useState("");

  const [lastUpdatedSubscription, setLastUpdatedSubscription] = useState(0);

  const [subscriptionToPlot, setSubscriptionToPlot] = useState({});

  const scanDevices = (theDevices) => {
    setDevices(theDevices);
  };

  const scanStart = () => {
    setDevices([]);
    setSelectedVariable({});
    setSelectedDevice({});
    setSubscriptionToPlot({});
    setSubscriptions([]);
    setActiveSubscriptions([]);
  };

  const getSubscriptions = () => {
    return subscriptions;
  };

  const selectVariable = (variable) => {
    setSelectedVariable(variable);
  };

  const updateDevice = (theDevice) => {
    // Filter and update the appropriate device :))
    // Also try to see if there is an k=lock for this operation so it is not utilized by mutlitple
    // operations at the same time
    setDevices(
      scannedDevices.map((device) =>
        device.address === theDevice.address &&
        device.deviceId === theDevice.deviceId
          ? theDevice
          : device
      )
    );
  };

  const selectDevice = (theDevice) => {
    var selected = scannedDevices.filter(
      (x) =>
        x.address === theDevice.address && x.deviceId === theDevice.deviceId
    );

    if (selected.length > 0) setSelectedDevice(selected[0]);
    else setSelectedDevice({});
  };

  const addSubscription = (subscription) => {
    setActiveSubscriptions([...activeSubscriptions, subscription]);
  };

  // Remove the subscription from the subscriptions
  const removeSubscription = (subscription) => {
    setActiveSubscriptions(
      activeSubscriptions.filter(
        (x) =>
          x.device != subscription.device ||
          x.type != subscription.type ||
          x.instance != subscription.instance
      )
    );
  };

  // Updating list of COV subscriptions
  const updateSubscription = (theSubscription) => {
    var exists = subscriptions.filter(
      (x) =>
        x.device == theSubscription.device &&
        x.type == theSubscription.type &&
        x.instance == theSubscription.instance
    );

    // Checking if subscription exsists for the specified object
    if (exists.length == 0) {
      var newSubscrptions = subscriptions;
      delete theSubscription.time;
      newSubscrptions.push(theSubscription);
      setSubscriptions(newSubscrptions);
      setLastUpdatedSubscription(Date.now());
    } else {
      if (!addingSubscription) {
        var newSubscrptions = subscriptions;

        if (exists[0].values == undefined) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values = [];
        }

        if (exists[0].values.length == 0) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values.push(
            theSubscription.value
          );
          setSubscriptions(newSubscrptions);
          setLastUpdatedSubscription(Date.now());
        } else if (
          exists[0].values[exists[0].values.length - 1].data.value !=
          theSubscription.value.data.value
        ) {
          newSubscrptions[subscriptions.indexOf(exists[0])].values.push(
            theSubscription.value
          );
          setSubscriptions(newSubscrptions);
          setLastUpdatedSubscription(Date.now());
        }
      }
    }
  };

  return (
    <div className="App" style={{ backgroundColor: "#0A122A" }}>
      <header
        style={{
          backgroundColor: "transparent",
          width: "100%",
          position: "sticky",
        }}
        className="header"
      >
        <br></br>
        <br></br>
      </header>
      <Grid
        container
        style={{
          minWidth: "100%",
          height: "100%",
          paddingTop: 10,
          paddingLeft: 25,
          paddingRight: 25,
        }}
        spacing={2}
      >
        <Grid item xs={3}>
          {/* Devices tree */}
          <TheCard
            item={
              <TreeDevices
                devices={scannedDevices}
                updateDevices={updateDevice}
                selectDevice={selectDevice}
              />
            }
            heading="Devices"
          />
        </Grid>
        <Grid item xs={5}>
          {/* COV Subscription table */}
          <TheCard
            heading="COV Subscriptions"
            item={
              <COVTable
                subscriptions={subscriptions}
                activeSubscriptions={activeSubscriptions}
                setSubscriptionToPlot={setSubscriptionToPlot}
              />
            }
          />
        </Grid>
        <Grid item xs={4}>
          {/* Explorer table */}
          <TheCard
            item={
              <ExplorerTable
                variable={selectedVariable}
                device={selectedDevice}
                updateSubscription={updateSubscription}
              />
            }
            heading="Explorer"
          />
        </Grid>
        <Grid item xs={3}>
          {/* Objects tree */}
          <TheCard
            heading="Objects"
            item={
              <TreeVariables
                device={selectedDevice}
                updateDevice={updateDevice}
                selectVariable={selectVariable}
              />
            }
          />
        </Grid>
        <Grid item xs={9}>
          {/* COV value graph */}
          <Typography style={{ color: "white", fontFamily: "League Spartan" }}>
            COV Value Graph
          </Typography>
          <Card
            style={{
              boxShadow: "none",
              background: "#0c1636",
              height: "40vh",
              overflow: "auto",
            }}
          >
            <br></br>
            <Charts
              subscriptions={subscriptions}
              activeSubscriptions={activeSubscriptions}
              subscriptionToPlot={subscriptionToPlot}
            />
          </Card>
        </Grid>

        {/* Bottom Navigation */}
        <Grid item xs={12}>
          <br />
          <Footer
            children={
              <div style={{ display: "flex", justifyContent: "end" }}>
                <SubscribeCOV
                  variable={selectedVariable}
                  device={selectedDevice}
                  updateDevice={updateDevice}
                  addSubscription={addSubscription}
                  removeSubscription={removeSubscription}
                />
                <div style={{ width: "3%" }}></div>
                <Scan
                  addDevice={scanDevices}
                  selectDevice={selectDevice}
                  scanStart={scanStart}
                  setActiveInterface={setActiveInterface}
                />
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
