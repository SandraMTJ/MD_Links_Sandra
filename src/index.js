const { existRoute, absoluteRoute } = require('./route.js');
const fs = require('fs');
const userPath = process.argv[2];
const path = require('path');
const { marked } = require('marked');
const { load } = require('cheerio');

// Función MD-Links
const mdLinks = (userPath) => new Promise((resolve, reject) => {
  if (existRoute(userPath)) {
    const resolvedPath = absoluteRoute(userPath);
    resolve(resolvedPath);
  } else {
    reject('Error');
  }
});

// Función para leer y procesar los archivos Markdown
const processMarkdownFile = (filePath) => {
  console.log(filePath)
  fs.readFile(filePath, 'utf8',(error, markdownContent)=>{
    if(error){
      console.log(error)

      return
    }
      const htmlContent = marked(markdownContent);
      const htmlDom = load(htmlContent);
      console.log(htmlDom);
      // console.log(`Contenido HTML del archivo ${filePath}:`);
      console.log(htmlContent);
  })
};

mdLinks(userPath)
  .then((resolvePath) => {
    // console.log(`La ruta: ${resolvePath} es válida`);
    const mdFiles = validateFileDirectory(resolvePath);
   //console.log('Archivos .md encontrados:', mdFiles);
   for(let i=0; i< mdFiles.length; i++) {
    processMarkdownFile(mdFiles[i])
   // console.log(mdFiles[i])
   }
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

module.exports = {
  mdLinks, validateFileDirectory, processMarkdownFile
};
