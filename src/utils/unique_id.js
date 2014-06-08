var idCounter = 0;

function uniqueId (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
}

module.exports = uniqueId;
