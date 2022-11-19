import { Alert } from "@mui/material";

const WarningAlert = ({ text }) => {
  return (
    <Alert
      severity="warning"
      sx={{
        backgroundColor: "transparent",
        border: "1px solid #e68b15",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {text}
    </Alert>
  );
};

export default WarningAlert;
