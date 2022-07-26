const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false // Is it development environment
const path = require('path');
// require('@electron/remote/main').initialize();

// const { initBACnetListeners } =  require('./Helpers/bacnet'); 
var client = null;
var devices = null;
var interfaces = null;
var window = null;
var activeInterface = '0.0.0.0';

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
            backgroundThrottling: false,
            devTools: (isDev) ? true : false
            // enableRemoteModule: true,
        },
        // minWidth: 1366,
        // minHeight: 768,
        width: 1366,
        height: 768,
        titleBarStyle: 'hiddenInset',
        // transparent: true
    }

    // Creation of the window
    
    window = new BrowserWindow(windowOptions);
    if(isDev)
        window.loadURL('http://localhost:1234');
    else
        window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
    // Opening the Dev Tools
    if(isDev) window.webContents.openDevTools();

    // Loading the html file
    // window.loadFile('main.html');
}

const initBACnetClient = (bacnet, interface) => {
    if (client == null) {
        var splitInterface = interface.split('.');
        var broadcastAddress = `${splitInterface[0]}.${splitInterface[1]}.${splitInterface[2]}.255`;
        if (interface != '0.0.0.0') {
            client = new bacnet({
                interface: interface,
                broadcastAddress: broadcastAddress,
                apduTimeout: 6000
            });
        } else {
            client = new bacnet({
                apduTimeout: 6000
            });
        }
        initBACnetListeners();
    } 
    // initBACnetListeners(client, devices); // From the import
}

// Register stream listeners for message ports for IPC (Inter Process Communictaion)
const registerStreamListeners = () => {

    // Test function
    ipcMain.on('whoIs', (event, msg) => {

        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        //console.log('The interface from main: ', msg.interface);

        if(msg.interface != activeInterface) {
            client.close();
            client = null;
            //console.log(client);
            activeInterface = msg.interface;
            initBACnetClient(bacnet, activeInterface);
            // //console.log('Different interface !');
            // //console.table('New interface: ' + activeInterface);
            // var splitInterface = msg.interface.split('.');
            // var broadcastAddress = `${splitInterface[0]}.${splitInterface[1]}.${splitInterface[2]}.255`;
            // //console.log(broadcastAddress);
        }
      
        devices = [];
        //console.log(client);
        whoIs();

        setTimeout(() => {
            replyPort.postMessage(devices);
            replyPort.close()
        }, 6000);
      
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

            var response = {
                error: err,
                value: value
            };

            replyPort.postMessage(response);

            // if(!err)
            //     replyPort.postMessage(value);
            // else
            //     replyPort.postMessage(err);

            replyPort.close();
        });
    })

    ipcMain.on('readObject', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        //console.log('Main read object', msg);
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        client.readProperty(msg.device.address, {type: msg.variable.type, instance: msg.variable.instance}, msg.property, (err, value) => {

            var response = {
                error: err,
                value: value
            };

            replyPort.postMessage(response);
            // //console.log(err);
            //     // replyPort.postMessage(msg);
            // if(!err)
            //     replyPort.postMessage(value);
            // else
            //     replyPort.postMessage(err);

            replyPort.close();
        });
    })

    // Read multiple
    ipcMain.on('readMultiple', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        //console.log('Read Multiple', msg);
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        // //console.log(msg.readObject);
        client.readPropertyMultiple(msg.device.address, msg.readObject, (err, value) => {

            var response = {
                error: err,
                value: value
            };

            replyPort.postMessage(response);
            // //console.log(err);
            //     // replyPort.postMessage(msg);
            // if(!err)
            //     replyPort.postMessage(value);
            // else
            //     replyPort.postMessage(err);

            replyPort.close();
        });
    })

    ipcMain.on('writeToObject', (event, msg) => {
        // The renderer has sent us a MessagePort that it wants us to send our
        // response over.
        const [replyPort] = event.ports

        // //console.log('Write To Object', msg);
      
        // Here we send the messages synchronously, but we could just as easily store
        // the port somewhere and send messages asynchronously.
        // for (let i = 0; i < msg.count; i++) {
        //   replyPort.postMessage(msg.element)
        // }
        
        // type: 8, instance: 4194303, propertyId: 76 --> Reads all objects present on the device and returns their type & instance
        // This can be after utilized to read all of the vars and so on
        // //console.log(msg.readObject);

        client.writeProperty(msg.device.address, msg.writeObject.typeInstance, msg.writeObject.propertyId, msg.writeObject.theValue, { priority: 1 }, (err, value) => {
            // co
            // //console.log("Val: ", value);
            // //console.log("Err: ", err);
                // replyPort.postMessage(msg);

            var response = {
                error: err,
                value: value
            };

            replyPort.postMessage(response);
            // if(!err)
            //     replyPort.postMessage(value);
            // else
            //     replyPort.postMessage(err);

            replyPort.close();
        });
    })

    ipcMain.on('subscribeCOV', (event, msg) => {
        
        const [replyPort] = event.ports

        client.subscribeCov(msg.device.address, msg.subscribeObject.typeInstance, msg.subscribeObject.propertyId, false, false, 0, (err) => {
            replyPort.postMessage(err);
            replyPort.close();
        });

    })

    ipcMain.on('unsubscribeCOV', (event, msg) => {

        const [replyPort] = event.ports

        client.subscribeCov(msg.device.address, msg.unsubscribeObject.typeInstance, msg.unsubscribeObject.propertyId, false, false, 1, (err) => {
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

        client.on('covNotifyUnconfirmed', (data) => {
            window.webContents.send('COV', data);
        });

        // client.subscribeCov('192.168.0.104', { type: 4, instance: 101 },85, false, false, 0, (err) => {
        //     //console.log('SubscribeCOV: ' + err);
        // });

        // setTimeout(() => { client.subscribeCov('192.168.0.104', { type: 4, instance: 101 },85, false, false, 0, (err) => {
        //     //console.log('UnsubscribeCOV: ' + err);
        // })}, 10000);

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

    initBACnetClient(bacnet, activeInterface); // For Initialising client

    
    // Main Window
    // client = new bacnet();



    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
