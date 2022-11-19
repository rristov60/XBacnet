import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import packageJson from "../../package.json";

const InfoDialog = ({ open, closeDialog }) => {
  return (
    <div>
      <Dialog
        open={open}
        PaperProps={{
          style: {
            backgroundColor: "#0c1636",
            boxShadow: "none",
            color: "white",
            padding: 10,
            borderRadius: 10,
          },
        }}
        sx={{
          backdropFilter: "blur(8px)",
          transitionProperty: "all",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "250ms",
        }}
      >
        <DialogTitle sx={{ color: "white" }}>
          {<span>App info</span>}
        </DialogTitle>
        <DialogContent sx={{ color: "white" }}>
          <DialogContentText sx={{ color: "white" }}>
            {<span>XBacnet</span>}
          </DialogContentText>
          <DialogContentText sx={{ color: "white" }}>
            {<span>Version {packageJson.version}</span>}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={closeDialog}
            variant="text"
            style={{ borderColor: "red", color: "red" }}
          >
            X
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InfoDialog;
