var functions = {};
var API_URL = "http://api.vasttrafik.se/bin/rest.exe/v1/";

var API_KEY = "d1d59e3d-f294-4eff-bf57-f3e8a2fbcc51";

var getJsonFromGetRequest = function(url) {
	console.log(url);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);

	var vastTrafikJson = xmlHttp.responseText;
	var cleanJson = vastTrafikJson.substring(13, vastTrafikJson.length - 2);
	return JSON.parse(cleanJson);
};

functions.getGPSCoords = function() {
	return [57.6699708, 11.9358389];
};

functions.tjenna = "fan va fint";

functions.getNearbyStops = function(coords) {
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
};

functions.getDepatureboardFrom = function(obj) {
    var departureBoardURL = API_URL +
							'departureBoard?authKey=' +
							API_KEY +
							'&format=json&jsonpCallback=processJSON' +
							'&id=' + obj.id;

	var jsonObj = getJsonFromGetRequest(departureBoardURL);
	return jsonObj.DepartureBoard;
};

this.exports = functions;