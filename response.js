function checkDeparture (){
        infoWindow.open(map);
          map.setCenter(departurePos);

          marker = new google.maps.Marker({
              position: departurePos,
              map: map,
             });
}

function checkArrival (){
          infoWindow.open(map);
          map.setCenter(arrivalPos);

          marker = new google.maps.Marker({
              position: arrivalPos,
              map: map,
             });
}

  