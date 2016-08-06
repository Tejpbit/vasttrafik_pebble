var favourites = {};

var FAVOURITES_KEY = "favourites";
var favourite_stops = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]');


favourites.saveToStorage = function() {
   localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourite_stops));
};

favourites.toggle = function(item) {
   var i = favourite_stops.indexOf(item);
   if (i > -1) {
      console.log('Remove item');
      this.remove(item);
   } else {
      console.log('Add item');
      this.add(item);
   }
};

favourites.add = function(item) {
   var i = favourite_stops.indexOf(item);
   if (i === -1) {
      favourite_stops.push(item);
      this.saveToStorage();
   }
};

favourites.remove = function(item) {
    var i = favourite_stops.indexOf(item);
    if (i > -1) {
       favourite_stops.splice(i, 1);
       this.saveToStorage();
    }
        
};

this.exports = favourites;