function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,

    gestureHandling: "greedy",
  });
  infoWindow = new google.maps.InfoWindow();

  

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.open(map);
          map.setCenter(pos);

          marker = new google.maps.Marker({
              position: pos,
              map: map,
             });

        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  

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
          var inputDeparture = document.getElementById('departure');
          var autocompleteDeparture = new google.maps.places.Autocomplete(inputDeparture);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var placeDeparture = autocomplete.getPlace();
                document.getElementById('city2').value = place.name;
                document.getElementById('departureLat').value = place.geometry.location.lat();
                document.getElementById('departureLng').value = place.geometry.location.lng();

                // console.log(place.geometry.location.lat());
            });

           google.maps.event.addDomListener(window, 'load', initialize);
           
          departurePos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lat(),
           };
        }
      


function initialize2() {
          var inputArrival = document.getElementById('arrival');
          var autocompleteArrival = new google.maps.places.Autocomplete(inputArrival);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var placeArrival = autocomplete.getPlace();
                document.getElementById('city2').value = place.name;
                document.getElementById('arrivalLat').value = place.geometry.location.lat();
                document.getElementById('arrivalLng').value = place.geometry.location.lng();
            });
  
        google.maps.event.addDomListener(window, 'load', initialize2);


}





function checkDeparture (){
        infoWindow.open(map);
          map.setCenter(departurePos);

          marker = new google.maps.Marker({
              position: departurePos,
              map: map,
             });
};

function checkArrival (){
          infoWindow.open(map);
          map.setCenter(arrivalPos);

          marker = new google.maps.Marker({
              position: arrivalPos,
              map: map,
             });
}

  