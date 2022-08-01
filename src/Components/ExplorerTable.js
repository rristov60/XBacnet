import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import InfoAlert from './InfoAlert';
import AlertDialog from './AlertDialog';
import Toast from './Toast';
const bacnetProperties = require('../Helpers/BacnetProperties.json');
const errorsDescription = require('../Helpers/ErrorsDescription.json');


export default function ExplorerTable({ variable, device, updateSubscription }) {

    const [open, setOpen] = React.useState(false);
    const [selectedProperty, setSelectedProperty] = React.useState({});
    const [valueToWrite, setValueToWrite] = React.useState('UNIQUEERRSTRINGNOTTOWRITE');
    const [objectToWrite, setObjectToWrite] = React.useState({});

    const [toastOpen, setToastOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastType, setToastType] = React.useState('success');
    const [toastTitle, setToastTitle] = React.useState('');

    const handleClickOpen = (property) => {
      setSelectedProperty(property);
      setOpen(true);
    };

    const handleCancel = () => {
      setValueToWrite('UNIQUEERRSTRINGNOTTOWRITE');
      setSelectedProperty({});
      setObjectToWrite({});
      setOpen(false);
    }

    const handleSave = () => {

      var writeObject = null;
      if(!valueToWrite.isObject) {

        writeObject = {
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

      } else {

        delete valueToWrite.isObject;
        writeObject = {
          typeInstance: {
            type: variable.value.type,
            instance: variable.value.instance
          },
          propertyId: bacnetProperties[selectedProperty.id],
          theValue: [{
            type: variable[selectedProperty.id].type,
            value: valueToWrite
          }]
        };

      }

      if(valueToWrite != 'UNIQUEERRSTRINGNOTTOWRITE') {
        // write to the device
        window.bacnet.writeToObject(device, writeObject, (response) => {

            if(response.error == null) {
              variable[selectedProperty.id].value = valueToWrite.value;
              // update the variable
              setToastMessage(`Successfully written ${writeObject.theValue[0].value} to ${variable.OBJECT_NAME.value}!`);
              setToastType('success');
              setToastOpen(true);
              setTimeout(() => {
                setToastOpen(false);
              }, 1500);
            } else {
              var theResponse = `${response.error}`;

              setToastTitle(`${response.error}`);
    
              if(theResponse.includes('BacnetAbort')) {
                  var responseFormatted = theResponse.split(':');
                  var abortReason = responseFormatted[responseFormatted.length - 1];
    
                  setToastMessage(`${errorsDescription.AbortReason[`${abortReason}`]}!`);
              } else {
                  var responseFormatted = `${response.error}`;
                  responseFormatted = responseFormatted.substring(
                      responseFormatted.lastIndexOf('(') + 1,
                      responseFormatted.lastIndexOf(')')
                  );
                  
                  if(errorsDescription.ErrorCodes[responseFormatted] != undefined)
                    setToastMessage(`${errorsDescription.ErrorCodes[responseFormatted]}!`);
                  else 
                    setToastMessage(`${response.error}`)
              }
              
              setToastType('error');
              setToastOpen(true);
              setTimeout(() => {
                setToastOpen(false);
              }, 15000)
            }
  
            setOpen(false);
        });
      }
      else 
        setOpen(false);
    };

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
            value: (typeof variable[key].value === 'object' && variable[key].value !== null && key != 'MODIFICATION_DATE') ? '{ Object }' : variable[key].value,
            object: variable[key].value
          });

        }
      })
    }


    return rows;
  }

  return (
    <div style={{ height: '35vh', width: '100%'}}>
      {
        (variable.DESCRIPTION == undefined) ? 
          // Show Info alert
          <InfoAlert text='Nothing to display !'/>
        :
        // Show the actual table
        <>
          <AlertDialog open={open} handleSave={handleSave} handleCancel={handleCancel} property={selectedProperty} setValueToWrite={setValueToWrite} setObjectToWrite={setObjectToWrite} objectToWrite={objectToWrite}/>
          <DataGrid
            rows={rows(variable)}
            showColumnRightBorder={true}
            columns={columns}
            sx={{color: 'white', textAlign: 'center', border: 'unset', width: '100%', overflow: 'scroll'}}
            onCellEditStart={(params, event) => {
              var property = {
                name: params.row.BACnetProperty,
                value: params.row.value,
                id: params.row.id,
                object: params.row.object
              }
              handleClickOpen(property);
            }}

            hideFooter={true}
            sortModel={undefined}
          />
          <Toast open={toastOpen} message={toastMessage} type={toastType}/>
        </>
      }
    </div>
  );
}

const columns = [
  { field: 'BACnetProperty', headerName: 'BACnet Property', width: 190, editable: false, headerAlign: 'center', disableColumnMenu: true, sortable: false },
  { field: 'value', headerName: 'Value', width: 190, editable: true, headerAlign: 'center', disableColumnMenu: true, sortable: false }
];
