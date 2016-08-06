var UI = require('ui');
var f = require('api_communicator');

var subMenu;
var nearbyStops;

var lat;
var lon;

var menu = new UI.Menu({
    sections: [{
       title: 'Nearby Stations'
    }]
});


menu.on('click', 'back', function() {
   menu.hide(); 
});

function setupMainMenuItems(stops) {
   console.log('walabala');
   console.log(stops);
    printStopsToMenu(stops);
    nearbyStops = stops;
    
   menu.on('select', setupAndShowSubMenu);
}

function printStopsToMenu(stops) {
    stops.map(function(stop) {
        return {title: stop.name};
    }).forEach(function(item, index) {
        menu.item(0, index, item);
    });   
}

function setupAndShowSubMenu(e) {
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
   if(!departures) {
      subMenu.item(0, 0, {
         title: 'No departures'
        });
   } else {
      departures.forEach(function(item, index) {
         subMenu.item(0, index, {
            title: item.name,
            subtitle: (item.rtTime || item.time) + " " + item.direction
         });
      });
   }
}

function locationSuccess(pos) {
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
  console.log('Location success');
   console.log(pos);
  f.getNearbyStops([lat, lon], setupMainMenuItems);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
    var coordErrorCard = new UI.Card({
        title:"Error",
        subtitle:err
    });
    coordErrorCard.show();
}

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
menu.show();

