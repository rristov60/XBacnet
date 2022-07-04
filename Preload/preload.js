// For interprocess communication and context isolation exposing
const { ipcRenderer, contextBridge } = require('electron');

// Example fucnction
const makeStreamingRequest = (element, callback) => {
    // MessageChannels are lightweight--it's cheap to create a new one for each
    // request.
    const { port1, port2 } = new MessageChannel();

    // We send one end of the port to the main process ...
    ipcRenderer.postMessage(
        'give-me-a-stream',
        { element, count: 10 },
        [port2]
    );

    // ... and we hang on to the other end. The main process will send messages
    // to its end of the port, and close it when it's finished.
    port1.onmessage = (event) => {
        callback(event.data);
    }

    // port1.onclose = () => {
    //     console.log('stream ended');
    // }
}
  

// This would need to be exposed via api in order UI to use it properly (again security)
// makeStreamingRequest(42, (data) => {
//   console.log('got response data:', event.data)
//     // return event.data;
// })

// From the previous comment this is the correct way to use context bridge
contextBridge.exposeInMainWorld('testAPI', {
    portTest:  makeStreamingRequest
})