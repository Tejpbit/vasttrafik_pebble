var utils = require("utils");


var Station = utils.makeStruct("id name gpscoord");
   
Station.addPreferredLine = function(line, station) {
   preferredLinesIsSet(station);
   
   station.preferredLines.push(line);
};

Station.removePreferredLine = function(line, station) {
   preferredLinesIsSet(station);
   var indexOf = station.preferredLines.indexOf(line)
   if (indexOf > -1) {
      station.preferredLines = station.preferredLines.splice(indexOf, 1);
   }
};
      
function preferredLinesIsSet(station) {
   if (station.preferredLines === undefined) {
      station.preferredLines = [];
   }
}