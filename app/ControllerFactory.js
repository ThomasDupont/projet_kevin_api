
const fs = require('fs');
const path = require('path');
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

readRecursive(path.join(__dirname , '../src/'));

class ControllerFactory {

    init (controllerName, method, req)
    {
        return controller[controllerName+"Controller"][method+"Action"](req);
    }
}

module.exports = new ControllerFactory();