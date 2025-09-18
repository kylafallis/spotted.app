let map;
let markers = [];

const allLocations = [
    // Libraries
    { name: "Thompson Library", lat: 40.0003, lng: -83.0145, type: "library", icon: "https://maps.gstatic.com/mapfiles/ms/micons/red-dot.png" },
    { name: "18th Avenue Library", lat: 39.9984, lng: -83.0116, type: "library", icon: "https://maps.gstatic.com/mapfiles/ms/micons/red-dot.png" },
    { name: "Sullivant Hall Library", lat: 39.9985, lng: -83.0132, type: "library", icon: "https://maps.gstatic.com/mapfiles/ms/micons/red-dot.png" },
    // Cafes
    { name: "Berry Cafe", lat: 40.0022, lng: -83.0111, type: "cafe", icon: "https://maps.gstatic.com/mapfiles/ms/micons/blue-dot.png" },
    { name: "Connecting Grounds", lat: 39.9997, lng: -83.0105, type: "cafe", icon: "https://maps.gstatic.com/mapfiles/ms/micons/blue-dot.png" },
    { name: "Oxley's by the Numbers", lat: 40.0044, lng: -83.0135, type: "cafe", icon: "https://maps.gstatic.com/mapfiles/ms/micons/blue-dot.png" },
    // Outdoor Spots
    { name: "The Oval", lat: 40.0016, lng: -83.0140, type: "outdoor", icon: "https://maps.gstatic.com/mapfiles/ms/micons/green-dot.png" },
    { name: "RPAC Patio", lat: 39.9972, lng: -83.0179, type: "outdoor", icon: "https://maps.gstatic.com/mapfiles/ms/micons/green-dot.png" },
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.9992, lng: -83.0084 },
        zoom: 16,
        styles: [
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#A8C0D9" }] },
            { "featureType": "landscape", "stylers": [{ "color": "#D9E8D4" }] },
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
    list.innerHTML = ''; // Clear previous list
    locationsToList.forEach(location => {
        const listItem = document.createElement('li');
        listItem.textContent = location.name;
        listItem.addEventListener('click', () => {
            // Find marker and open infowindow
            const marker = markers.find(m => m.getTitle() === location.name);
            if (marker) {
                map.setCenter(marker.getPosition());
                new google.maps.InfoWindow({ content: `<h3>${location.name}</h3>` }).open(map, marker);
            }
        });
        list.appendChild(listItem);
    });
}

// Navigation Bar Logic
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Hide all pages and remove active class from all buttons
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        // Show the selected page and add active class to the clicked button
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
    window.location.href = `mailto:YOUR_EMAIL@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});

// Important: For Google Sign-In, you need to set up Firebase Authentication.
// The provided HTML includes a placeholder for a Google Client ID. 
// This is not a simple copy-paste solution. You will need to follow these steps:
// 1. Create a Firebase project.
// 2. Enable Google Sign-In in Firebase Authentication settings.
// 3. Get your Web client ID and paste it into the data-client_id attribute in index.html.
// 4. Implement a full back-end handler for the authentication callback.
// The "handleCredentialResponse" function is a placeholder and would require a Firebase setup. 
// For a simple demo, you can remove the Google Sign-in section from the HTML.
