
const fs = require('fs');
let controller = {};

function readRecursive(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            readRecursive(dir + file + '/');
        }
        else if (file.indexOf('Controller') !== -1) {
            file = file.split('.')[0];
            controller[file] = require(dir + file);
        }
    });
}

readRecursive(ROOT+'/src/');

class ControllerFactory {

    init (controller, method, req)
    {
        return controller[controller+"Controller"][method+"Action"](req);
    }
}

module.exports = new ControllerFactory();