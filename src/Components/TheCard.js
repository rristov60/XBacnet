const { Card, CardContent, Typography } = require("@mui/material");

// Card item from which the whole UI is constructed
const TheCard = ({ item, heading }) => {
  return (
    <>
      {heading == "Explorer" ? (
        <>
          <Typography style={{ color: "white", fontFamily: "League Spartan" }}>
            {heading}
          </Typography>
          <Card
            style={{
              boxShadow: "none",
              background: "#0c1636",
              height: "40vh",
              overflow: "hidden",
            }}
          >
            {/* CardContent to store the item */}
            <CardContent style={{ overflowX: "auto" }}>
              <div style={{ color: "white" }}>{item}</div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Typography style={{ color: "white", fontFamily: "League Spartan" }}>
            {heading}
          </Typography>
          <Card
            style={{
              boxShadow: "none",
              background: "#0c1636",
              height: "40vh",
              overflow: "auto",
            }}
          >
            {/* CardContent to store the item */}
            <CardContent style={{ overflowX: "auto", color: "white" }}>
              {item}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default TheCard;
