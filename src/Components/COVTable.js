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

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        // amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        // amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset', borderColor: 'red', fontFamily: 'League Spartan' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            sx={{ color: 'white'}}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'white' }}>
          {row.name}
        </TableCell>
        <TableCell align="right" sx={{ color: 'white' }}>{row.calories}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.fat}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.carbs}</TableCell>
        <TableCell align="right" sx={{ color: 'white'}}>{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#0d1b42', border: 'unset' }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1  }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ color: 'white', fontFamily: 'League Spartan'}}>
                History
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
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" sx={{ color: 'white', fontFamily: 'League Spartan'}}>
                        {historyRow.date}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontFamily: 'League Spartan' }}>{historyRow.customerId}</TableCell>
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

// Table for COV Subscriptions / Alarams / Period Polling
export default function COVTable() {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent'}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: 'white', fontFamily: 'League Spartan'}}>Device</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Object&nbsp;ID</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Name</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Value</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontFamily: 'League Spartan'}}>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Actual DATA */}
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
