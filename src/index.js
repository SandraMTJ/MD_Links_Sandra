const { existRoute } = require('./route.js');
const fs = require('fs');
const process = require('process');
const userPath = process.argv[2];
//const options = process.argv[3];
const path = require('path');
const { marked } = require('marked');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
//const fetch = require('node-fetch');

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
  //  return [];
  }
  return mdFiles;
};

// Función MD-Links
const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {
    if (!existRoute(userPath)) {
      reject(new Error('Error, la ruta no existe'));
    } else { 
      const arrayFiles = validateFileDirectory(userPath);
      getAllLinks(arrayFiles)
      .then((res) => {
        resolve(res.flat());
      });
    }
  });
};

// Función para leer y procesar los archivos Markdown
const processMarkdownFile = (filePath) => {
  return new Promise((resolve, reject) => {
    console.log(filePath);
    fs.readFile(filePath, 'utf8', (error, markdownContent) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      const htmlContent = marked(markdownContent, { headerIds: false, mangle: false });
      const dom = new JSDOM(htmlContent);
      const linksA = dom.window.document.querySelectorAll('a');
      const arrayElements = [];
      linksA.forEach((links) => {
        const objectsElements = {
          href: links.href,
          text: links.textContent,
          file: filePath
        };
        arrayElements.push(objectsElements);
      });
     // console.log(arrayElements);
      resolve(arrayElements);
    });
  });
};


const getAllLinks = (mdFiles) => {
  const arrayAllLinks = mdFiles.map((file) => {
    return processMarkdownFile(file);
  });
  return Promise.all(arrayAllLinks);
};

mdLinks(userPath)
  .then((result) => {
    console.log('Array de Objetos:', result);
  })
  .catch((error) => {
    // console.log(error);
    // console.log(`Error: ${error}`);
    return error;
  });

module.exports = {
  mdLinks, validateFileDirectory, processMarkdownFile, getAllLinks
};
