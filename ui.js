const scanBtn = document.getElementById('scanBtn');
const interfaceBtn = document.getElementById('interfaceBtn');
const readAllObjectsBtn = document.getElementById('readAllObjectsBtn');
var devices = [];

// Event Listener to Scan for devices
scanBtn.addEventListener('click', () => {
    // Start loading screen (scanning dialog)
    console.log('Clicked Scan!');

    window.testAPI.whoIs((data) => {
        devices = data;
        console.log('From Scan:', data)
        // return event.data;
    })
})

// Event Listener to list interfaces (this needs to be first prompt and after that to read from device)
interfaceBtn.addEventListener('click', () => {
    // Start loading screen (scanning dialog)
    console.log('Clicked Interfaces!');

    window.network.showInterfaces((response) => {

        interfaces = [];
        // Iterate through each reponse (the response returns object with keys that are interface names)
        Object.keys(response).forEach(data => {
            // Loop through each interface addresses
            response[data].forEach((interface) => { 
                // Filter the valid IPv4 addresses
                if(interface.family == 'IPv4') {

                    if(interface.address != '127.0.0.1') {
                        // Construct object that is going to be displayed
                        var theInterface = {
                            interface: data,
                            address: interface.address,
                            internal: interface.internal,
                            mac: interface.mac
                        };
                        // Push the object array that is later going to be dispalyed in front-end
                        interfaces.push(theInterface);
                    }

                }
            })
        });

        console.log('Interfaces:', interfaces)
        // Instead of console.log 
        // dispay these in the correct dialog
        // return event.data;
    })
})

readAllObjectsBtn.addEventListener('click', () => {
    // Start loading screen (scanning dialog)
    console.log('Clicked Read All Objects!');
    device = devices[0];
    address = device.header.sender; //testing only

    window.testAPI.readAllObjects(address, (response) => {
        console.log('From Read:', response);
        // return event.data;
    })
})