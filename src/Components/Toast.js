import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import { Box } from '@mui/system';
import { AlertTitle , Alert, Typography } from '@mui/material';
function SlideTransition(props) {
  return <Slide {...props} direction="right" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

function getWidth(type) { 
    if(type == 'success')
        return '25%';
    
    return '35%';
}

const Toast = ({ open, message, type, cov = 'false', title = type.charAt(0).toUpperCase() + type.slice(1)}) => {
//   const [open, setOpen] = React.useState(false);

  return (
    <>
    {
        (cov == 'false') ? 
            <Box sx={{ width: '100%' }}>
                <Slide direction='left' in={open}>
                    <Alert
                        severity={type}
                        // severity='error'
                        // TransitionComponent={SlideTransition}
                        // action={
                        // <IconButton
                        //     aria-label="close"
                        //     color="inherit"
                        //     size="small"
                        //     // onClick={() => {
                        //     // setOpen(false);
                        //     // }}
                        // >
                        //     {/* <CloseIcon fontSize="inherit" /> */}
                        // </IconButton>
                        // }
                        sx={{ mb: 2, position: 'fixed',
                            bottom: 0,
                            zIndex: '999999 !important',
                            textAlign: 'left',
                            width: getWidth(type),
                            right: 20, }}
                        variant='filled'
                    >
                        <AlertTitle>
                            {/* {type.charAt(0).toUpperCase() + type.slice(1)} */}
                            {title}
                        </AlertTitle>
                        {message}
                    </Alert>
                </Slide>
            </Box>
        :

            <Box sx={{ width: '100%', position: 'fixed' }}>
            <Slide direction='right' in={open}>
                <Alert
                    severity={type}
                    // severity='error'
                    // TransitionComponent={SlideTransition}
                    // action={
                    // <IconButton
                    //     aria-label="close"
                    //     color="inherit"
                    //     size="small"
                    //     // onClick={() => {
                    //     // setOpen(false);
                    //     // }}
                    // >
                    //     {/* <CloseIcon fontSize="inherit" /> */}
                    // </IconButton>
                    // }
                    sx={{ mb: 2, position: 'fixed',
                        bottom: 0,
                        zIndex: '999999 !important',
                        textAlign: 'left',
                        width: getWidth(type),
                        left: 20, }}
                    variant='filled'
                >
                    <AlertTitle>
                        {title}
                        {/* {type.charAt(0).toUpperCase() + type.slice(1)} */}
                    </AlertTitle>
                    {/* <Typography> */}
                        {message}
                    {/* </Typography> */}
                </Alert>
            </Slide>
        </Box>
    }
    </>
    // <div>
    //   <Snackbar
    //     open={open}
    //     TransitionComponent={SlideTransition}
    //     message={message}
    //   />
    // </div>
  );
}
export default Toast;