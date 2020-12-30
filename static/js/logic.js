
// Data set
const urlLHour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
const urlDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const url7Days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url30Days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url30Days, function(data) {
    console.log(data.features);
});


let normal = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});
let light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// Defining basemaps for each layer created above
var baseMaps = {
    Normal: normal,
    Light: light,
    Dark: dark,
};



// Create our map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [normal] 
});

// Add the layer control to the map
L.control.layers(baseMaps).addTo(myMap);    //add the overlayEarthquakes layer

// Create a function to change the color of circle markers
function circleColor(x){
    if(x < 1){
          return "green"}
    else if (x > 1 && x <2){
        return "yellow"
    } 
    else if (x >2 && x <3){
        return "orange"
      }
          
    else if (x >3 && x <4){
        return "red"
    }
          
    else if (x >4 && x <5){
        return "purple"
      }

    else {
        return "black"
    } 
    }

// Earthquake data + popups
d3.json(url30Days, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features)
    // Get all earthquakes by lat + long
    for (i = 0; i < data.features.length; i++) {
        earthquakeData = data.features[i]
        var lat = earthquakeData.geometry.coordinates[1]
        var long = earthquakeData.geometry.coordinates[0]
        //Get magnitude of earthquakes
        var mag = earthquakeData.properties.mag
        var location = earthquakeData.properties.place
        //Include popups that provide additional information about the earthquake 
        //when a marker is clicked
        L.circleMarker([lat, long],{
            radius: mag*5,
            color: circleColor(mag)
        }).bindPopup(`<h1> Magintude: ${mag} (mms)</h1> <hr>
        <h2>Nearest Location: ${location}</h2>
        <h3>Coordinates : [${long}, ${lat}] </h3>`)
        .addTo(myMap)
    }
});
