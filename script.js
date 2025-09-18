let map;
let markers = [];
const osuCampus = { lat: 39.9992, lng: -83.0084 }; // Centered on OSU

const locations = [
    { name: "Thompson Library", lat: 40.0003, lng: -83.0145, type: "library", icon: "book-solid" },
    { name: "18th Avenue Library", lat: 39.9984, lng: -83.0116, type: "library", icon: "book-solid" },
    { name: "Knowlton Hall Cafe", lat: 40.0028, lng: -83.0125, type: "cafe", icon: "mug-hot-solid" },
    { name: "The Oval", lat: 40.0016, lng: -83.0140, type: "outdoor", icon: "tree-solid" },
    // Add more locations here...
    // { name: "New Study Spot", lat: X, lng: Y, type: "major", icon: "flask-solid" }
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: osuCampus,
        zoom: 16,
        styles: [
            // Your custom map styles for green and blue theme
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a8c0d9" }] },
            { "featureType": "landscape", "stylers": [{ "color": "#d9e8d4" }] },
            { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
        ],
    });

    // Plot all initial locations
    plotLocations(locations);

    // Add event listeners for toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.toggle-btn.active').classList.remove('active');
            button.classList.add('active');
            const type = button.getAttribute('data-type');
            filterMarkers(type);
        });
    });
}

function plotLocations(locs) {
    markers.forEach(marker => marker.setMap(null)); // Clear existing markers
    markers = [];
    locs.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
                url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/${location.icon}.svg`,
                scaledSize: new google.maps.Size(25, 25),
            },
        });
        markers.push(marker);
    });
}

function filterMarkers(type) {
    markers.forEach(marker => {
        const location = locations.find(loc => loc.name === marker.getTitle());
        if (type === 'all' || location.type === type) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
}
