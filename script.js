let map;
let markers = [];

const allLocations = [
    // Libraries - Corrected locations and icons
    { name: "Thompson Library", lat: 40.00032, lng: -83.01456, type: "library", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m1.png" },
    { name: "18th Avenue Library", lat: 39.99849, lng: -83.01161, type: "library", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m1.png" },
    { name: "Sullivant Hall Library", lat: 39.9985, lng: -83.0132, type: "library", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m1.png" },
    // Cafes - Corrected locations and icons
    { name: "Berry Cafe", lat: 40.0022, lng: -83.0111, type: "cafe", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m2.png" },
    { name: "Connecting Grounds", lat: 39.9997, lng: -83.0105, type: "cafe", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m2.png" },
    { name: "Oxley's by the Numbers", lat: 40.0044, lng: -83.0135, type: "cafe", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m2.png" },
    { name: "Curl Market", lat: 40.0019, lng: -83.0076, type: "cafe", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m2.png" },
    // Outdoor Spots
    { name: "The Oval", lat: 40.0016, lng: -83.0140, type: "outdoor", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m3.png" },
    { name: "RPAC Patio", lat: 39.9972, lng: -83.0179, type: "outdoor", icon: "https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m3.png" },
    // You can add more locations here
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.9992, lng: -83.0084 },
        zoom: 16,
        styles: [
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a8c0d9" }] },
            { "featureType": "landscape", "stylers": [{ "color": "#d9e8d4" }] },
        ],
    });

    plotLocations(allLocations);
    populateList(allLocations);
}

function plotLocations(locationsToPlot) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    locationsToPlot.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
                url: location.icon,
                scaledSize: new google.maps.Size(25, 25),
            },
        });

        const infowindow = new google.maps.InfoWindow({
            content: `<h3>${location.name}</h3><p>${location.description || 'No description available.'}</p>`
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

        markers.push(marker);
    });
}

function populateList(locationsToList) {
    const list = document.getElementById('spot-list');
    list.innerHTML = '';
    locationsToList.forEach(location => {
        const listItem = document.createElement('li');
        listItem.textContent = location.name;
        listItem.addEventListener('click', () => {
            const marker = markers.find(m => m.getTitle() === location.name);
            if (marker) {
                map.setCenter(marker.getPosition());
                new google.maps.InfoWindow({ content: `<h3>${location.name}</h3>` }).open(map, marker);
            }
        });
        list.appendChild(listItem);
    });
}

// Page Transition Logic
document.getElementById('discover-btn').addEventListener('click', () => {
    document.getElementById('intro-page').classList.add('hidden');
    document.getElementById('app-container').classList.add('active');
});

// Navigation Bar Logic
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.app-page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        const pageId = button.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        button.classList.add('active');
    });
});

// Request Form Logic
document.getElementById('request-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('request-name').value;
    const description = document.getElementById('request-description').value;
    const emailSubject = encodeURIComponent(`New Study Spot Request: ${name}`);
    const emailBody = encodeURIComponent(`Spot Name: ${name}\n\nDescription: ${description}\n\nThis is a request to add a new study spot to the app.`);
    
    // Replace YOUR_EMAIL@gmail.com with your actual email
    window.location.href = `mailto:kylakayf@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});
