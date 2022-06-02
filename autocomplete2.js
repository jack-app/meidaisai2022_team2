function initialize2() {
          var inputArrival = document.getElementById('arrival');
          var autocompleteArrival = new google.maps.places.Autocomplete(inputArrival);
            google.maps.event.addListener(autocompleteArrival, 'place_changed', function () {
                var placeArrival = autocompleteArrival.getPlace();
                document.getElementById('arrivalLat').value = placeArrival.geometry.location.lat();
                document.getElementById('arrivalLng').value = placeArrival.geometry.location.lng();
            });
  
        google.maps.event.addDomListener(window, 'load', initialize2);

    console.log('test');
  }


