// For interprocess communication and context isolation exposing
const { ipcRenderer, contextBridge } = require('electron');

// Example fucnction
const whoIs = (interface, callback) => {
    // MessageChannels are lightweight--it's cheap to create a new one for each
    // request.
    const { port1, port2 } = new MessageChannel();

    // We send one end of the port to the main process ...
    // ipcRenderer.postMessage(
    //     'whoIs',
    //     { element, count: 10 },
    //     [port2]
    // );

    ipcRenderer.postMessage(
        'whoIs',
        { interface: interface },
        [port2]
    );

    // ... and we hang on to the other end. The main process will send messages
    // to its end of the port, and close it when it's finished.
    port1.onmessage = (event) => {
        callback(event.data);
        // readAllObjects('192.168.1.8', callback)
    }

    // Maybe finish or smth like that message (we'll see later)
    // port1.onclose = () => {
    //     console.log('stream ended');
    // }
}

const listInterfaces = (callback) => {

    const { port1, port2 } = new MessageChannel();

    // We send one end of the port to the main process ...
    // ipcRenderer.postMessage(
    //     'whoIs',
    //     { element, count: 10 },
    //     [port2]
    // );

    ipcRenderer.postMessage(
        'listInterfaces',
        {},
        [port2]
    );

    // ... and we hang on to the other end. The main process will send messages
    // to its end of the port, and close it when it's finished.
    port1.onmessage = (event) => {
        callback(event.data);
    }
}

const readAllObjects = (device, callback) => {
    // MessageChannels are lightweight--it's cheap to create a new one for each
    // request.
    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'readAllObjects',
        { device },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }
    
}

const readObject = (device, variable, property, callback) => {
    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'readObject',
        { device: device, variable: variable, property: property },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }

}
  
const readMultiple = (device, readObject, callback) => {

    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'readMultiple',
        { device: device, readObject: readObject },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }
}

const writeToObject = (device, writeObject, callback) => {
    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'writeToObject',
        { device: device, writeObject: writeObject },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }

}

const subscribeCOV = (device, subscribeObject, callback) => {

    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'subscribeCOV',
        { device: device, subscribeObject: subscribeObject },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }
}

const unsubscribeCOV = (device, unsubscribeObject, callback) => {
    const { port1, port2 } = new MessageChannel();

    ipcRenderer.postMessage(
        'unsubscribeCOV',
        { device: device, unsubscribeObject: unsubscribeObject },
        [port2]
    );
    
    port1.onmessage = (event) => {
        callback(event.data);
    }
}

const COVNotification = (callback) => {
    ipcRenderer.on('COV', (event, message) => {
        callback(message);
    })
}


// From the previous comment this is the correct way to use context bridge
contextBridge.exposeInMainWorld('testAPI', {
    whoIs:  whoIs,
    readAllObjects: readAllObjects,
    readObject: readObject,
    readMultiple: readMultiple,
    writeToObject: writeToObject,
    subscribeCOV: subscribeCOV,
    COVNotification: COVNotification,
    unsubscribeCOV: unsubscribeCOV
})

// Api to utilize network utils
contextBridge.exposeInMainWorld('network', {
    showInterfaces:  listInterfaces
})