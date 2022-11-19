import * as React from "react";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import { Box } from "@mui/system";
import { AlertTitle, Alert } from "@mui/material";

function getWidth(type) {
  if (type == "success") return "25%";

  return "35%";
}

const Toast = ({
  open,
  message,
  type,
  cov = "false",
  title = type.charAt(0).toUpperCase() + type.slice(1),
}) => {
  return (
    <>
      {cov == "false" ? (
        <Box sx={{ width: "100%" }}>
          <Slide direction="left" in={open}>
            <Alert
              severity={type}
              sx={{
                mb: 2,
                position: "fixed",
                bottom: 0,
                zIndex: "999999 !important",
                textAlign: "left",
                width: getWidth(type),
                right: 20,
              }}
              variant="filled"
            >
              <AlertTitle>{title}</AlertTitle>
              {message}
            </Alert>
          </Slide>
        </Box>
      ) : (
        <Box sx={{ width: "100%", position: "fixed" }}>
          <Slide direction="right" in={open}>
            <Alert
              severity={type}
              sx={{
                mb: 2,
                position: "fixed",
                bottom: 0,
                zIndex: "999999 !important",
                textAlign: "left",
                width: getWidth(type),
                left: 20,
              }}
              variant="filled"
            >
              <AlertTitle>{title}</AlertTitle>
              {message}
            </Alert>
          </Slide>
        </Box>
      )}
    </>
  );
};
export default Toast;
