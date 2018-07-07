

const APP_ID = "6H6LGbdU8moRIx2Cmc7M";
const APP_CODE = "d712it9OF2kVHCy7FbQKCw";

let platform = new H.service.Platform({
    'app_id': APP_ID,
    'app_code': APP_CODE,
    useCIT: true,
    useHTTPS: true
});

let defaultLayers = platform.createDefaultLayers();

let map = new H.Map(
    document.getElementById('map'),
    defaultLayers.normal.map,
    {
        zoom: 10,
        center: { lat: 55.751244, lng: 37.618423 }
});

navigator.geolocation.getCurrentPosition(
    function(position) {
        map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
        map.setZoom(13);
    }
);

let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

let ui = H.ui.UI.createDefault(map, defaultLayers, "ru-RU");

eventMarkerGroup = new H.map.Group();
map.addObject(eventMarkerGroup);
let eventMarkerDict = {};

var eventCoords = null;
var selectedMarker = null;
map.addEventListener('tap', function(evt) {
    eventCoords =  map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    var target = evt.target;
    if (target instanceof mapsjs.map.Marker) {
        selectedMarker = target.label;
        let eventMarkerWindowTitle = document.querySelector('h5#eventMarkerTitle');
        eventMarkerWindowTitle.innerText = selectedMarker;
        $('#eventMarkerWindow').modal();
    } else {
        $('#eventWindow').modal();
    }
});

function saveBtn() {
    $('#eventWindow').modal('hide');
    marker = new H.map.Marker(eventCoords);
    marker.label = document.getElementById("eventName").value;
    eventMarkerGroup.addObject(marker);
    eventMarkerDict[marker.label] = marker;
}

var searchVal = null;
function searchInput() {
    searchVal = document.getElementById("searchInput").value;
    if (document.getElementById("eventSearch").checked) {

    }
    geocode(platform);
}

function geocode(platform) {
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: searchVal,
            jsonattributes : 1
        };

    geocoder.search(
        geocodingParameters,
        onSuccess,
        onError
    );
}

function landmarGeocode(platform) {
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: searchVal,
            jsonattributes : 1
        };

    geocoder.search(
        geocodingParameters,
        onSuccess,
        onError
    );
}

function onSuccess(result) {

    if (result.response.view[0] != undefined) {
       var locations = result.response.view[0].result;
       addLocationsToMap(locations);
    } else {
        alert('Location not found...')
    }
}

function onError(error) {
    alert('Connection error... Try again later');
}

var searchDict = {};
function addLocationsToMap(locations){
    var searchGroup = new H.map.Group(),
        position,
        i;

    if (locations[0].location != undefined) {
        for (i = 0;  i < locations.length; i += 1) {
            position = {
                lat: locations[i].location.displayPosition.latitude,
                lng: locations[i].location.displayPosition.longitude
            };
            marker = new H.map.Marker(position);
            marker.label = locations[i].location.address.label;
            searchGroup.addObject(marker);
            searchDict[marker.label] = marker;
        }
    } else {
        for (i = 0;  i < locations.length; i += 1) {
            position = {
                lat: locations[i].place.locations[0].displayPosition.latitude,
                lng: locations[i].place.locations[0].displayPosition.longitude
            };
            marker = new H.map.Marker(position);
            marker.label = locations[i].place.locations[0].name;
            searchGroup.addObject(marker);
            searchDict[marker.label] = marker;
        }
    }
    
    // Add the locations group to the map
    map.addObject(searchGroup);
    map.setCenter(searchGroup.getBounds().getCenter());
}

function deleteMarkerBtn() {
    eventMarkerGroup.removeObject(eventMarkerDict[selectedMarker]);
    delete eventMarkerDict[selectedMarker];
    console.log(eventMarkerDict);
    $('#eventMarkerWindow').modal('hide');
}
