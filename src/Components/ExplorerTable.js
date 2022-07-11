import * as React from 'react';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import {
  randomTraderName,
} from '@mui/x-data-grid-generator';

export default function ExplorerTable() {

    // const handleRowEditCommit = React.useCallback(
    //     (params) => {
    //         console.log(params)
    //         const id = params.id;
    //         const key = params.field;
    //         const value = params.value; },
    //     []
    // );

    const handleRowEditCommit = (params) => {
        console.log(params);
    }

  return (
    <div style={{ height: '35vh', width: '100%'}}>
      <DataGrid
        rows={rows}
        showColumnRightBorder={true}
        columns={columns}
        sx={{color: 'white', textAlign: 'center', border: 'unset', width: '100%', overflow: 'scroll'}}
        // onCellEditStop={() => {console.log('Stopped Editing the Celld')}}
        // onCellEditStop={handleRowEditCommit}
        // disableSelectionOnClick
        onCellEditCommit={(params) => {
            console.log(params);
        }}
        // onCellFocusOut={(params) => {console.log(params)}}
        hideFooter={true}
        sortModel={undefined}
        // experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const columns = [
  { field: 'BACnetProperty', headerName: 'BACnet Property', width: 190, editable: false, headerAlign: 'center', disableColumnMenu: true, sortable: false },
  { field: 'value', headerName: 'Value', type: 'number', width: 190, editable: true, headerAlign: 'center', disableColumnMenu: true, sortable: false }
];

const rows = [
  {
    id: 'varId|PropertyId',
    BACnetProperty: randomTraderName(),
    value: 25,
  },
  {
    id: 2,
    BACnetProperty: randomTraderName(),
    value: 36,
  },
  {
    id: 3,
    BACnetProperty: randomTraderName(),
    value: 19,
  },
  {
    id: 4,
    BACnetProperty: randomTraderName(),
    value: 19,
  },
  {
    id: 5,
    BACnetProperty: randomTraderName(),
    value: 19,
  },
  {
    id: 6,
    BACnetProperty: randomTraderName(),
    value: 19,
  },
  {
    id: 7,
    BACnetProperty: randomTraderName(),
    value: 19,
  }
];
