var myMap;
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();
var departure = [];
var destination = [];
var relaypoint = [];
var dep_lat;
var dep_lon;
var des_lat;
var des_lon;
const SERVER_URL = "http://127.0.0.1:8000/relaypoint";

async function reRender() {
  if (departure.length != 1 || destination.length != 1) {
    return;
  }
  var pos1 = departure[0].getPosition();
  var pos2 = destination[0].getPosition();
  dep_lat = pos1.lat();
  dep_lon = pos1.lng();
  des_lat = pos2.lat();
  des_lon = pos2.lng();
  var res = await fetch(
    new URL(`${SERVER_URL}/${dep_lat}/${dep_lon}/${des_lat}/${des_lon}`)
  );
  var data = await res.json();
  var rel_lat = data.rel_lat;
  var rel_lon = data.rel_lon;
  if (relaypoint.length == 1) {
    relaypoint.shift().setMap(null);
  }
  var neoMarker = new google.maps.Marker({
    position: new google.maps.LatLng(rel_lat, rel_lon),
    map: myMap,
    draggable: false,
  });
  neoMarker.setMap(myMap);
  relaypoint.push(neoMarker);
  var myTravelMode =
    document.getElementById("TravelMode").value == "DRIVING"
      ? google.maps.DirectionsTravelMode.DRIVING
      : google.maps.DirectionsTravelMode.WALKING;
  directionsService.route(
    {
      origin: departure[0].getPosition(),
      destination: destination[0].getPosition(),
      waypoints: [
        {
          location: new google.maps.LatLng(rel_lat, rel_lon),
          stopover: false,
        },
      ],
      travelMode: myTravelMode,
    },
    function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        document.getElementById("journey").value =
          result.routes[0].legs[0].distance.value >= 1000
            ? result.routes[0].legs[0].distance.value / 1000 + "km"
            : result.routes[0].legs[0].distance.value + "m";
      } else {
        alert("ルート検索できませんでした");
      }
    }
  );
  var d = Math.round(
    google.maps.geometry.spherical.computeDistanceBetween(
      departure[0].getPosition(),
      destination[0].getPosition()
    )
  );

  document.getElementById("distance").value =
    d >= 1000 ? d / 1000 + "km" : d + "m";
}
function putMarker() {
  var neoMarker = new google.maps.Marker({
    position: arguments[0],
    map: myMap,
    draggable: true,
  });
  neoMarker.setMap(myMap);
  google.maps.event.addListener(neoMarker, "dragend", function (mouseEvent) {
    reRender();
  });
  destination.push(neoMarker);
  if (destination.length == 0) {
    return;
  } else if (destination.length == 2) {
    destination.shift().setMap(null);
  }
  reRender();
}

$(document).ready(function () {
  var param = new Array();
  var a = window.location.search.substring(1);
  var b = a.split("&");
  var mm = new Array();
  for (var i in b) {
    var vals = new Array(2);
    vals = b[i].split("=", 2);
    if (vals[0] == "m") {
      if (vals[1].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)) {
        mm.push(new google.maps.LatLng(RegExp.$1, RegExp.$2, true));
      }
    }
    param[vals[0]] = vals[1];
  }
  delete b;
  delete a;
  var opts = {
    zoom: "z" in param && parseInt(param["z"]) >= 0 ? parseInt(param["z"]) : 11,
    center:
      "c" in param && param["c"].match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
        ? (mapCenter = new google.maps.LatLng(RegExp.$1, RegExp.$2, true))
        : new google.maps.LatLng(35.68, 139.7),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    scaleControl: true,
    navigationControlOptions: true,
    gestureHandling: "greedy",
    disableDoubleClickZoom: true,
    scrollwheel: false,
    zIndex: 0,
  };
  myMap = new google.maps.Map(document.getElementById("map_canvas"), opts);
  infoWindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.open(myMap);
        myMap.setCenter(pos);

        marker = new google.maps.Marker({
          position: pos,
          map: myMap,
          draggable: true,
        });
        marker.setMap(myMap);
        google.maps.event.addListener(marker, "dragend", function (mouseEvent) {
          reRender();
        });
        departure.push(marker);
      },
      () => {
        handleLocationError(true, infoWindow, myMap.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, myMap.getCenter());
  }

  for (var i in mm) {
    putMarker(mm[i]);
  }
  delete mm;
  // クリックでマーカー設置
  google.maps.event.addListener(myMap, "click", function (mouseEvent) {
    putMarker(mouseEvent.latLng);
  });
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: myMap,
    suppressMarkers: true,
  });
  document.getElementById("journey").disabled = true;
  document.getElementById("distance").disabled = true;
});
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
function initialize() {
  var inputDeparture = document.getElementById("departure");
  var autocompleteDeparture = new google.maps.places.Autocomplete(
    inputDeparture
  );
  google.maps.event.addListener(
    autocompleteDeparture,
    "place_changed",
    function () {
      var placeDeparture = autocompleteDeparture.getPlace();
      document.getElementById("departureLat").value =
        placeDeparture.geometry.location.lat();
      document.getElementById("departureLng").value =
        placeDeparture.geometry.location.lng();

      departurePos = {
        lat: placeDeparture.geometry.location.lat(),
        lng: placeDeparture.geometry.location.lng(),
      };
    }
  );
}
google.maps.event.addDomListener(window, "load", initialize);

function initialize2() {
  var inputArrival = document.getElementById("arrival");
  var autocompleteArrival = new google.maps.places.Autocomplete(inputArrival);
  google.maps.event.addListener(
    autocompleteArrival,
    "place_changed",
    function () {
      var placeArrival = autocompleteArrival.getPlace();
      document.getElementById("arrivalLat").value =
        placeArrival.geometry.location.lat();
      document.getElementById("arrivalLng").value =
        placeArrival.geometry.location.lng();

      arrivalPos = {
        lat: placeArrival.geometry.location.lat(),
        lng: placeArrival.geometry.location.lng(),
      };
    }
  );
}

google.maps.event.addDomListener(window, "load", initialize2);
