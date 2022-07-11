
const Devices = ({ devices }) => {
    // console.log(`In components: ${devices[0].header.sender.address}`);
  return (
    <>
        <h3>{devices.length}</h3>
        {/* <h3>{devices[0].header.sender.address}</h3> */}
        {devices.map((device) => {
            // return <h3 key={device.payload.deviceId}>{device.header.sender.address}</h3>
        })}
    </>
  )
}

export default Devices