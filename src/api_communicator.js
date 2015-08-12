ajax = require("ajax");

var api_communicator = {};
var API_URL = "http://api.vasttrafik.se/bin/rest.exe/v1/";

var API_KEY = "";

function createQuery(params) {
    params.authKey = API_KEY;
    params.format = "json";
    return ajax.formify(params);
}

function ajaxRequest(path, args, success, error) {
    var query = createQuery(args);
    var url = API_URL + path + "?" + query; 
    console.log(url);
     ajax({
        url: url,
        type: 'json'
     },success, error);
}

api_communicator.getNearbyStops = function(coords, callback) {
    var lat = coords[0], lon = coords[1];

    var query = {
        originCoordLat: lat,
        originCoordLong: lon,
        maxNo: 20
    };
    
    ajaxRequest("location.nearbystops", query, 
        function(data) {
            var locations = data.LocationList.StopLocation;
            var filteredLocations = [];

            while (locations.length > 0) {
                var element = locations.shift();
                filteredLocations.push(element);
                locations = locations
                .filter(function (el) {
                    return el.name !== element.name;
                });
            }
            
            callback(filteredLocations);
        },
         function(error) {
             console.log("Error when fetching data: " + error);
         }
    );
};

api_communicator.getDepartureboardFrom = function(obj, callback) {
    var query = {
        id: obj.id,
        maxDeparturesPerLine: 3,
        timeSpan: 60
    };
    
    ajaxRequest("departureBoard", query, 
        function(data){
            console.log(JSON.stringify(data));
            callback(data.DepartureBoard.Departure);
        }, function (error) {
            console.log("Error, failed to fetch departureBoard: " + error);
        }    
    );
};

this.exports = api_communicator;