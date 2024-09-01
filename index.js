import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const dataRef = ref(db, '/LocationUpdates');
const users = new Map();

onChildAdded(dataRef, (snapshot) => {
  const data = snapshot.val();
  Object.keys(data).forEach(item => {
    const loc = data[Object.keys(data)[0]];
    users.set(snapshot.key, loc);
  });
  initMap()
});

let map;
// 28.624163, 77.187792

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 28.62631074601461, lng: 77.18595579555301 },
    zoom: 19.5,
  });

  console.log("map loaded", map);

  const indoorRenderer = new woosmap.map.IndoorRenderer({
    venue: "ishuven"
  });

  users.forEach((item, userId) => {
    const marker = new woosmap.map.Marker({
      position: { lat: item.lat, lng: item.lon },
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    marker.addListener("click", () =>
      handleMarkerClick(userId),
    );
    marker.setMap(map);
  })


  console.log(indoorRenderer);

  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log(venue);
    hideLoader();
  });

  indoorRenderer.addListener("indoor_venue_error", (error) => {
    console.error("Error loading venue:", error);
  });

  indoorRenderer.setMap(map);

}

async function handleMarkerClick(id) {

  try {
    const data = await getUserinfo(id);
    console.log(data);
    alert(`${data.name} has medical condition : ${data.medicalConditions}`);
  } catch (error) {
    alert(error.message)
  }
}

async function getUserinfo(id) {
  try {

    const url = 'http://localhost:3000/auth/' + id
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error("Error getting ID token or sending it to backend:", error);
    throw new Error(error.message)
  }
}

const hideLoader = () => {
  document.querySelector(".progress").remove();
};

window.initMap = initMap;