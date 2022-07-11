import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Scan from './Scan';

const scanDevices = () => {
  console.log('scan');
}

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box>
      {/* <BottomNavigation
        showLabels
        value={value}
        style={{ background: 'transparent',}}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >            
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation> */}
      <Scan addDevice={scanDevices}/>
    </Box>
  );
}
