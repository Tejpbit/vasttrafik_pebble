var UI = require('ui');
var f = require('functions');

var menu = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: 'white',
    highlightTextColor: 'black',
    sections: [{
        title: 'Favourites',
        items: [{
            title: 'the fuq'
        }]   
    }]
});

var where = new UI.Card({  
  fullscreen: true,
  title:'Position',

});


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
    
  var nearbyStops = f.getNearbyStops([lat, lon]);
  console.log(f.tjenna);
  
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


