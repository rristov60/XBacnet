import PropTypes from 'prop-types';
import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from 'react-spring'
import WarningAlert from './WarningAlert';
import Toast from './Toast';
const bacnetProperties = require('../Helpers/BacnetProperties.json');
const errorsDescription = require('../Helpers/ErrorsDescription.json');

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="0.8rem" style={{ width: 14, height: 14, }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="0.8rem" style={{ width: 14, height: 14,  }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="0.8rem"
      style={{ width: 20, height: 20,  }}
      {...props}
    >
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5h2V4H1.5l-.5.5v8l.5.5H4v-1H2V5zm12.5-1H12v1h2v7h-2v1h2.5l.5-.5v-8l-.5-.5zm-2.74 2.57L12 7v2.51l-.3.45-4.5 2h-.46l-2.5-1.5-.24-.43v-2.5l.3-.46 4.5-2h.46l2.5 1.5zM5 9.71l1.5.9V9.28L5 8.38v1.33zm.58-2.15l1.45.87 3.39-1.5-1.45-.87-3.39 1.5zm1.95 3.17l3.5-1.56v-1.4l-3.5 1.55v1.41z"/></svg>
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

const divideIpPort = (string, part) => {
  var formatted = string.split(':');

  if(part == 'Ip')
    return formatted[0];
  else
    return formatted[1];
}

const TreeVariables = ({ device, updateDevice, selectVariable }) => {
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState('success');
  const [toastTitle, setToastTitle] = React.useState('');

  const updateSelectedVar = (device, variable) => {
    if(variable.OBJECT_NAME == undefined) {
      // Read the stuff
      const requestArray = [
        {
          objectId: 
          { 
              type: variable.value.type,
              instance: variable.value.instance
          },
          properties: [
            {  // Try to read all objects
              id: 8
            }
          ]
        }
      ];

      window.bacnet.readMultiple(device, requestArray, (response) => {

          // Formatting the read properties to correspond
          // with "enum"
          if(!response.error) {
            response.value.values[0].values.map((value) => {
              Object.keys(bacnetProperties).map((key) => { // Getting the name of the variable type
                if(bacnetProperties[key] == value.id) {
                  variable[key] = { value: value.value[0].value, type: value.value[0].type };
                  variable.cov = {};
                  variable.cov.subscribed = false;
                  // variable[key].type = value.value[0].type;
                }
              })
            })
            
            setToastMessage(`Successfully read object: ${variable.OBJECT_NAME.value}!`);
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
          updateDevice(device); // Updating the device
          selectVariable(variable);

      });

    } else {
      // TODO:
      // Select the variable and display it's properties, but for now figure out 
      // the part above
      selectVariable(variable);
    }
  }



  return (
    <>
      { (device?.variables?.length > 0) ?
        // If there are devices found with the scan
        <>
          <TreeView
            aria-label="customized"
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            sx={{ maxHeight: '90%', flexGrow: 1, maxWidth: '98%', overflowX: 'hidden', overflowY: 'auto'  }}
            style={{ textAlign: 'left' }}
          >
            <StyledTreeItem nodeId="1" onClick={() => {{updateSelectedVar(device, device.info)}}} label={<span style={{ fontSize: '0.9rem' }}>{`${device.info.OBJECT_NAME.value} \n [ IP: ${device.address}, #${device.deviceId} ]`}</span>}>
              {/* TODO: Format this to be more represntative (perpaps read the device name :))  */}
              { device.variables.map((variable) => { return <StyledTreeItem 
                                                    onClick={() => {updateSelectedVar(device, variable); {/* HANDLE THE READING OF THE NAME HERE AND DISPLAYING THE VARS */}}}
                                                    key={`${variable.value.instance}|${variable.value.type}`} /* Find something unique to addresss the variables */
                                                    nodeId={`${variable.nodeId}`} // Unique node id
                                                    label={<span style={{ fontSize: '0.78rem' }}>
                                                      {`${(variable.OBJECT_NAME == undefined) ? `${variable.typeName} ( Instance: ${variable.value.instance} )` : `${variable.OBJECT_NAME.value} (${variable.typeName})`} `}
                                                      </span>}
                                                      /> })}
            </StyledTreeItem>
          </TreeView>
          <Toast open={toastOpen} message={toastMessage} type={toastType}/>
        </>
        : // Else
        // If no devices are found
        <WarningAlert text={`No variables discovered !`}/>
    }
  </>
  )
}

export default TreeVariables