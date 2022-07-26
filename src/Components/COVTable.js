import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoAlert from './InfoAlert';
import Toast from './Toast';

function createData(device, objectType, instance, value, time, history, OBJECT_NAME) {
  return {
    device,
    objectType,
    instance,
    value,
    time,
    // history: [
    //   {
    //     date: '2020-01-05',
    //     customerId: '11091700',
    //     // amount: 3,
    //   },
    //   {
    //     date: '2020-01-02',
    //     customerId: 'Anonymous',
    //     // amount: 1,
    //   },
    // ],
    history,
    OBJECT_NAME
  };
}

function Row({ row, setSubscriptionToPlot }) {
  // const { row, setSubscriptionToPlot } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset', borderColor: 'red', fontFamily: 'League Spartan' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            sx={{ color: 'white'}}
            onClick={() => {
              setOpen(!open);
              setSubscriptionToPlot(row);
              //console.log('Row', row);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'white' }}>
          {row.device}
        </TableCell>
        <TableCell align="right" sx={{ color: 'white' }}>{row.objectType}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.instance}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.value}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.time}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#0d1b42', border: 'unset' }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1  }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ color: 'white', fontFamily: 'League Spartan'}}>
                {row.OBJECT_NAME}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontFamily: 'League Spartan'}}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontFamily: 'League Spartan'}}>Value</TableCell>
                    {/* <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={convertTimeStampToReadable(historyRow.time)}>
                      <TableCell component="th" scope="row" sx={{ color: 'white', fontFamily: 'League Spartan'}}>
                        {convertTimeStampToReadable(historyRow.time)}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontFamily: 'League Spartan' }}>{historyRow.data.value}</TableCell>
                      {/* <TableCell align="right">{historyRow.amount}</TableCell> */}
                      {/* <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// TODO:
// Adjust these properties in to correspond with the actual values
// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//   }).isRequired,
// };

// These are the values that need to be in the table
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

let listenerExists = false;

const convertTimeStampToReadable = (timestamp) => {
  var date = new Date(timestamp);
  return `${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}:${(date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()}`;
}

// Table for COV Subscriptions / Alarams / Period Polling
const COVTable = ({ subscriptions, activeSubscriptions, setSubscriptionToPlot }) => {

  //console.log(activeSubscriptions);
  var rows=[];
  //console.log('COV Table: ', subscriptions);
  // //console.log('COV TABLE SUBSCRIPTIONS LENGTH: ', subscriptions.length);
  const createRows = () => {
    activeSubscriptions.forEach((subscription) => {
      var currentSubscription = subscriptions.filter(x => x.device == subscription.device && x.type == subscription.type && x.instance == subscription.instance);
      if(currentSubscription.length != 0 && currentSubscription[0].values != undefined) {
        rows.push(createData(currentSubscription[0].device, 
                              currentSubscription[0].type, 
                              currentSubscription[0].instance, 
                              currentSubscription[0].values[currentSubscription[0].values.length - 1].data.value, 
                              // currentSubscription[0].values[currentSubscription[0].values.length - 1].time, 
                              convertTimeStampToReadable(currentSubscription[0].values[currentSubscription[0].values.length - 1].time), 
                              currentSubscription[0].values,
                              subscription.name
                              ));
      }

    })
  }

  createRows();

  return (
    <>
    {
      (activeSubscriptions.length == 0) 
      ?
      <InfoAlert text='No subscriptions !'/>
      :
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent'}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: 'white', fontFamily: 'League Spartan'}}>Device</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Object&nbsp;Type</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Instance</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Value</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Actual DATA */}
          {rows.map((row) => (
            <Row key={row.name} row={row} setSubscriptionToPlot={setSubscriptionToPlot}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    }
    </>
    
  );
}

export default COVTable;
