const { Card, CardContent, Typography, Box } = require("@mui/material")

// Card item from which the whole UI is constructed
const TheCard = ({ item, heading }) => {
  return (
    <>
      <Typography style={{ color: 'white', fontFamily: 'League Spartan'}}>{heading}</Typography>
      <Card style={{ boxShadow: 'none' , background: '#0c1636', height: '40vh', overflow:'auto'}}>
        {/* CardContent to store the item */}
          <CardContent style={{ overflowX: 'auto' }}>
              <div style={{ color: 'white'}}>
                {item}
              </div>
          </CardContent>
      </Card>
    </>
  )
}

export default TheCard