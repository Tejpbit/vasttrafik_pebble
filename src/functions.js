
var API_URL = "http://api.vasttrafik.se/bin/rest.exe/v1/";

var API_KEY = "d1d59e3d-f294-4eff-bf57-f3e8a2fbcc51";

function getGPSCoords() {
	return [57.6699708, 11.9358389];
}

function getJsonFromGetRequest(url) {
	console.log(url);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);

	var vastTrafikJson = xmlHttp.responseText;
	var cleanJson = vastTrafikJson.substring(13, vastTrafikJson.length - 2);
	return JSON.parse(cleanJson);
}

function getNearbyStops() {
	var coords = getGPSCoords();
	var lat = coords[0], lon = coords[1];

	var coordURL = API_URL +
					"location.nearbystops?authKey=" +
					API_KEY +
					"&format=json&jsonpCallback=processJSON" +
					"&originCoordLat=" + lat +
					"&originCoordLong=" + lon +
					"&maxNo=30";

	var obj = getJsonFromGetRequest(coordURL);

	
	var locations = obj.LocationList.StopLocation;
	var filteredLocations = [];

	while (locations.length > 0) {
		var element = locations.shift();
		filteredLocations.push(element);
		locations = locations
		.filter(function (el) {
			return el.name !== element.name;
		});
	}

	return filteredLocations;
}

function getDepatureboardFrom(obj) {
	var depatureBoardURL = 	API_URL +
							'departureBoard?authKey=' +
							API_KEY +
							'&format=json&jsonpCallback=processJSON' +
							'&id=' + obj.id;

	var jsonObj = getJsonFromGetRequest(depatureBoardURL);
	return jsonObj.DepartureBoard.Departure;
}
