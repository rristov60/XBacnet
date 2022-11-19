import { Alert } from "@mui/material";

// Information alert with custom styling

const InfoAlert = ({ text }) => {
  return (
    <Alert
      severity="info"
      sx={{
        backgroundColor: "transparent",
        border: "1px solid #107dbb",
        fontSize: "1rem",
        color: "white",
      }}
    >
      {text}
    </Alert>
  );
};

export default InfoAlert;
