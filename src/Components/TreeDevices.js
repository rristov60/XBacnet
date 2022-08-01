import PropTypes from 'prop-types';
import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated, update } from 'react-spring'
import ErrorAlert from './ErrorAlert';
import { Tooltip } from 'recharts';
import Toast from './Toast';

const bacnetTypes = require('../Helpers/BacnetTypes.json');
const bacnetProperties = require('../Helpers/BacnetProperties.json');
const errorsDescription = require('../Helpers/ErrorsDescription.json');

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="0.8rem" style={{ width: 14, height: 14, }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="0.8rem" style={{ width: 14, height: 14,  }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="0.8rem"
      style={{ width: 16, height: 16 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      {/* <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" /> */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path strokeLinecap="round" stroke-linejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent}/>
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    borderColor: '#A3E635',
  },
}));

// const [loading, setLoading] = useState(false);

const divideIpPort = (string, part) => {
  var formatted = string.split(':');

  if(part == 'Ip')
    return formatted[0];
  else
    return formatted[1];
}

const TreeDevices = ({ devices, updateDevices, selectDevice }) => {

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('success');
  const [toastTitle, setToastTitle] = React.useState('');

  const updateDevice = (device) => {

    // //console.log(device);

    if(device.variables == undefined) {
      device.info={};

      // Read Name, Location and all of the variables of the device
      const intialReadRequestArray = [
        {
          objectId: 
          { 
              type: 8,
              instance: device.deviceId
          },
          properties: [
            {  // Read all objects of the device
              id: 76
            }, 
            // {  // Read the name of the device(object)
            //   id: 77
            // }, 
            // { // Read the description of the device
            //   id: 28
            // },
            // { // Read device location
            //   id: 58
            // },
            {
              id: 8
            }
          ]
        }
      ];


      let i = 2;
      window.bacnet.readMultiple(device, intialReadRequestArray, (response) => {
        // Debugging the response
        //console.log('Response for treeDevice: ', response);
        if(!response.error) {
            response.value.values[0].values.map((value) => {

              // For each response (since it is a multiple read, we check the id that corresponds with the property id)

              // If the current value is for all of the objects on the device
              if (value.id == 76) {
                device.variables=[];  // Initialize the device variable array
                value.value.forEach((variable) => { // Loop through each variable 
                  if(variable.value.type != 8) {
                    variable.nodeId = i; // Unique (per tree) Node id 
                    Object.keys(bacnetTypes).map((key) => { // Getting the name of the variable type
                      if(bacnetTypes[key] == variable.value.type) {
                        variable.typeName = key;
                        //console.log(variable.typeName);
                      }
                    })
                    i++; // Incrementing the node id
                    device.variables.push(variable); // Adding the variable to the device
                  }
                })
                // If the current value is for device name
              } else {
                // //console.log(value);
                // value.value[0].forEach((value) => {
                  if(value.value.length > 0) {
                    //console.log('IN THE INFO !');
                    Object.keys(bacnetProperties).map((key) => { // Getting the name of the variable type
                      if(bacnetProperties[key] == value.id) {
                        device.info[key] = { value: value.value[0].value, type: value.value[0].type };
                        // variable[key].type = value.value[0].type;
                      }
                    })
                    device.info.value = {
                      type: 8,
                      instance: device.deviceId
                    };
                  }
                // })
                // device.info = null;
                // var variable = value.value[0];
                //   Object.keys(bacnetTypes).map((key) => { // Getting the name of the variable type
                //     if(bacnetTypes[key] == variable.value.type) {
                //       variable.typeName = key;
                //       //console.log(variable.typeName);
                //     }
                //   device.info = variable;
                // })
              }
              // else if (value.id == 77) {
              //   device.name = value.value[0].value;  // Assigning the device name from the read
              //   // If the read is for device locaiton
              // } else if (value.id == 58){
              //   device.location = value.value[0].value; // Assigning the device location
              // }
            })
            setToastMessage(`Successfully read all variables for #${device.deviceId}!`);
            setToastType('success');
            setToastOpen(true);
            setTimeout(() => {
              setToastOpen(false);
            }, 1500)
        } else {
          // setToastMessage(`An error occurred: ${response.error}!`);
          // setToastType('error');
          // setToastOpen(true);
          // setTimeout(() => {
          //   setToastOpen(false);
          // }, 15000)

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

          // The properties above are enough for initial reading

          updateDevices(device); // Updating the device
          selectDevice(device); // Marking the device as selected
      });
      
    } else {
      selectDevice(device); // If the reading is already done just select the device
    }
    // Check if the name is set, don't look for the name of the device
    // Check if all variables are present for the device, don't pull all of the variables
    // Check if there are subscriptions update them accordingly. Also be sure to keep
    // track of the subscriptions in the background
    //console.log(device);
  }

  return (
      <>
        { devices.length > 0 ?
          // If there are devices found with the scan
          <>
            <TreeView
              aria-label="customized"
              defaultExpanded={['1']}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
              sx={{ maxHeight: '100%', flexGrow: 1, maxWidth: '100%', overflowX: 'hidden', overflowY: 'auto'  }}
              style={{ textAlign: 'left' }}
            >
                <StyledTreeItem nodeId="1" label={<span style={{ fontSize: '0.9rem' }}>Devices</span>} onClick={() => selectDevice({})}>
                {/* TODO: Format this to be more represntative (perpaps read the device name :))  */}
                { devices.map((device) => { return <StyledTreeItem 
                                                      onClick={() => updateDevice(device)}
                                                      key={`${device.address}|${device.deviceId}`} 
                                                      nodeId={`${device.nodeId}`} 
                                                      label={<span style={{ fontSize: '0.8rem' }}>
                                                        {`[ #${device.deviceId} ] ${(device.info?.OBJECT_NAME?.value == undefined) ? device.address : `${device.info.OBJECT_NAME.value} (${device.info.LOCATION.value})`}`}</span>}
                                                        />})}
              </StyledTreeItem>
            </TreeView>
            <Toast open={toastOpen} message={toastMessage} type={toastType}/>
          </>
          : // Else
          // If no devices are found
          // <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          //   <div style={{ width: '90%'}}>
              <ErrorAlert text='No devices discovered !' />
          //   </div>
          // </div>
        }
      </>
  )
}

export default TreeDevices