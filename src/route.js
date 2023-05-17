const path = require('path');
const fs = require('fs');

// Validar si la ruta existe

const existRoute = (userPath) => {
    if (fs.existsSync(userPath)){
        console.log('La ruta existe')
        return true;
    } else {
        console.log('la ruta no existe')
        return false;
    }
};

// Validar si la ruta es absoluta, sino la transformo en absoluta
const absoluteRoute = (userPath) => {
    if(path.isAbsolute(userPath)) {
        return userPath
    } else {
        return path.resolve(userPath);
    }
};

module.exports = {
    existRoute,absoluteRoute
}
