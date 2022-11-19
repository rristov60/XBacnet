import { Button, CircularProgress, Tooltip, Zoom } from "@mui/material";
import { useState } from "react";
import ScanDialog from "./ScanDialog";

const Scan = ({ addDevice, selectDevice, scanStart, setActiveInterface }) => {
  const [loading, setLoading] = useState(false);

  const [interfaces, setInterfaces] = useState([]);

  const [open, setOpen] = useState(false);

  const handleScan = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setInterfaces([]);
    var newInterfaces = [
      {
        address: "0.0.0.0",
        interface: "all",
      },
    ];
    window.network.showInterfaces((response) => {
      // Iterate through each reponse (the response returns object with keys that are interface names)
      Object.keys(response).forEach((data) => {
        // Loop through each interface addresses
        response[data].forEach((theInterface) => {
          // Filter the valid IPv4 addresses
          if (theInterface.family == "IPv4") {
            if (theInterface.address != "127.0.0.1") {
              // Construct object that is going to be displayed
              var theInterface = {
                interface: data,
                address: theInterface.address,
                internal: theInterface.internal,
                mac: theInterface.mac,
              };
              // Push the object array that is later going to be dispalyed in front-end
              newInterfaces.push(theInterface);
            }
          }
        });
      });

      setOpen(true);
      setInterfaces(newInterfaces);
    });
  };

  return (
    <>
      {!loading ? (
        // If there isn't a scan running in the momment
        <>
          <Tooltip title="Scan for devices" TransitionComponent={Zoom} arrow>
            <Button
              onClick={openDialog}
              variant="contained"
              style={{ backgroundColor: "#A3E635", color: "#0A122A" }}
            >
              Scan
            </Button>
          </Tooltip>
          <ScanDialog
            open={open}
            setOpen={setOpen}
            handleScan={handleScan}
            interfaces={interfaces}
            handleCancel={handleCancel}
            addDevice={addDevice}
            selectDevice={selectDevice}
            scanStart={scanStart}
            setActiveInterface={setActiveInterface}
          />
        </>
      ) : (
        // Progress if scan is running in the momment
        <CircularProgress style={{ color: "#A3E635" }} disableShrink />
      )}
    </>
  );
};

export default Scan;
