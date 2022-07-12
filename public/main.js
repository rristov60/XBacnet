const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false // Is it development environment
const path = require('path');
// require('@electron/remote/main').initialize();

// const { initBACnetListeners } =  require('./Helpers/bacnet'); 
var client = null;
var devices = null;
var interfaces = null;

// Loading Screen
const bacnet = require('node-bacnet'); // This might be moved to another place later
// const bacnet = require('bacstack'); // This might be moved to another place later

const createWindow = () => {
    
    // Window options
    const windowOptions = {
        webPreferences: {
            sandbox: true, // Sandbox enabled (security reasons)
            contextIsolation: true, // Context Isolation enabled as well (security reasons as well)
            preload: path.join(__dirname, 'Preload/preload.js'),
            // enableRemoteModule: true,
        },
        minWidth: 1416,
        minHeight: 818,
        width: 1416,
        height: 818,
        titleBarStyle: 'hiddenInset',
        // transparent: true
    }

    // Creation of the window
    const window = new BrowserWindow(windowOptions);
    window.loadURL('http://localhost:1234');
    // Opening the Dev Tools
    if(isDev) window.webContents.openDevTools();

    // Loading the html file
    // window.loadFile('main.html');
}

const initBACnetClient = (bacnet) => {
    if (client == null) client = new bacnet();
    // initBACnetListeners(client, devices); // From the import
    initBACnetListeners();
}

// Register stream listeners for message ports for IPC (Inter Process Communictaion)
const registerStreamListeners = () => {
    // Test function
    ipcMain.on('whoIs', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }

        devices = [];
        whoIs();

        setTimeout(() => {
            replyPort.postMessage(devices);
            replyPort.close()
        }, 6000);
      
        // We close the port when we're done to indicate to the other end that we
        // won't be sending any more messages. This isn't strictly necessary--if we
        // didn't explicitly close the port, it would eventually be garbage
        // collected, which would also trigger the 'close' event in the renderer.
        
    })

    ipcMain.on('listInterfaces', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }

        const os = require('os');

        interfaces = os.networkInterfaces();

        replyPort.postMessage(interfaces);
        replyPort.close()
    
        // We close the port when we're done to indicate to the other end that we
        // won't be sending any more messages. This isn't strictly necessary--if we
        // didn't explicitly close the port, it would eventually be garbage
        // collected, which would also trigger the 'close' event in the renderer.
        
    })

    ipcMain.on('readAllObjects', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        client.readProperty(msg.address, {type: 8, instance: 4194303}, 76, (err, value) => {
                // replyPort.postMessage(msg);
            if(!err)
                replyPort.postMessage(value);
            else
                replyPort.postMessage(err);

            replyPort.close();
        });
    })

    ipcMain.on('readObject', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        console.log('Main read object', msg);
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        client.readProperty(msg.device.address, {type: msg.variable.type, instance: msg.variable.instance}, msg.property, (err, value) => {

            console.log(err);
                // replyPort.postMessage(msg);
            if(!err)
                replyPort.postMessage(value);
            else
                replyPort.postMessage(err);

            replyPort.close();
        });
    })

    // Read multiple
    ipcMain.on('readMultiple', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        console.log('Main read object', msg);
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        console.log(msg.readObject);
        client.readPropertyMultiple(msg.device.address, msg.readObject, (err, value) => {

            console.log(err);
                // replyPort.postMessage(msg);
            if(!err)
                replyPort.postMessage(value);
            else
                replyPort.postMessage(err);

            replyPort.close();
        });
    })
}

const initBACnetListeners = () => {

    if(client != null) { // Might Remove Later

        client.on('iAm', (device) => {
            devices.push(device);
        });

    }

}

const whoIs = () => {
    // devices = [];
    // Discover Devices
    if(client !=  null) { // Might Remove Later
        client.whoIs();
    }
}


app.whenReady().then(() => {

    createWindow(); // This is for testing for now

    registerStreamListeners(); // This is for registering stream listeners

    initBACnetClient(bacnet); // For Initialising client

    
    // Main Window
    // client = new bacnet();



    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
