var utils = require('utils');

var favourites = {};

var FAVOURITES_KEY = "favourites";
var favourite_stops = localStorage.getItem(FAVOURITES_KEY) || [];


favourites.saveToStorage = function() {
    localStorage.setItem(FAVOURITES_KEY, favourite_stops);
};

favourites.add = function(stop) {
   if (! this.contains(favourite_stops, stop))
       favourite_stops.push(stop.id);
};

favourites.remove = function(stop) {
    var i = favourite_stops.indexOf(stop.id);
    if (i > -1)
        favourite_stops.splice(i, 1);
};

favourites.contains = function(stop) {
    return utils.contains(favourite_stops, stop.id);
};

favourites.prioritizeIfPresent = function(stops) {
    stops.sort(function(a, b) {
        return favourites.contains(b) ? 1 : -1;
    });
    
    return stops;
};

this.exports = favourites;