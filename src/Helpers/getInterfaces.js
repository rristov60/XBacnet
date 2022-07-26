const getInterfaces = () => {
    //console.log('Clicked theInterfaces!');

    window.network.showInterfaces((response) => {

        var theInterfaces = [];
        // Iterate through each reponse (the response returns object with keys that are theInterface names)
        Object.keys(response).forEach(data => {
            // Loop through each theInterface addresses
            response[data].forEach((theInterface) => { 
                // Filter the valid IPv4 addresses
                if(theInterface.family == 'IPv4') {

                    if(theInterface.address != '127.0.0.1') {
                        // Construct object that is going to be displayed
                        var theInterface = {
                            interface: data,
                            address: theInterface.address,
                            internal: theInterface.internal,
                            mac: theInterface.mac
                        };
                        // Push the object array that is later going to be dispalyed in front-end
                        theInterfaces.push(theInterface);
                    }

                }
            })
        });

        //console.log('theInterfaces:', theInterfaces)
        // Instead of //console.log 
        // dispay these in the correct dialog
        // return event.data;
    })
}

export default getInterfaces