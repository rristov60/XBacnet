const initBACnetListeners = (client, devices)  => {

    if(client != null) { // Might Remove Later

        client.on('iAm', (device) => {
            devices.push(device);
        });
    }

}

module.exports.initBACnetListeners = initBACnetListeners;
