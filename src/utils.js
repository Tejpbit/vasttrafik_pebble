var utils = {};

utils.contains = function (elem, array) {
    for (var i = 0 , len = array.length; i < len; i++) {
        if(elem == array[i]) {
            return true;
        }
    }
    return false;
};

this.exports = utils;