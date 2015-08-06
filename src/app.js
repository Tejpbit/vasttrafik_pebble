var UI = require('ui');
var ajax = require('ajax');

var where = new UI.Card({  
  fullscreen: true,
  title:'Position',

});

var url = 'http://api.vasttrafik.se/bin/rest.exe/v1/location.nearbystops?authKey=d1d59e3d-f294-4eff-bf57-f3e8a2fbcc51&format=json&jsonpCallback=processJSON';

var lat;
var lon;

where.show();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  where.subtitle(pos.coords.latitude + ", " + pos.coords.longitude);
    
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
    
  var coordURL = url + "&originCoordLat=" + lat + "&originCoordLong=" + lon + "&maxNo=5";
    
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", coordURL, false );
  xmlHttp.send( null );
  var vastTrafikJson = xmlHttp.responseText;
  var cleanJson = vastTrafikJson.substring(13, vastTrafikJson.length - 2);
  var obj = JSON.parse(cleanJson);
    
    
  console.log("tjenna: " + obj.LocationList);
  
  /*  
  ajax(
      {
          url: coordURL,
          type: 'json'
      },
      function(data) {
          console.log("success");
          console.log("coordURL: " + coordURL);
      },
      function(error) {
          console.log("failure ajax");
          console.log("coordURL: " + coordURL);
          console.log("error: " + error);
      }
  );
  */
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);


