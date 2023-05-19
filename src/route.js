const path = require('path');
const fs = require('fs');

/* Verifica existencia de ruta */
const existRoute = (userPath) => {
    if (fs.existsSync(userPath)){
        // console.log('La ruta existe')
        return true;
    } 
        console.log('la ruta no existe')
        return false;
    
};

/* Verifica si es ruta absoluta, sino se convierte */
const absoluteRoute = (userPath) => {
    if(path.isAbsolute(userPath)) {
        return userPath
    } 
        return path.resolve(userPath);
    
};

module.exports = { existRoute, absoluteRoute };
