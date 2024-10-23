//Initialize the Map: In a separate JavaScript file (e.g., script.js), initialize the Leaflet map.

var map = L.map('map').setView([0, 0], 2); // Center the map at a global view
// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


//Fetch Earthquake Data: Use the USGS GeoJSON Feed to fetch the earthquake data.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
d3.json(url).then(function(data) {
    // Process the data
    data.features.forEach(function(feature) {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; // [lat, lng]

        // Set marker size and color based on magnitude and depth
        const markerSize = magnitude * 5; // Adjust size scaling as needed
        const color = depth > 50 ? 'red' : depth > 30 ? 'orange' : depth > 10 ? 'yellow' : 'green';

        // Create a circle marker
        const marker = L.circleMarker(coords, {
            radius: markerSize,
            fillColor: color,
            color: color,
            fillOpacity: 0.7,
            stroke: false
        }).addTo(map);

        // Add a popup with additional information
        marker.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);
    });
    console.log()
    // Create a legend
    const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<strong>Depth </strong><br>';
    div.innerHTML += '<i style="background: green;"></i> 0-10 km<br>';
    div.innerHTML += '<i style="background: yellow;"></i> 10-30 km<br>';
    div.innerHTML += '<i style="background: orange;"></i> 30-50 km<br>';
    div.innerHTML += '<i style="background: red;"></i> >50 km<br>';
    return div;
};
legend.addTo(map);
 
}).catch(function(error) {
    console.error('Error fetching the data: ', error);
});