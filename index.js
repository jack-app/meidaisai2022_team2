var myMap;
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();
var myMarkers = [];
var marker = [];
var a_lat;
var a_lon;
var b_lat;
var b_lon;
const SERVER_URL = "http://127.0.0.1:8000/relaypoint";

async function reRender() {
  if (myMarkers.length == 1) {
    return;
  }
  //中継地点の座標を決定
  /*var pos1 = myMarkers[0].getPosition();
  var pos2 = myMarkers[1].getPosition();
  var a_lat = pos1.lat();
  var a_lon = pos1.lng();
  var b_lat = pos2.lat();
  var b_lon = pos2.lng();
  var radius = ((a_lat - b_lat) ** 2 + (a_lon - b_lon) ** 2) / 2;
  var cen_lat = (a_lat + b_lat) / 2;
  var cen_lon = (a_lon + b_lon) / 2;
  var r = Math.random();
  var angle = Math.random() * 2 * Math.PI;
  var new_lat = cen_lat + r * radius * Math.cos(angle); //中継地点の緯度
  var new_lon = cen_lon + r * radius * Math.sin(angle); //中継地点の経度*/
  var pos1 = myMarkers[0].getPosition();
  var pos2 = myMarkers[1].getPosition();
  a_lat = pos1.lat();
  a_lon = pos1.lng();
  b_lat = pos2.lat();
  b_lon = pos2.lng();
  var res = await fetch(
    new URL(`${SERVER_URL}/${a_lat}/${a_lon}/${b_lat}/${b_lon}`)
  );
  var data = await res.json();
  var new_lat = data.new_lat;
  var new_lon = data.new_lon;
  if (marker.length == 1) {
    marker.shift().setMap(null);
  }
  var neoMarker = new google.maps.Marker({
    position: new google.maps.LatLng(new_lat, new_lon),
    map: myMap,
    draggable: false,
  });
  neoMarker.setMap(myMap);
  marker.push(neoMarker);
  var myTravelMode =
    document.getElementById("TravelMode").value == "DRIVING"
      ? google.maps.DirectionsTravelMode.DRIVING
      : google.maps.DirectionsTravelMode.WALKING;
  directionsService.route(
    {
      origin: myMarkers[0].getPosition(),
      destination: myMarkers[1].getPosition(),
      waypoints: [
        {
          location: new google.maps.LatLng(new_lat, new_lon),
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
      myMarkers[0].getPosition(),
      myMarkers[1].getPosition()
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
  myMarkers.push(neoMarker);
  if (myMarkers.length == 1) {
    return;
  } else if (myMarkers.length == 3) {
    myMarkers.shift().setMap(null);
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
    disableDoubleClickZoom: true,
    scrollwheel: false,
    zIndex: 0,
  };
  myMap = new google.maps.Map(document.getElementById("map_canvas"), opts);
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
