function initialize() {
          var inputDeparture = document.getElementById('departure');
          var autocompleteDeparture = new google.maps.places.Autocomplete(inputDeparture);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var placeDeparture = autocomplete.getPlace();
                document.getElementById('city2').value = place.name;
                document.getElementById('departureLat').value = place.geometry.location.lat();
                document.getElementById('departureLng').value = place.geometry.location.lng();
            });
        }
        google.maps.event.addDomListener(window, 'load', initialize);


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