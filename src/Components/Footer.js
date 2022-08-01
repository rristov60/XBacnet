import React from 'react';
import  Logo  from '../Assets/NewLogo.svg';
import LogoWriting from '../Assets/LogoWriting.svg';
import InfoDialog from './InfoDialog';

var style = {
    backgroundColor: "#0c1636",
    borderTop: "1px solid #A3E635",
    textAlign: "center",
    padding: "10px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "40px",
    width: "100%",
    display: 'flex'
}

var phantom = {
  display: 'block',
  padding: '10px',
  height: '40px',
  width: '100%'
}

const Footer = ({ children, activeInterface }) => {

  const [open, setOpen] = React.useState(false);

  const closeDialog = () => {
    setOpen(false);
  }

  const openDialog = () => {
    setOpen(true);
  }

  return (
    <div>
    <div style={phantom} />
        <div style={style}>
          <div style={{ width: '50%', textAlign: 'left'}}>
            <div style={{ display: 'flex' }}>
                <p style={{ color: 'rgb(107 114 128)' }}>
                  Interface: {activeInterface}
                </p>
            </div>
          </div>
          <div style={{ textAlign: 'center'}}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
              <img src={Logo} style={{ height: 20 }} onClick={openDialog}/>
              <br></br>
              <img src={LogoWriting} style={{ height: 30 }} onClick={openDialog}/>
              <InfoDialog open={open} closeDialog={closeDialog}/>
            </div>
          </div>
          <div style={{ width: '50%', textAlign: 'right', paddingRight: 40}}>
            { children }
          </div>
        </div>
    </div>
  )
}

export default Footer