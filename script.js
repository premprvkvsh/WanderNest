// Function to generate AI response and fetch clusters based on user input
function generateResponse(location, amenities, universityName, universityDistance, budget) {
  // Build the prompt dynamically based on user input
  let prompt = `Give me clusters near ${location} that include `;

  if (amenities.includes("gym")) prompt += "gym, ";
  if (amenities.includes("yoga")) prompt += "yoga center, ";
  if (amenities.includes("food")) prompt += "vegetarian food, ";
  if (amenities.includes("wifi")) prompt += "Wi-Fi, ";

  // Add university name and distance if provided
  if (universityName) {
      prompt += `within a ${universityDistance} km radius from ${universityName}, `;
  }

  prompt += `with a budget under ${budget} per month. Only respond with the coordinates of the clusters, in this format: 'Cluster Name: latitude, longitude'.`;

  return fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer XxxFtipnDhPlvCicRc3cElrbwDhA0100T6zWxGwz', // Replace with your Cohere API key
          
    
          

          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          model: 'command-xlarge-nightly',
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.7,
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      const responseText = data.generations[0].text.trim();
      return parseCoordinates(responseText);
  })
  .catch(error => {
      console.error('Error:', error);
      alert("Sorry, an error occurred. Please try again.");
  });
}

// Function to parse coordinates from AI response
function parseCoordinates(responseText) {
  const clusters = [];
  const lines = responseText.split('\n');
  lines.forEach(line => {
      const match = line.match(/(.+): ([\d.-]+), ([\d.-]+)/);
      if (match) {
          clusters.push({
              name: match[1].trim(),
              lat: parseFloat(match[2]),
              lon: parseFloat(match[3]),
          });
      }
  });
  return clusters;
}

// Function to fetch clusters based on selected user input and display them on the map
function fetchAndDisplayClusters() {
  const location = document.getElementById("location").value.trim();  // Get user input for location
  const amenities = []; // Collect selected amenities
  if (document.getElementById("gym").checked) amenities.push("gym");
  if (document.getElementById("yoga").checked) amenities.push("yoga");
  if (document.getElementById("food").checked) amenities.push("food");
  if (document.getElementById("wifi").checked) amenities.push("wifi");

  const universityName = document.getElementById("university").value.trim();  // Get university name (optional)
  const universityDistance = document.getElementById("distance").value.trim();  // Get user input for distance (optional)
  const budget = document.getElementById("budget").value.trim();  // Get user input for budget

  // Validate input fields
  if (!location || amenities.length === 0 || !budget) {
      alert("Please fill in all required fields (Location, Amenities, Budget).");
      return;
  }

  generateResponse(location, amenities, universityName, universityDistance, budget)
      .then(clusters => {
          if (clusters && clusters.length) {
              console.log("Clusters and Coordinates:", clusters);
              addClustersToMap(clusters);  // Display clusters on map
          } else {
              console.log("No clusters found.");
              alert("No clusters found.");
          }
      });
}

// Function to add clusters as markers on the map
function addClustersToMap(clusters) {
  // Initialize the map centered around the user's location
  const map = L.map('map').setView([28.4744, 77.5030], 12); // Change initial coordinates to a default location

  // Set up the OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add markers for each cluster with the default Leaflet marker
  clusters.forEach(cluster => {
      const marker = L.marker([cluster.lat, cluster.lon], {
          icon: L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Use CDN for marker icon
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Use CDN for marker shadow
              shadowSize: [41, 41]
          })
      }).addTo(map);

      marker.bindPopup(`<b>${cluster.name}</b><br>Lat: ${cluster.lat}, Lon: ${cluster.lon}`);
  });
}

// Event listener for the "Show Clusters" button
document.getElementById("showClustersBtn").addEventListener("click", fetchAndDisplayClusters);
