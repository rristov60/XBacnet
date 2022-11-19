// For interprocess communication and context isolation exposing
const { ipcRenderer, contextBridge } = require("electron");

const whoIs = (interface, callback) => {
  // MessageChannels are lightweight--it's cheap to create a new one for each
  // request.
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage("whoIs", { interface: interface }, [port2]);
  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const listInterfaces = (callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage("listInterfaces", {}, [port2]);

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const readAllObjects = (device, callback) => {
  // MessageChannels are lightweight--it's cheap to create a new one for each
  // request.
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage("readAllObjects", { device }, [port2]);

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const readObject = (device, variable, property, callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage(
    "readObject",
    { device: device, variable: variable, property: property },
    [port2]
  );

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const readMultiple = (device, readObject, callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage(
    "readMultiple",
    { device: device, readObject: readObject },
    [port2]
  );

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const writeToObject = (device, writeObject, callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage(
    "writeToObject",
    { device: device, writeObject: writeObject },
    [port2]
  );

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const subscribeCOV = (device, subscribeObject, callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage(
    "subscribeCOV",
    { device: device, subscribeObject: subscribeObject },
    [port2]
  );

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const unsubscribeCOV = (device, unsubscribeObject, callback) => {
  const { port1, port2 } = new MessageChannel();

  ipcRenderer.postMessage(
    "unsubscribeCOV",
    { device: device, unsubscribeObject: unsubscribeObject },
    [port2]
  );

  port1.onmessage = (event) => {
    callback(event.data);
  };
};

const COVNotification = (callback) => {
  ipcRenderer.on("COV", (event, message) => {
    callback(message);
  });
};

// From the previous comment this is the correct way to use context bridge
contextBridge.exposeInMainWorld("bacnet", {
  whoIs: whoIs,
  readAllObjects: readAllObjects,
  readObject: readObject,
  readMultiple: readMultiple,
  writeToObject: writeToObject,
  subscribeCOV: subscribeCOV,
  COVNotification: COVNotification,
  unsubscribeCOV: unsubscribeCOV,
});

// Api to utilize network utils
contextBridge.exposeInMainWorld("network", {
  showInterfaces: listInterfaces,
});
