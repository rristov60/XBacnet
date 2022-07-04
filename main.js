const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const { initBACnetListeners } =  require('./Helpers/bacnet'); 
var client = null;
var devices = [];

// Loading Screen
const bacnet = require('node-bacnet'); // This might be moved to another place later

const createWindow = () => {
    
    // Window options
    const windowOptions = {
        webPreferences: {
            sandbox: true, // Sandbox enabled (security reasons)
            contextIsolation: true, // Context Isolation enabled as well (security reasons as well)
            preload: path.join(__dirname, 'Preload/preload.js')
        }
    }

    // Creation of the window
    const window = new BrowserWindow(windowOptions);
    
    // Opening the Dev Tools
    // TODO: 
    // introduce a env var which checks whether this needs to be executed or not
    window.webContents.openDevTools();

    // Loading the html file
    window.loadFile('main.html');
}

const initBACnetClient = (bacnet) => {
    if (client == null) client = new bacnet();
    // initBACnetListeners(client, devices); // From the import
    initBACnetListeners();
}

// Register stream listeners for message ports for IPC (Inter Process Communictaion)
const registerStreamListeners = () => {
    // Test function
    ipcMain.on('give-me-a-stream', (event, msg) => {
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
