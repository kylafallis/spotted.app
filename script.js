let map;
let markers = [];
let userSpots = []; // This array will store the user's spots

const allLocations = [
    { name: "Thompson Library", lat: 40.00032, lng: -83.01456, type: "library" },
    { name: "18th Avenue Library", lat: 39.99849, lng: -83.01161, type: "library" },
    { name: "Berry Cafe", lat: 40.0022, lng: -83.0111, type: "cafe" },
    { name: "The Oval", lat: 40.0016, lng: -83.0140, type: "outdoor" },
    // Add more locations here...
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

    // Add a click listener to the map to allow users to add spots
    map.addListener('click', (event) => {
        const confirmAdd = confirm("Add a new spot here?");
        if (confirmAdd) {
            const spotName = prompt("Enter a name for your spot:");
            if (spotName) {
                const newSpot = {
                    name: spotName,
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    type: "my-spot"
                };
                userSpots.push(newSpot); // Add the new spot to the userSpots array
                plotLocations(allLocations.concat(userSpots)); // Plot all locations including the new one
                populateList('all'); // Refresh the list view
            }
        }
    });

    plotLocations(allLocations);
    populateList('all');
}

function plotLocations(locationsToPlot) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    locationsToPlot.forEach(location => {
        // You'll need to create custom icons for a better look
        const iconUrl = location.type === 'my-spot' ? 'https://maps.gstatic.com/mapfiles/ms/micons/pink-dot.png' : 'https://maps.gstatic.com/mapfiles/ms/micons/blue-dot.png';
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
                url: iconUrl,
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

function populateList(filterType) {
    const list = document.getElementById('spot-list');
    list.innerHTML = '';
    
    let locationsToList = [];
    if (filterType === 'my-spots') {
        locationsToList = userSpots;
    } else if (filterType === 'all') {
        locationsToList = allLocations.concat(userSpots);
    } else {
        locationsToList = allLocations.filter(loc => loc.type === filterType);
    }

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
        
        // Populate the list based on the active filter when the list page is shown
        if (pageId === 'list-page') {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            populateList(activeFilter);
        }
    });
});

// Filter Button Logic on List Page
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');
        const filterType = button.getAttribute('data-filter');
        populateList(filterType);
    });
});
