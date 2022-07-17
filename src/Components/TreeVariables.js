import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { Alert } from '@mui/material';
import { useSpring, animated } from 'react-spring'
import Typography from 'react';
import ErrorAlert from './ErrorAlert';
import WarningAlert from './WarningAlert';
const bacnetProperties = require('../Helpers/BacnetProperties.json')

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
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
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
            // {  // Read the name of the device(object)
            //   id: 77
            // }, 
            // { // Read the description of the device
            //   id: 28
            // },
            {  // Try to read all objects
              id: 8
            }
          ]
        }
      ];

      window.testAPI.readMultiple(device, requestArray, (response) => {
        // Debugging the response
          console.log(response);

          // response.values[0].values.map((value) => {
          //   if(value.id == 77) {
          //       variable.name = value.value[0].value;
          //   } else if (value.id == 28) {
          //       variable.description = value.value[0].value;
          //   }
          // })

          // Formatting the read properties to correspond
          // with "enum"
          response.values[0].values.map((value) => {
            Object.keys(bacnetProperties).map((key) => { // Getting the name of the variable type
              if(bacnetProperties[key] == value.id) {
                variable[key] = { value: value.value[0].value, type: value.value[0].type };
                variable.cov = {};
                variable.cov.subscribed = false;
                // variable[key].type = value.value[0].type;
              }
            })
          })

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


  // const readAllVars = (device) => {
  //   var requestArray = [];

  //   device.variables.forEach((variable) => {
  //     if(variable.name == undefined) {
  //       requestArray.push({
  //         objectId:
  //         {
  //           type: variable.value.type,
  //           instance: variable.value.instance
  //         },
  //         properties: [
  //           {  // Read the name of the device(object)
  //             id: 77
  //           }, 
  //           { // Read the description of the device
  //             id: 28
  //           },
  //           {  // Try to read all of the device properties
  //             // currently it fails, no idea why
  //             id: 8
  //           }
  //         ]
  //       });

  //       window.testAPI.readMultiple(device, requestArray, (response) => {
  //         // Debugging the response
  //           console.log(response);
  //           reponse.values.forEach((value) => {

  //           })
  //           // response.values[0].values.map((value) => {
  //           //   if(value.id == 77) {
  //           //       variable.name = value.value[0].value;
  //           //   } else if (value .id == 28) {
  //           //       variable.description = value.value[0].value;
  //           //   }
  //           //   updateDevice(device); // Updating the device
  //           // })
  //       });
  //     }
  //   })
  // }

  return (
    <>
      { (device?.variables?.length > 0) ?
        // If there are devices found with the scan
        <TreeView
          aria-label="customized"
          defaultExpanded={['1']}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{ maxHeight: '90%', flexGrow: 1, maxWidth: '98%', overflowX: 'hidden', overflowY: 'auto'  }}
          style={{ textAlign: 'left' }}
        >
          <StyledTreeItem nodeId="1" onClick={() => {{selectVariable({})}}} label={<span style={{ fontSize: '0.9rem' }}>{`${device.name} \n [ IP: ${device.address}, #${device.deviceId} ]`}</span>}>
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

        : // Else
        // If no devices are found
        // <ErrorAlert text={`${(device == undefined) ? `No variables found for #${device.deviceId}` : 'No variables found' } !`}/>
        // <ErrorAlert text={`No variables discovered !`}/>
        <WarningAlert text={`No variables discovered !`} tooltip='Riste'/>
    }
  </>
  )
}

export default TreeVariables