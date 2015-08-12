var utils = require('utils');

var favourites = {};

var FAVOURITES_KEY = "favourites";
var stops = localStorage.getItem(FAVOURITES_KEY) || [];


favourites.saveToStorage = function() {
    localStorage.setItem(FAVOURITES_KEY, stops);
};

favourites.add = function(stop) {
   if (! this.contains(stops, stop))
       stops.push(stop.id);
};

favourites.remove = function(stop) {
    var i = stops.indexOf(stop.id);
    if (i > -1)
        stops.splice(i, 1);
}

favourites.contains = function(stop) {
    return utils.contains(stops, stop.id);
}

this.exports = favourites;