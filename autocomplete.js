
function initialize() {
          var inputDeparture = document.getElementById('departure');
          var autocompleteDeparture = new google.maps.places.Autocomplete(inputDeparture);
            google.maps.event.addListener(autocompleteDeparture, 'place_changed', function () {
                var placeDeparture = autocompleteDeparture.getPlace();
                document.getElementById('departureLat').value = placeDeparture.geometry.location.lat();
                document.getElementById('departureLng').value = placeDeparture.geometry.location.lng();

          departurePos = {
            lat: placeDeparture.geometry.location.lat(),
            lng: placeDeparture.geometry.location.lng(),
          };


            });

           }
            google.maps.event.addDomListener(window, 'load', initialize);
      
function initialize2() {
          var inputArrival = document.getElementById('arrival');
          var autocompleteArrival = new google.maps.places.Autocomplete(inputArrival);
            google.maps.event.addListener(autocompleteArrival, 'place_changed', function () {
                var placeArrival = autocompleteArrival.getPlace();
                document.getElementById('arrivalLat').value = placeArrival.geometry.location.lat();
                document.getElementById('arrivalLng').value = placeArrival.geometry.location.lng();

          arrivalPos = {
            lat: placeArrival.geometry.location.lat(),
            lng: placeArrival.geometry.location.lng(),
          };


            });

    console.log('test');
  }

 google.maps.event.addDomListener(window, 'load', initialize2);







       
