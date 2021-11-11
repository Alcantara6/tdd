var fetchLocation = function (onSuccess, onError) {
	var execLocation = function (position) {
		var geolocation = {
			lat: position.coords.latitude,
			lon: position.coords.longitude
		}
		console.log(geolocation);
		onSuccess(geolocation);
	}

	navigator.geolocation.getCurrentPosition(execLocation ,onError)
}