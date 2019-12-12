let trackId = null;
//To get each changed locations
let locations = [];
const displayLocation = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
     const pInfo = document.getElementById('info')
    const date = new Date(position.timestamp);
    // pInfo.innerHTML += `Location of timestamp: ${date} <br/>`;
    
    const googleLoc = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
    );
    locations.push(googleLoc); 

    const pLocation = document.getElementById("location");
    pLocation.innerHTML += latitude + ", " +  longitude + "<br/>"
}

const displayError = (error) => {
    const errors = ['Unknown error', 'Permission denied by user', 'Position not available', 'Timeout error']
    const message = errors[error.code];
    console.warn(`Error in getting your location ${message} ${error.message}`);
}

const trackMe = () => {
    if(navigator.geolocation) {
    const options = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
     trackId = navigator.geolocation.watchPosition(displayLocation, displayError, options)
    }else {
        alert("Sorry!, this browser doesn't support geolocation");
    }
}
const clearTracking = ()  => {
    if(trackId) {
        navigator.geolocation.clearWatch(trackId);
        trackId = null;
    }
}
const conputeTotalDistance = () => {
    let totalDistance = 0;

    if(locations.length > 1) {
        for(let i = 1; i < locations.length; i++) {
            totalDistance += google.maps.geometry.spherical.computeDistanceBetween(locations[i-1], locations[i])
        }
    }
    return totalDistance
}
window.onload = () => {
    const pDistance = document.getElementById('distance');
    const trackButton = document.querySelector('button');

    trackButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(trackButton.innerHTML == 'Start') {
            trackButton.innerHTML = 'Stop';
            trackMe();
        }else {
            trackButton.innerHTML = 'Start';
            clearTracking();
            const d = conputeTotalDistance();
            const miles = d/1.6;
            if(d > 0) {
                d = Math.round(d * 1000)/1000;
                pDistance.innerHTML = `Total distance travelled: ${d} km`;
            }else {
                pDistance.innerHTML =  `You didn't travel anywhere at all`
            }
        }
    })

}

