var UI = require('ui');
var f = require('functions');
var utils = require('utils');

var FAVOURITES = "favourites";
var favourites = localStorage.getItem(FAVOURITES) || [];

console.log("LocalStorage, favourites");
console.log(favourites);



var menu = new UI.Menu({
    sections: [{
    title: 'Bästtrafik',
    items: [{
      title: 'Favourites',
      subtitle: 'Add by long press select',
    }]
  },{
    title: 'Nearby Stations'
  }]
});



menu.on('click', 'back', function() {
   localStorage.setItem(FAV);
   menu.hide(); 
});

var subMenu;
var nearbyStops;

var lat;
var lon;

menu.show();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
    
  f.getNearbyStops([lat, lon], nearbyStopsCallback);
}

function nearbyStopsCallback(stops) {
    printStopsToMenu(stops);
    nearbyStops = stops;
    
    menu.on('select', mainMenuOnSelect);
    menu.on('longSelect', mainMenuOnLongSelect);
}

function printStopsToMenu(stops) {
    stops.map(function(stop) {
        return {title: stop.name};
    }).forEach(function(item, index) {
        menu.item(1, index, item);
    });   
}

function mainMenuOnSelect(e) {
    var selectedStop = nearbyStops[e.itemIndex];
    subMenu = new UI.Menu({
        title: selectedStop.name,
    });
    subMenu.on('click', 'back', function() {
        subMenu.hide();
    });

    f.getDepartureboardFrom(selectedStop, departureBoardCallback);
    subMenu.show();
}

function departureBoardCallback(departures) {
    departures.forEach(function(item, index) {
        subMenu.item(0, index, {
            title: item.name,
            subtitle: (item.rtTime || item.time) + " " + item.direction
        });
    });
}

function mainMenuOnLongSelect(e) {
    console.log("In longselect!");
    var stopID = nearbyStops[e.itemIndex].id;
    var stopIDIndex = favourites.indexOf(stopID);
    if (stopIDIndex !== -1) {
        favourites.splice(stopIDIndex, 1);
    } else {
        favourites.push(stopID);
    }
}



function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
    var coordErrorCard = new UI.Card({
        title:"Error",
        subtitle:err
    });
    coordErrorCard.show();
}
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);


