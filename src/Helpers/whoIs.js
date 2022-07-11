const whoIs = () => {
    console.log('Clicked Scan!');
    window.testAPI.whoIs((data) => {
        // devices = data;
        return data;
        // console.log('From Scan:', data)
        // return event.data;
    })
}

export default whoIs