function responce (){
const checkDeparture = document.querySelector('#checkDeparture')
checkDeparture.addEventListener('click', () => {
        infoWindow.open(map);
          map.setCenter(departurePos);

          marker = new google.maps.Marker({
              position: departurePos,
              map: map,
             });
};
const checkArrival = document.querySelector('#checkArrival')
checkDeparture.addEventListener('click', () => {
        infoWindow.open(map);
          map.setCenter(arrivalPos);

          marker = new google.maps.Marker({
              position: arrivalPos,
              map: map,
             });
};
	}