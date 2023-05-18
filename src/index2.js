const { existRoute, absoluteRoute } = require('./route.js');
const fs = require('fs');
const userPath = process.argv[2];
const absoluteRoute1 = 'D:/BOOTCAMP/MD_Links/MD_Links_Sandra/src/prueba/prueba.md'
const mdFiles = [];
const path = require('path');


/* Recibe una ruta de usuario como entrada. Crea una promesa que verifica si la ruta existe utilizando la función 'existRoute'. 
Si la ruta existe, utiliza la función 'absoluteRoute' para obtener la ruta absoluta y luego resuelve la promesa con la ruta absoluta. 
Si la ruta no existe, rechaza la promesa con el mensaje de error "Error". */
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

/* Se llama a la función mdLinks con la variable 'userPath' como argumento. Luego se encadenan los métodos 'then' y 'catch' para manejar el resultado de la promesa. 
Si la promesa se resuelve, se imprime "Es válida la ruta: [ruta]" donde [ruta] es la ruta absoluta resuelta. Si la promesa es rechazada, se imprime el mensaje de error. */
mdLinks(userPath)
  .then((resolvePath) => {
    console.log(`Es válida La ruta: ${resolvePath}`);
  })
  .catch((error) => {
    console.log(error);
  });

  const extractMDFiles = (directory) => {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.lstatSync(filePath).isFile() && path.extname(filePath) === '.md') {
        mdFiles.push(filePath);
        // Aquí puedes hacer lo que necesites con el archivo MD
      } else if (fs.lstatSync(filePath).isDirectory()) {
        extractMDFiles(filePath);
      }
    });
     
  };

/* Toma una ruta absoluta como entrada. Utiliza 'fs.lstatSync' para verificar si la ruta es un archivo o un directorio. Si es un archivo, imprime "Es un archivo". 
Si es un directorio, imprime "Es un directorio". Si la ruta no existe, imprime "No existe". */  
const validateFileDirectory = (absoluteRoute) => {
  if (fs.lstatSync(absoluteRoute).isFile()) {
    console.log('Es un archivo');
    // Aquí puedes hacer lo que necesites con el archivo
  } else if (fs.lstatSync(absoluteRoute).isDirectory()) {
    console.log('Es un directorio');
    extractMDFiles(absoluteRoute);
    console.log('Archivos .md encontrados:');
    mdFiles.forEach((filePath) => {
      console.log(filePath);
    });
  } else {
    console.log('No existe');
  }
};

//return mdFiles;
// extractMDFiles(mdFiles);
 //validateFileDirectory(absoluteRoute1);
  
module.exports = { mdLinks,  validateFileDirectory, mdFiles }