var UI = require('ui');
var f = require('functions');

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
   menu.hide(); 
});

var where = new UI.Card({  
  fullscreen: true,
  title:'Position',

});

var subMenu;

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
    
  console.log('lat= ' + lat + ' lon= ' + lon);
  where.subtitle(lat + ", " + lon);
    
  f.getNearbyStops([lat, lon], function(nearbyStops) {
     nearbyStops.map(function(stop) {
        return {title: stop.name};
    }).forEach(function(item, index) {
        menu.item(1, index, item);
    });
    
    menu.on('select', function(e) {
        var selectedStop = nearbyStops[e.itemIndex];
        subMenu = new UI.Menu({
            title: selectedStop.name,
        });
        subMenu.on('click', 'back', function() {
            subMenu.hide();
        });
        
        f.getDepartureboardFrom(selectedStop, function(departures) {
           departures.forEach(function(item, index) {
               subMenu.item(0, index, {
                   title: item.name,
                   subtitle: (item.rtTime || item.time) + " " + item.direction
               });
           });
        });
        subMenu.show();
      console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
      console.log('The item is titled "' + e.item.title + '"'); 
  });
    
    });
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


