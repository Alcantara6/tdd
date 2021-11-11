var locate = function() { 
	var navigateToMap = function (position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		var mapUrl = `http://maps.google.com/?q=${latitude},${longitude}`;
		window.location = mapUrl
	}

	var geolocationError = function (error) {
		document.getElementById('error').innerText = error;
	}
	navigator.geolocation.getCurrentPosition(navigateToMap, geolocationError);
};