const scanBtn = document.getElementById('scanBtn');

scanBtn.addEventListener('click', () => {
    // Start loading screen (scanning dialog)
    console.log('Clicked!');
    window.testAPI.portTest(42, (data) => {
        console.log('got response data:', event.data)
          // return event.data;
    })
})