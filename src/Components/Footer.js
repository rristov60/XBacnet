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
}

var phantom = {
  display: 'block',
  padding: '10px',
  height: '40px',
  width: '100%',
}

const Footer = ({ children }) => {
  return (
    <div>
    <div style={phantom} />
        <div style={style}>
            { children }
        </div>
    </div>
  )
}

export default Footer