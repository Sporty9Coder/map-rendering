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

const hideLoader = () => {
  document.querySelector(".progress").remove();
};

window.initMap = initMap;