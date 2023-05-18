const { existRoute, absoluteRoute } = require('./route.js');
const fs = require('fs');
const userPath = process.argv[2];
const path = require('path');
const marked = require('marked');

// Función MD-Links
const mdLinks = (userPath) => new Promise((resolve, reject) => {
  if (existRoute(userPath)) {
    const resolvedPath = absoluteRoute(userPath);
    resolve(resolvedPath);
  } else {
    reject('Error');
  }
});

mdLinks(userPath)
  .then((resolvePath) => {
    console.log(`La ruta: ${resolvePath} es válida`);
    const mdFiles = validateFileDirectory(resolvePath);
    console.log('Archivos .md encontrados:', mdFiles);
  })
  .catch((error) => {
    console.log(error);
  });

// Función validar si es archivo o directorio y muestra en array los .md
const validateFileDirectory = (absoluteRoute) => {
  let mdFiles = [];
  if (fs.lstatSync(absoluteRoute).isFile() && path.extname(absoluteRoute) === '.md') {
    mdFiles.push(absoluteRoute);
    // return console.log('Es un archivo');
  }
  if (fs.lstatSync(absoluteRoute).isDirectory()) {
    const routesArray = fs.readdirSync(absoluteRoute);
    routesArray.forEach((rt) => {
      const pathNew = path.join(absoluteRoute, rt);
      mdFiles = mdFiles.concat(validateFileDirectory(pathNew));
    });
  } else {

  }
  return mdFiles;
};
// validateFileDirectory(absoluteRoute1);

module.exports = {
  mdLinks, validateFileDirectory,
};
