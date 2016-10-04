var UI = require('ui');
var api = require('api_communicator');
var favourites = require('favourites');

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
   var contains = function(item, arr) {
      return arr.indexOf(item) > -1;
   };
   
   var allFavs = favourites.getAll();
   
   console.log('Allfavs in app' + allFavs);
   var foundFavourites = stops.filter(function(s) {return contains(s.id, allFavs);});
   var nonFavourites = stops.filter(function(s) {return !contains(s.id, allFavs);});
   var prioritisedStops = foundFavourites.concat(nonFavourites); 
   console.log(prioritisedStops);
   printStopsToMenu(prioritisedStops);
   nearbyStops = prioritisedStops;
    
   menu.on('select', setupAndShowSubMenu);
   menu.on('longSelect', toggleFavourite);
}

function toggleFavourite(e) {
   console.log(e.itemIndex);
   console.log(nearbyStops[e.itemIndex].id);
   favourites.toggle(nearbyStops[e.itemIndex].id);
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

    api.getDepartureboardFrom(selectedStop, departureBoardCallback);
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
  api.getNearbyStops([lat, lon], setupMainMenuItems);
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

