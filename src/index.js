
const { existRoute, absoluteRoute } = require('./route.js');
const fs = require('fs');
const userPath = process.argv[2];
const absoluteRoute1 = 'D:/BOOTCAMP/MD_Links/MD_Links_Sandra/src/prueba/prueba.md'

// Función MD-Links
const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {
    if (existRoute(userPath)) {
      const resolvedPath = absoluteRoute(userPath);
      resolve(resolvedPath);
    } else { 
      reject('Error')
    }
  });
};

mdLinks(userPath)
  .then((resolvePath) => {
    console.log(`La ruta: ${resolvePath} es válida`);
  })
  .catch((error) => {
    console.log(error);
    // console.log(`Error: ${error}`);
  });
    
const validateFileDirectory = (absoluteRoute) => {
    if(fs.lstatSync(absoluteRoute).isFile()){
        return console.log('Es un archivo');
    };
    if(fs.lstatSync(absoluteRoute).isDirectory()){
        return console.log('Es un directorio');
    }
    else {
        return console.log('No existe');
    }
};
validateFileDirectory(absoluteRoute1);

  
  module.exports = {
    mdLinks,  validateFileDirectory,
  }