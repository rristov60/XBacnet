import * as React from 'react';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import {
  randomTraderName,
} from '@mui/x-data-grid-generator';
import ErrorAlert from './ErrorAlert';
import InfoAlert from './InfoAlert';
import { Button } from '@mui/material';
import AlertDialog from './AlertDialog';
const bacnetProperties = require('../Helpers/BacnetProperties.json')
// const { ipcRenderer } = window.require('electron');

window.testAPI.COVNotification((data) => {
  console.log("COV From React", data);
})

export default function ExplorerTable({ variable, device }) {

    const [open, setOpen] = React.useState(false);
    const [selectedProperty, setSelectedProperty] = React.useState({});
    const [valueToWrite, setValueToWrite] = React.useState('UNIQUEERRSTRINGNOTTOWRITE');

    const handleClickOpen = (property) => {
      setSelectedProperty(property);
      setOpen(true);
    };

    const handleCancel = () => {
      setOpen(false);
    }

    const handleSave = () => {

      // console.log('Value to write: ', valueToWrite);
      console.log('Variable: ', variable);
      // console.log('The property:', selectedProperty);

        const writeObject = {
          typeInstance: {
            type: variable.value.type,
            instance: variable.value.instance
          },
          propertyId: bacnetProperties[selectedProperty.id],
          theValue: [{
            type: variable[selectedProperty.id].type,
            value: valueToWrite.value
          }]
        };

        console.table(writeObject);

      if(valueToWrite != 'UNIQUEERRSTRINGNOTTOWRITE') {
        // write to the device

        //  const writeObject = {
        //     type: variable.value.type,
        //     instance: variable.value.instance,
        //     theValue: {
        //       type: bacnetTypes.selectedProperty.id,
        //       value: valueToWrite
        //     }
        //  };

        window.testAPI.writeToObject(device, writeObject, (response) => {
          // Debugging the response
            console.log(response);

            if(response.error == null) {
              variable[selectedProperty.id].value = valueToWrite.value;
              // console.log(variable[selectedProperty.id].value);
              // update the variable
            }
  
            // response.values[0].values.map((value) => {
            //   if(value.id == 77) {
            //       variable.name = value.value[0].value;
            //   } else if (value.id == 28) {
            //       variable.description = value.value[0].value;
            //   }
            // })
  
            // Formatting the read properties to correspond
            // with "enum"
            // response.values[0].values.map((value) => {
            //   Object.keys(bacnetProperties).map((key) => { // Getting the name of the variable type
            //     if(bacnetProperties[key] == value.id) {
            //       variable[key] = value.value[0].value;
            //     }
            //   })
            // })
  
            // updateDevice(device); // Updating the device
            // selectVariable(variable);
            setOpen(false);
        });
      }
      else 
        setOpen(false);
    };

    const handleRowEditCommit = (params) => {
      console.log(params);
    }

  const handleRowEdit = (params) => {
    // Filter the parameters
    // And make the required changes
    // ** IMPORTANT NOTE **
    // Keep track probably in the code below in the DataGrid
    // Which Cells are editable
  }

  const rows = (variable) => {
    var rows = [];

    if(variable != undefined) {
      Object.keys(variable).map((key) => { // Getting the name of the variable type

        if(key != 'value' && key != 'typeName' && key != 'nodeId' && key != 'cov') {
          
          var formattedKey = key;
          formattedKey = formattedKey.replace('_', " ");
          formattedKey = formattedKey.replace('_', " ");
          formattedKey = formattedKey.replace('_', " ");
          formattedKey = formattedKey.toLowerCase();
          formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  
          rows.push({
            id: `${key}`,
            BACnetProperty: `${formattedKey}`,
            value: variable[key].value
          });

        }
        // if(bacnetProperties[key] == value.id) {
        //   variable[key] = value.value[0].value;
        // }
      })
    }

    // if(variable != undefined) {
    //   rows.push({
    //     id: `${variable.value.type /* Later change this to correspond to type to each property */}|${variable.value.instance}`,
    //     BACnetProperty: 'Description',
    //     value: variable.description
    //   });

    //   rows.push({
    //     id: `${variable.value.type}|name`,
    //     BACnetProperty: 'Name',
    //     value: variable.name
    //   });

    //   rows.push({
    //     id: `${variable.value.type}|type`,
    //     BACnetProperty: 'Type',
    //     value: `${variable.typeName} ( ${variable.type} )`
    //   });
    // }

    return rows;
  }

  return (
    <div style={{ height: '35vh', width: '100%'}}>
      {
        (variable.DESCRIPTION == undefined) ? 
        // Show error alert
        // <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //   <div style={{ width: '90%'}}>
            // <Button onClick={    console.log('Variable in Explorer Table', variable)}>Check</Button>
            <InfoAlert text='Nothing to display !'/>
        //   </div>
        // </div>
        // <ErrorAlert text='Nothing to display !'/>
        :
        // Show the actual table
        <>
          <AlertDialog open={open} handleSave={handleSave} handleCancel={handleCancel} property={selectedProperty} setValueToWrite={setValueToWrite}/>
          <DataGrid
            rows={rows(variable)}
            showColumnRightBorder={true}
            columns={columns}
            sx={{color: 'white', textAlign: 'center', border: 'unset', width: '100%', overflow: 'scroll'}}
            // onCellEditStop={() => {console.log('Stopped Editing the Celld')}}
            // onCellEditStop={handleRowEditCommit}
            // disableSelectionOnClick
            onCellEditStart={(params, event) => {
              console.log(params);
              var property = {
                name: params.row.BACnetProperty,
                value: params.row.value,
                id: params.row.id
              }
              handleClickOpen(property);
            }}

            onCellEditCommit={(params, event) => {
                
                if(params.id.includes('name')) {
                  console.log('EDIT');
                } else {
                  console.log('Return Old value');
                  event.defaultMuiPrevented = true; // Preventing the edit on the cell
                  console.log(params);
                  console.log(variable);
                }
            }}
            // onCellFocusOut={(params) => {console.log(params)}}
            hideFooter={true}
            sortModel={undefined}
            // experimentalFeatures={{ newEditingApi: true }}
          />
        </>
      }
    </div>
  );
}

const columns = [
  { field: 'BACnetProperty', headerName: 'BACnet Property', width: 190, editable: false, headerAlign: 'center', disableColumnMenu: true, sortable: false },
  { field: 'value', headerName: 'Value', width: 190, editable: true, headerAlign: 'center', disableColumnMenu: true, sortable: false }
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