function setup(){
    if('geolocation' in navigator) {
        /* geolocation is available */
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
            // console.log(position);
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
        });
    } else {
        /* geolocation IS NOT available */
        console.log('geolocation NOT available');
    };
    
    let lat, lon;
    // P5JS: get video from computer's webcam
    noCanvas();
    const video = createCapture(VIDEO);
    video.elt.setAttribute('playsinline', '');
    video.size(300, 250);
    video.parent('container') // move video webcam screen into specific div
    const button = document.getElementById('submit');
    button.addEventListener('click', async event => {
        const mood = document.getElementById('mood').value;
        // alert P5JS to load the video's pixel, so I can then convert it to base64 string.
        video.loadPixels();
        const image64 = video.canvas.toDataURL();
        // send Json data to server
        const data = {lat, lon, mood, image64};
        const options = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // json stringified text
        };
        const response = await fetch('/api', options);
        const json = await response.json();
        console.log(json);
        alert('Submit Success!'); // a pop up window to show user records submitted!
    });
};